"use server"

import Booking from "@/database/booking.model";
import connectDB from "../mongodb"

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    try {
        await connectDB();
        await Booking.create({ eventId, slug, email })
        return { success: true }
    } catch (error) {
        return { sucess: false }
    }
}