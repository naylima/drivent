import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBookingbyUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    }
  });
}

async function countRoomBookings(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId
    }
  });
}

async function upsert(booking: CreateBookingParams, id?: number) {
  return prisma.booking.upsert({
    where: {
      id: id || 0
    },
    create: booking,
    update: {
      roomId: booking.roomId
    }
  });
}

export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const bookingRepository = {
  findBookingbyUserId,
  countRoomBookings,
  upsert
};

export default bookingRepository;
