import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        await connectDB()
        const event = await Event.findOne({
            slug: slug
        })

        if (!event) return NextResponse.json({ message: "No such event exists!" }, { status: 404 });

        return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to fetch event", error }, { status: 400 })
    }

}