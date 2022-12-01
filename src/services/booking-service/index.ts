import { forbiddenError, notFoundError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";
import bookingRepository, { CreateBookingParams } from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
  const bookingWithRoom = await bookingRepository.findBookingbyUserId(userId);
  if(!bookingWithRoom) throw notFoundError(); 

  return {
    ...exclude(bookingWithRoom, "userId", "roomId", "createdAt", "updatedAt")
  };
}

async function createOrUpdateBooking(params: CreateBookingParams, bookingId?: number) {
  await permission(params.userId);

  const findBooking = await bookingRepository.findBookingbyUserId(params.userId);
  if (!findBooking && bookingId ) throw forbiddenError();

  const room = await roomRepository.findRoomById(params.roomId);
  if(!room) throw notFoundError();
    
  const vacancies = await bookingRepository.countRoomBookings(room.id);
  if(vacancies === room.capacity) throw forbiddenError();
  
  const booking = ( bookingId? 
    await bookingRepository.upsert(params, bookingId) :
    await bookingRepository.upsert(params)
  );  
  
  return { bookingId: booking.id };
}

async function permission(userId: number ) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (
    !ticket || 
    ticket.status === "RESERVED" || 
    ticket.TicketType.isRemote || 
    !ticket.TicketType.includesHotel
  ) {
    throw forbiddenError();
  }
}

const bookingService = {
  getBooking,
  createOrUpdateBooking
};
  
export default bookingService;
