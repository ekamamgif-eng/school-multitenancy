import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, X, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react'

interface Event {
    id: string
    title: string
    date: string
    time: string
    location: string
    attendees: number
    type: 'class' | 'exam' | 'meeting' | 'event'
    color: string
    description?: string
}

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    // Form State
    const [formData, setFormData] = useState<Omit<Event, 'id' | 'color'>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        location: '',
        attendees: 0,
        type: 'class',
        description: ''
    })

    // Initialize events from localStorage or default data
    const [events, setEvents] = useState<Event[]>(() => {
        const savedEvents = localStorage.getItem('school_events')
        if (savedEvents) {
            return JSON.parse(savedEvents)
        }
        return [
            {
                id: '1',
                title: 'Mathematics Class',
                date: '2024-01-25',
                time: '09:00',
                location: 'Room 101',
                attendees: 30,
                type: 'class',
                color: '#3b82f6'
            },
            {
                id: '2',
                title: 'Science Exam',
                date: '2024-01-26',
                time: '10:30',
                location: 'Exam Hall A',
                attendees: 45,
                type: 'exam',
                color: '#ef4444'
            },
            {
                id: '3',
                title: 'Parent-Teacher Meeting',
                date: '2024-01-27',
                time: '14:00',
                location: 'Conference Room',
                attendees: 15,
                type: 'meeting',
                color: '#10b981'
            },
            {
                id: '4',
                title: 'Sports Day',
                date: '2024-01-28',
                time: '08:00',
                location: 'Sports Ground',
                attendees: 150,
                type: 'event',
                color: '#f59e0b'
            }
        ]
    })

    // Save to localStorage whenever events change
    useEffect(() => {
        localStorage.setItem('school_events', JSON.stringify(events))
    }, [events])

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'class': return '#3b82f6'
            case 'exam': return '#ef4444'
            case 'meeting': return '#10b981'
            case 'event': return '#f59e0b'
            default: return '#6b7280'
        }
    }

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
        .filter(event => new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
        .slice(0, 5)

    // CRUD Handlers
    const handleOpenAddModal = () => {
        setEditingEvent(null)
        setFormData({
            title: '',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            location: '',
            attendees: 0,
            type: 'class',
            description: ''
        })
        setShowModal(true)
    }

    const handleOpenEditModal = (event: Event) => {
        setEditingEvent(event)
        setFormData({
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            attendees: event.attendees,
            type: event.type,
            description: event.description || ''
        })
        setShowModal(true)
    }

    const handleDeleteEvent = (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(e => e.id !== id))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const color = getEventTypeColor(formData.type)

        if (editingEvent) {
            // Update existing
            setEvents(prev => prev.map(ev =>
                ev.id === editingEvent.id
                    ? { ...formData, id: ev.id, color }
                    : ev
            ))
        } else {
            // Create new
            const newEvent: Event = {
                ...formData,
                id: Date.now().toString(),
                color
            }
            setEvents(prev => [...prev, newEvent])
        }

        setShowModal(false)
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calendar</h1>
                    <p className="page-subtitle">Schedule and manage your events</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
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
                                        onClick={() => {
                                            // Optional: Click day to add event for that date
                                            // setFormData(prev => ({ ...prev, date: ... }))
                                            // handleOpenAddModal()
                                        }}
                                    >
                                        <span className="calendar-day-number">{day}</span>
                                        {dayEvents.length > 0 && (
                                            <div className="calendar-day-events">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="calendar-day-event"
                                                        style={{ backgroundColor: event.color, cursor: 'pointer' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleOpenEditModal(event)
                                                        }}
                                                        title={event.title}
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
                        {upcomingEvents.length === 0 ? (
                            <p className="text-gray-500 text-sm">No upcoming events.</p>
                        ) : (
                            upcomingEvents.map(event => (
                                <div key={event.id} className="upcoming-event-card group relative">
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

                                    {/* Action Buttons */}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow-sm">
                                        <button
                                            onClick={() => handleOpenEditModal(event)}
                                            className="p-1 hover:bg-gray-100 rounded text-blue-600"
                                            title="Edit"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
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

            {/* Add/Edit Event Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Annual Sports Day"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="form-input"
                                    >
                                        <option value="class">Class</option>
                                        <option value="exam">Exam</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Attendees (Approx)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.attendees}
                                        onChange={e => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Main Auditorium"
                                        className="form-input pl-10"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add any additional details..."
                                    className="form-input"
                                    rows={3}
                                />
                            </div>

                            <div className="modal-footer" style={{ marginTop: '1rem', padding: 0 }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingEvent ? 'Save Changes' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CalendarPage
