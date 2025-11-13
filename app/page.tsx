import EventCard from "@/components/EventCard/EventCard"
import ExploreBtn from "../components/ExploreBtn/ExploreBtn"
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  'use cache';
  cacheLife("hours")
  const res = await fetch(`${BASE_URL}/api/events`)
  if(!res) throw new Error("Server Error");

  const {events} = await res.json()
  // console.log(events)

  return (
    <section className="flex flex-col justify-center align-middle">
      <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn/>

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        
        <ul className="md:grid md:grid-cols-3 md:gap-4">
          {events && events.length>0 && events.map((el:IEvent)=>{
            return <EventCard key={el.title} title={el.title} image={el.image} location={el.location} date={el.date} time={el.time} slug={el.slug}/>
          })}
        </ul>

        </div>
    </section>
  )
}

export default Home