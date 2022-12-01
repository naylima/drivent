import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { User, Room } from "@prisma/client";
import { createUser } from "../factories";

export async function createBooking(room: Room, user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.booking.create({
    data: {
      userId: incomingUser.id,
      roomId: room.id
    },
    include: {
      Room: true
    }
  });
}
