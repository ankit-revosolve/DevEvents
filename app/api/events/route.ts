import { v2 as cloudinary } from "cloudinary";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDB();

        const formData = await req.formData()
        let event;
        try {
            event = Object.fromEntries(formData.entries())
        } catch (error) {
            console.error(error)
            return NextResponse.json({message:"Invalid Event Entries"},{status:400})
        }

        const file = formData.get('image') as File

        const arrayBuffer = await file.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer)

        const imageUploadResult = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:"image",folder:"events"},(err,result)=>{
                if(err) return reject(err)

                resolve(result);
            }).end(buffer)
        })

        event.image = (imageUploadResult as {secure_url:string}).secure_url;
        const parsedTags = JSON.parse(formData.get("tags") as string)
        const parsedAgenda = JSON.parse(formData.get("agenda") as string) 


        const createdEvent = await Event.create({
            ...event,
            parsedAgenda,
            parsedTags
        });

        return NextResponse.json({message:"Event created successfully",event: createdEvent},{status:201})
    }catch(e){
        console.error(e)
        return NextResponse.json({message:"Event creation Failed",error: e instanceof Error ? e.message : "Unknown"},{status:400})
    }
}


export async function GET(){
    try {
        await connectDB()
        const events = await Event.find().sort({createdAt:-1})

        if(events.length == 0) return NextResponse.json({message:"No events to show"},{status:200})
        
        return NextResponse.json({message:"Events fetched successfully",events},{status:200})

    } catch (error) {
        console.error(error)
        return NextResponse.json({message:"Event fetching failed",error},{status:400})
    }
} 