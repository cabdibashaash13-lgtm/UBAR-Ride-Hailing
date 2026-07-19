import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketTripRequest, SocketDriverLocation, SocketTripUpdate } from "@ubar/shared-types";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3003"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track online drivers and their locations
const driverLocations = new Map<string, { lat: number; lng: number; timestamp: number }>();
const driverSockets = new Map<string, string>(); // driverId -> socketId
const passengerSockets = new Map<string, string>(); // passengerId -> socketId

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Driver registration
  socket.on("driver:register", (driverId: string) => {
    driverSockets.set(driverId, socket.id);
    socket.join(`driver:${driverId}`);
    socket.join("drivers");
    console.log(`Driver registered: ${driverId}`);
  });

  // Passenger registration
  socket.on("passenger:register", (passengerId: string) => {
    passengerSockets.set(passengerId, socket.id);
    socket.join(`passenger:${passengerId}`);
    console.log(`Passenger registered: ${passengerId}`);
  });

  // Admin registration
  socket.on("admin:register", () => {
    socket.join("admins");
    console.log(`Admin registered: ${socket.id}`);
  });

  // Driver location update
  socket.on("driver:location", (data: SocketDriverLocation) => {
    driverLocations.set(data.driverId, {
      lat: data.lat,
      lng: data.lng,
      timestamp: data.timestamp,
    });

    // Broadcast to passengers tracking this driver
    io.to(`trip:driver:${data.driverId}`).emit("driver:location:update", data);
  });

  // Trip request from passenger -> nearby drivers
  socket.on("trip:request", (data: SocketTripRequest & { nearbyDriverIds?: string[] }) => {
    // Send to specific nearby drivers or all drivers
    if (data.nearbyDriverIds && data.nearbyDriverIds.length > 0) {
      data.nearbyDriverIds.forEach((driverId) => {
        io.to(`driver:${driverId}`).emit("trip:request", data);
      });
    } else {
      io.to("drivers").emit("trip:request", data);
    }

    // Also notify admins
    io.to("admins").emit("trip:request:new", data);
  });

  // Driver accepts trip
  socket.on("trip:accept", (data: SocketTripUpdate) => {
    io.to(`passenger:${data.tripId}`).emit("trip:accepted", data);
    io.to(`trip:${data.tripId}`).emit("trip:update", data);
    io.to("admins").emit("trip:update", data);
  });

  // Driver rejects trip
  socket.on("trip:reject", (data: { tripId: string; driverId: string }) => {
    io.to(`trip:${data.tripId}`).emit("trip:rejected", data);
  });

  // Trip started
  socket.on("trip:start", (data: SocketTripUpdate) => {
    io.to(`passenger:${data.tripId}`).emit("trip:started", data);
    io.to(`trip:${data.tripId}`).emit("trip:update", data);
    io.to("admins").emit("trip:update", data);
  });

  // Trip completed
  socket.on("trip:complete", (data: SocketTripUpdate) => {
    io.to(`passenger:${data.tripId}`).emit("trip:completed", data);
    io.to(`trip:${data.tripId}`).emit("trip:update", data);
    io.to("admins").emit("trip:update", data);
  });

  // Trip cancelled
  socket.on("trip:cancel", (data: SocketTripUpdate & { reason?: string }) => {
    io.to(`trip:${data.tripId}`).emit("trip:cancelled", data);
    io.to("drivers").emit("trip:cancelled", data);
    io.to("admins").emit("trip:update", data);
  });

  // Join trip room (for passenger and driver tracking)
  socket.on("trip:join", (tripId: string) => {
    socket.join(`trip:${tripId}`);
  });

  // Leave trip room
  socket.on("trip:leave", (tripId: string) => {
    socket.leave(`trip:${tripId}`);
  });

  // Track specific driver
  socket.on("driver:track", (driverId: string) => {
    socket.join(`trip:driver:${driverId}`);
    // Send current location immediately
    const location = driverLocations.get(driverId);
    if (location) {
      socket.emit("driver:location:update", { driverId, ...location });
    }
  });

  // Stop tracking driver
  socket.on("driver:untrack", (driverId: string) => {
    socket.leave(`trip:driver:${driverId}`);
  });

  // Get nearby drivers
  socket.on("drivers:nearby", (data: { lat: number; lng: number; radiusKm: number }, callback: (drivers: string[]) => void) => {
    const nearby: string[] = [];
    const R = 6371;

    driverLocations.forEach((loc, driverId) => {
      const dLat = ((loc.lat - data.lat) * Math.PI) / 180;
      const dLng = ((loc.lng - data.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((data.lat * Math.PI) / 180) *
          Math.cos((loc.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance <= data.radiusKm) {
        nearby.push(driverId);
      }
    });

    callback(nearby);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    // Clean up driver
    for (const [driverId, socketId] of driverSockets.entries()) {
      if (socketId === socket.id) {
        driverSockets.delete(driverId);
        driverLocations.delete(driverId);
        console.log(`Driver disconnected: ${driverId}`);
        break;
      }
    }

    // Clean up passenger
    for (const [passengerId, socketId] of passengerSockets.entries()) {
      if (socketId === socket.id) {
        passengerSockets.delete(passengerId);
        console.log(`Passenger disconnected: ${passengerId}`);
        break;
      }
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});

export { io, driverLocations, driverSockets, passengerSockets };
