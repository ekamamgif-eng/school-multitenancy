import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-react'

interface Event {
    id: string
    title: string
    date: string
    time: string
    location: string
    attendees: number
    type: 'class' | 'exam' | 'meeting' | 'event'
    color: string
}

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date())

    const [events] = useState<Event[]>([
        {
            id: '1',
            title: 'Mathematics Class',
            date: '2024-01-25',
            time: '09:00 AM',
            location: 'Room 101',
            attendees: 30,
            type: 'class',
            color: '#3b82f6'
        },
        {
            id: '2',
            title: 'Science Exam',
            date: '2024-01-26',
            time: '10:30 AM',
            location: 'Exam Hall A',
            attendees: 45,
            type: 'exam',
            color: '#ef4444'
        },
        {
            id: '3',
            title: 'Parent-Teacher Meeting',
            date: '2024-01-27',
            time: '02:00 PM',
            location: 'Conference Room',
            attendees: 15,
            type: 'meeting',
            color: '#10b981'
        },
        {
            id: '4',
            title: 'Sports Day',
            date: '2024-01-28',
            time: '08:00 AM',
            location: 'Sports Ground',
            attendees: 150,
            type: 'event',
            color: '#f59e0b'
        }
    ])

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate()

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay()

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const getEventsForDate = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return events.filter(event => event.date === dateStr)
    }

    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calendar</h1>
                    <p className="page-subtitle">Schedule and manage your events</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={20} />
                    Add Event
                </button>
            </div>

            <div className="calendar-layout">
                <div className="calendar-main">
                    <div className="calendar-header">
                        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <div className="calendar-nav">
                            <button onClick={previousMonth} className="calendar-nav-btn">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={nextMonth} className="calendar-nav-btn">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        <div className="calendar-weekdays">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="calendar-weekday">{day}</div>
                            ))}
                        </div>

                        <div className="calendar-days">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="calendar-day calendar-day--empty" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const dayEvents = getEventsForDate(day)
                                const isToday =
                                    day === new Date().getDate() &&
                                    currentDate.getMonth() === new Date().getMonth() &&
                                    currentDate.getFullYear() === new Date().getFullYear()

                                return (
                                    <div
                                        key={day}
                                        className={`calendar-day ${isToday ? 'calendar-day--today' : ''} ${dayEvents.length > 0 ? 'calendar-day--has-events' : ''}`}
                                    >
                                        <span className="calendar-day-number">{day}</span>
                                        {dayEvents.length > 0 && (
                                            <div className="calendar-day-events">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="calendar-day-event"
                                                        style={{ backgroundColor: event.color }}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="calendar-day-more">+{dayEvents.length - 2} more</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="calendar-sidebar">
                    <div className="upcoming-events">
                        <h3>Upcoming Events</h3>
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="upcoming-event-card">
                                <div className="event-indicator" style={{ backgroundColor: event.color }} />
                                <div className="event-content">
                                    <h4>{event.title}</h4>
                                    <div className="event-details">
                                        <span className="event-detail">
                                            <Clock size={14} />
                                            {event.time}
                                        </span>
                                        <span className="event-detail">
                                            <MapPin size={14} />
                                            {event.location}
                                        </span>
                                        <span className="event-detail">
                                            <Users size={14} />
                                            {event.attendees} attendees
                                        </span>
                                    </div>
                                    <div className="event-date">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="event-legend">
                        <h4>Event Types</h4>
                        <div className="legend-items">
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#3b82f6' }} />
                                <span>Classes</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
                                <span>Exams</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#10b981' }} />
                                <span>Meetings</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#f59e0b' }} />
                                <span>Events</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage
