'use client'
import { createBooking } from "@/lib/actions/booking.actions"
import { useState } from "react"

const BookEvent = ({eventId,slug}) => {
    const [submitted, setSubmitted] = useState(false)

    async function submitEmail(formData){
        const email = formData.get("email")

        const {sucess} = await createBooking({eventId,slug,email})
        if(sucess){
            setSubmitted(true)
        }else{
            console.error("Booking Creation Failed",error.message)
        }
    } 

    return (
        <div id="book-event" >
            {submitted ? (
                <p className="text-sm">Thank you for signing up</p>
            ) : (
                <form action={submitEmail}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" placeholder="Enter your Email Address" id="email" />
                    </div>
                    <button className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}

export default BookEvent