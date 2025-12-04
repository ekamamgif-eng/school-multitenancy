import { supabase } from './supabase'

export interface EventData {
    id?: string
    title: string
    description?: string
    date: string
    time: string
    location: string
    attendees: number
    type: 'class' | 'exam' | 'meeting' | 'event'
    color?: string
}

export interface DatabaseEvent {
    id: string
    tenant_id: string
    title: string
    description: string | null
    event_date: string
    event_time: string
    location: string
    attendees: number
    event_type: 'class' | 'exam' | 'meeting' | 'event'
    color: string
    created_by: string | null
    created_at: string
    updated_at: string
}

/**
 * Transform database event to frontend Event interface
 */
export const transformEvent = (dbEvent: DatabaseEvent): EventData => ({
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || undefined,
    date: dbEvent.event_date,
    time: dbEvent.event_time,
    location: dbEvent.location,
    attendees: dbEvent.attendees,
    type: dbEvent.event_type,
    color: dbEvent.color
})

/**
 * Get event type color
 */
export const getEventTypeColor = (type: string): string => {
    switch (type) {
        case 'class': return '#3b82f6'
        case 'exam': return '#ef4444'
        case 'meeting': return '#10b981'
        case 'event': return '#f59e0b'
        default: return '#6b7280'
    }
}

/**
 * Fetch all events from database
 */
export const fetchEvents = async (): Promise<EventData[]> => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })

    if (error) {
        console.error('Error fetching events:', error)
        throw error
    }

    return (data as DatabaseEvent[]).map(transformEvent)
}

/**
 * Fetch events for a specific date range
 */
export const fetchEventsByDateRange = async (
    startDate: string,
    endDate: string
): Promise<EventData[]> => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', startDate)
        .lte('event_date', endDate)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })

    if (error) {
        console.error('Error fetching events by date range:', error)
        throw error
    }

    return (data as DatabaseEvent[]).map(transformEvent)
}

/**
 * Fetch upcoming events
 */
export const fetchUpcomingEvents = async (limit: number = 5): Promise<EventData[]> => {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })
        .limit(limit)

    if (error) {
        console.error('Error fetching upcoming events:', error)
        throw error
    }

    return (data as DatabaseEvent[]).map(transformEvent)
}

/**
 * Create a new event
 */
export const createEvent = async (eventData: EventData): Promise<EventData> => {
    const { data, error } = await supabase
        .from('events')
        .insert([{
            title: eventData.title,
            description: eventData.description || null,
            event_date: eventData.date,
            event_time: eventData.time,
            location: eventData.location,
            attendees: eventData.attendees,
            event_type: eventData.type,
            color: eventData.color || getEventTypeColor(eventData.type)
        }])
        .select()
        .single()

    if (error) {
        console.error('Error creating event:', error)
        throw error
    }

    return transformEvent(data as DatabaseEvent)
}

/**
 * Update an existing event
 */
export const updateEvent = async (id: string, eventData: EventData): Promise<EventData> => {
    const { data, error } = await supabase
        .from('events')
        .update({
            title: eventData.title,
            description: eventData.description || null,
            event_date: eventData.date,
            event_time: eventData.time,
            location: eventData.location,
            attendees: eventData.attendees,
            event_type: eventData.type,
            color: eventData.color || getEventTypeColor(eventData.type)
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating event:', error)
        throw error
    }

    return transformEvent(data as DatabaseEvent)
}

/**
 * Delete an event
 */
export const deleteEvent = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting event:', error)
        throw error
    }
}

/**
 * Subscribe to real-time changes
 */
export const subscribeToEvents = (
    callback: (payload: any) => void
) => {
    const subscription = supabase
        .channel('events_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'events' },
            callback
        )
        .subscribe()

    return subscription
}

/**
 * Migrate events from localStorage to database
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
    const localEvents = localStorage.getItem('school_events')
    if (!localEvents) {
        console.log('No events to migrate from localStorage')
        return
    }

    try {
        const events = JSON.parse(localEvents)

        for (const event of events) {
            await createEvent({
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                attendees: event.attendees,
                type: event.type,
                color: event.color
            })
        }

        // Clear localStorage after successful migration
        localStorage.removeItem('school_events')
        console.log('Successfully migrated events from localStorage')
    } catch (error) {
        console.error('Error migrating events:', error)
        throw error
    }
}
