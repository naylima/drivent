import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, createOrUpdateBooking } from "@/controllers";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", createOrUpdateBooking)
  .put("/:bookingId", createOrUpdateBooking);

export { bookingsRouter };
