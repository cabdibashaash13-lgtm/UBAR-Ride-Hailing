import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SocketDriverLocation, SocketTripRequest, SocketTripUpdate, TripStatus } from "@ubar/shared-types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}

export function useDriverSocket(driverId: string | undefined) {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket || !driverId) return;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.emit("driver:register", driverId);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, driverId]);

  const updateLocation = useCallback(
    (lat: number, lng: number) => {
      if (!socket || !driverId) return;
      socket.emit("driver:location", {
        driverId,
        lat,
        lng,
        timestamp: Date.now(),
      } as SocketDriverLocation);
    },
    [socket, driverId]
  );

  const acceptTrip = useCallback(
    (data: SocketTripUpdate) => {
      socket?.emit("trip:accept", data);
    },
    [socket]
  );

  const rejectTrip = useCallback(
    (tripId: string) => {
      if (!socket || !driverId) return;
      socket.emit("trip:reject", { tripId, driverId });
    },
    [socket, driverId]
  );

  const startTrip = useCallback(
    (data: SocketTripUpdate) => {
      socket?.emit("trip:start", data);
    },
    [socket]
  );

  const completeTrip = useCallback(
    (data: SocketTripUpdate) => {
      socket?.emit("trip:complete", data);
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    updateLocation,
    acceptTrip,
    rejectTrip,
    startTrip,
    completeTrip,
  };
}

export function usePassengerSocket(passengerId: string | undefined) {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket || !passengerId) return;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.emit("passenger:register", passengerId);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, passengerId]);

  const requestTrip = useCallback(
    (data: SocketTripRequest & { nearbyDriverIds?: string[] }) => {
      socket?.emit("trip:request", data);
    },
    [socket]
  );

  const cancelTrip = useCallback(
    (data: SocketTripUpdate) => {
      socket?.emit("trip:cancel", data);
    },
    [socket]
  );

  const joinTrip = useCallback(
    (tripId: string) => {
      socket?.emit("trip:join", tripId);
    },
    [socket]
  );

  const trackDriver = useCallback(
    (driverId: string) => {
      socket?.emit("driver:track", driverId);
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    requestTrip,
    cancelTrip,
    joinTrip,
    trackDriver,
  };
}

export function useDriverLocation(driverId: string | undefined) {
  const socket = useSocket();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!socket || !driverId) return;

    socket.emit("driver:track", driverId);

    const handler = (data: SocketDriverLocation) => {
      if (data.driverId === driverId) {
        setLocation({ lat: data.lat, lng: data.lng });
      }
    };

    socket.on("driver:location:update", handler);

    return () => {
      socket.emit("driver:untrack", driverId);
      socket.off("driver:location:update", handler);
    };
  }, [socket, driverId]);

  return location;
}

export function useTripUpdates(tripId: string | undefined) {
  const socket = useSocket();
  const [tripStatus, setTripStatus] = useState<TripStatus | null>(null);
  const [tripData, setTripData] = useState<SocketTripUpdate | null>(null);

  useEffect(() => {
    if (!socket || !tripId) return;

    socket.emit("trip:join", tripId);

    const handleUpdate = (data: SocketTripUpdate) => {
      if (data.tripId === tripId) {
        setTripStatus(data.status);
        setTripData(data);
      }
    };

    socket.on("trip:update", handleUpdate);
    socket.on("trip:accepted", handleUpdate);
    socket.on("trip:started", handleUpdate);
    socket.on("trip:completed", handleUpdate);
    socket.on("trip:cancelled", handleUpdate);

    return () => {
      socket.emit("trip:leave", tripId);
      socket.off("trip:update", handleUpdate);
      socket.off("trip:accepted", handleUpdate);
      socket.off("trip:started", handleUpdate);
      socket.off("trip:completed", handleUpdate);
      socket.off("trip:cancelled", handleUpdate);
    };
  }, [socket, tripId]);

  return { tripStatus, tripData };
}

export function useIncomingTripRequests(driverId: string | undefined) {
  const socket = useSocket();
  const [requests, setRequests] = useState<SocketTripRequest[]>([]);

  useEffect(() => {
    if (!socket || !driverId) return;

    const handler = (data: SocketTripRequest) => {
      setRequests((prev) => [...prev, data]);
    };

    socket.on("trip:request", handler);

    return () => {
      socket.off("trip:request", handler);
    };
  }, [socket, driverId]);

  const removeRequest = useCallback((tripId: string) => {
    setRequests((prev) => prev.filter((r) => r.tripId !== tripId));
  }, []);

  const clearRequests = useCallback(() => {
    setRequests([]);
  }, []);

  return { requests, removeRequest, clearRequests };
}

export { SOCKET_URL };
