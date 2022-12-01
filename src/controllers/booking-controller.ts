import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const booking = await bookingService.getBooking(req.userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createOrUpdateBooking(req: AuthenticatedRequest, res: Response) {
  const bookingId = Number(req.params.bookingId);
  try {
    const newBookingId = await bookingService.createOrUpdateBooking({
      ...req.body,
      userId: req.userId,
    }, bookingId);

    return res.status(httpStatus.OK).send(newBookingId);
  } catch (error) {
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
