import Image from "next/image";
import BookEvent from "@/components/BookEvent/BookEvent"
import { notFound } from "next/navigation";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard/EventCard";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const bookings = 10;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => {
    return (<div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>)
}

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
    return (
        <div className="agenda">
            <h2>Agenda</h2>
            <ul>
                {agendaItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)


const EventDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    'use cache';
    cacheLife('hours')
    const { slug } = await params
    const response = await fetch(`${BASE_URL}/api/events/${slug}`)

    const { event } = await response.json()
    if (!event) return notFound();

    const similarEvents = await getSimilarEventsBySlug(event.slug)
    return (
        <section id="event">
            <div className="header">
                <h1>{event.title}</h1>
                <p>{event.description}</p>
            </div>
            <div className="details">
                <div className="content">
                    <Image src={event.image} className="banner" alt={event.slug} width={800} height={800} />

                    <section className="flex-col-gap-2">
                        <h2>overview</h2>
                        <p>{event.overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={event.date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={event.location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={event.mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
                    </section>

                    <EventAgenda agendaItems={JSON.parse(event.agenda)} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organization</h2>
                        <p>{event.organizer}</p>
                    </section>

                    <EventTags tags={JSON.parse(event.tags)} />

                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book your spot</h2>
                        {bookings > 0 ? (<p className="text-sm">Join {bookings} people has already booked their spot</p>) : (
                            <p className="text-sm">Be the first to book your spot</p>
                        )}
                        <BookEvent eventId={event._id} slug={event.slug}/>
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => {
                        return <EventCard key={similarEvent.slug} title={similarEvent.title} image={similarEvent.image} location={similarEvent.location} date={similarEvent.date} time={similarEvent.time} slug={similarEvent.slug} />
                    })}
                </div>
            </div>
        </section>
    )
}

export default EventDetailPage