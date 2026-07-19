import { PrismaClient, UserRole, VehicleType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Cities
  const cities = [
    { name: "Mogadishu", nameSo: "Muqdisho", lat: 2.0469, lng: 45.3182 },
    { name: "Hargeisa", nameSo: "Hargeysa", lat: 9.5600, lng: 44.0650 },
    { name: "Garowe", nameSo: "Garoowe", lat: 8.4074, lng: 48.4900 },
    { name: "Bosaso", nameSo: "Boosaaso", lat: 11.2840, lng: 49.1810 },
    { name: "Kismayo", nameSo: "Kismaayo", lat: -0.3560, lng: 42.5454 },
    { name: "Baidoa", nameSo: "Baydhabo", lat: 3.1167, lng: 43.6500 },
    { name: "Beledweyne", nameSo: "Beledweyne", lat: 4.7358, lng: 45.2036 },
    { name: "Jowhar", nameSo: "Jawhar", lat: 2.7797, lng: 45.5000 },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city,
    });
  }
  console.log(`Seeded ${cities.length} cities`);

  // Seed Settings
  const settings = [
    { key: "bajaj_base_fare", value: "2.00", label: "Bajaj base fare (USD)" },
    { key: "bajaj_per_km", value: "0.50", label: "Bajaj per km rate (USD)" },
    { key: "motorcycle_base_fare", value: "1.50", label: "Motorcycle base fare (USD)" },
    { key: "motorcycle_per_km", value: "0.35", label: "Motorcycle per km rate (USD)" },
    { key: "currency", value: "USD", label: "Default currency" },
    { key: "sos_exchange_rate", value: "25000", label: "SOS per 1 USD" },
    { key: "min_fare_bajaj", value: "2.00", label: "Minimum fare for Bajaj (USD)" },
    { key: "min_fare_motorcycle", value: "1.50", label: "Minimum fare for Motorcycle (USD)" },
    { key: "driver_commission_rate", value: "15", label: "Platform commission (%)" },
    { key: "ride_request_timeout", value: "30", label: "Ride request timeout (seconds)" },
    { key: "max_search_radius_km", value: "5", label: "Max driver search radius (km)" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`Seeded ${settings.length} settings`);

  // Seed demo admin
  const adminUser = await prisma.user.upsert({
    where: { phone: "+252610000000" },
    update: {},
    create: {
      phone: "+252610000000",
      fullName: "Admin User",
      role: UserRole.ADMIN,
      email: "admin@ubar.so",
    },
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      isSuper: true,
    },
  });
  console.log("Seeded admin user");

  // Seed demo passenger
  await prisma.user.upsert({
    where: { phone: "+252611111111" },
    update: {},
    create: {
      phone: "+252611111111",
      fullName: "Demo Passenger",
      role: UserRole.PASSENGER,
      passenger: {
        create: {},
      },
    },
  });
  console.log("Seeded demo passenger");

  // Seed demo driver
  const driverUser = await prisma.user.upsert({
    where: { phone: "+252612222222" },
    update: {},
    create: {
      phone: "+252612222222",
      fullName: "Demo Driver",
      role: UserRole.DRIVER,
      driver: {
        create: {
          status: "APPROVED",
          isOnline: false,
          vehicle: {
            create: {
              type: VehicleType.BAJAJ,
              plateNumber: "MGD-001",
              model: "Piaggio Ape",
              color: "Green",
              year: 2023,
            },
          },
          verificationDocument: {
            create: {
              documentType: "NATIONAL_ID",
              documentNumber: "SO-12345678",
              photoUrl: "https://placeholder.co/id-card.jpg",
              status: "APPROVED",
            },
          },
        },
      },
    },
  });
  console.log("Seeded demo driver");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
