-- Migration: Add profile completion fields
-- Description: Adds phone, address, and is_profile_completed columns to profiles table

DO $$ 
BEGIN 
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;

    -- Add address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
        ALTER TABLE public.profiles ADD COLUMN address TEXT;
    END IF;

    -- Add is_profile_completed column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_profile_completed') THEN
        ALTER TABLE public.profiles ADD COLUMN is_profile_completed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Force schema cache reload (sometimes needed for PostgREST)
NOTIFY pgrst, 'reload config';
