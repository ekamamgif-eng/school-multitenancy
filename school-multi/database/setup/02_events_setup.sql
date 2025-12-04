-- Create events table for calendar management
-- This table stores all calendar events including classes, exams, meetings, and general events

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location TEXT NOT NULL,
    attendees INTEGER DEFAULT 0,
    event_type TEXT NOT NULL CHECK (event_type IN ('class', 'exam', 'meeting', 'event')),
    color TEXT NOT NULL DEFAULT '#4f46e5',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better query performance
    CONSTRAINT valid_attendees CHECK (attendees >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON public.events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Users can view events from their tenant
CREATE POLICY "Users can view events from their tenant"
    ON public.events
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- 2. Authenticated users can create events for their tenant
CREATE POLICY "Users can create events for their tenant"
    ON public.events
    FOR INSERT
    WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- 3. Users can update events from their tenant
CREATE POLICY "Users can update events from their tenant"
    ON public.events
    FOR UPDATE
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- 4. Users can delete events from their tenant
CREATE POLICY "Users can delete events from their tenant"
    ON public.events
    FOR DELETE
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- Create trigger for updated_at timestamp
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

-- Insert sample data (optional - for testing)
-- Note: Replace tenant_id and created_by with actual UUIDs from your database

-- Example:
-- INSERT INTO public.events (tenant_id, title, description, event_date, event_time, location, attendees, event_type, color)
-- VALUES 
--     ('YOUR_TENANT_ID', 'Mathematics Class', 'Advanced Algebra Session', '2024-12-10', '09:00', 'Room 101', 30, 'class', '#3b82f6'),
--     ('YOUR_TENANT_ID', 'Science Exam', 'Final Semester Exam', '2024-12-15', '10:30', 'Exam Hall A', 45, 'exam', '#ef4444'),
--     ('YOUR_TENANT_ID', 'Parent-Teacher Meeting', 'Quarterly Progress Discussion', '2024-12-20', '14:00', 'Conference Room', 15, 'meeting', '#10b981'),
--     ('YOUR_TENANT_ID', 'Sports Day', 'Annual Sports Competition', '2024-12-25', '08:00', 'Sports Ground', 150, 'event', '#f59e0b');

COMMENT ON TABLE public.events IS 'Stores calendar events for school management system';
COMMENT ON COLUMN public.events.tenant_id IS 'Reference to the tenant/school this event belongs to';
COMMENT ON COLUMN public.events.event_type IS 'Type of event: class, exam, meeting, or event';
COMMENT ON COLUMN public.events.color IS 'Hex color code for calendar display';
COMMENT ON COLUMN public.events.attendees IS 'Approximate number of attendees';
