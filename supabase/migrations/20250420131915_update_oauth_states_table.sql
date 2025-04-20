-- Create the extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop old columns that are no longer needed
ALTER TABLE public.oauth_states DROP COLUMN IF EXISTS code_verifier;
ALTER TABLE public.oauth_states DROP COLUMN IF EXISTS code_verifier_iv;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.oauth_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state TEXT NOT NULL,
    encrypted_data TEXT NOT NULL, -- Making this NOT NULL since we always store encrypted data
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT oauth_states_state_key UNIQUE (state),
    CONSTRAINT oauth_states_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Ensure RLS is enabled
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Create policy to allow the service role full access
CREATE POLICY oauth_states_service_role_policy
    ON public.oauth_states
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS oauth_states_user_id_idx ON public.oauth_states(user_id);
CREATE INDEX IF NOT EXISTS oauth_states_expires_at_idx ON public.oauth_states(expires_at);
CREATE INDEX IF NOT EXISTS oauth_states_state_idx ON public.oauth_states(state);

-- Grant necessary permissions
GRANT ALL ON public.oauth_states TO service_role;
GRANT ALL ON public.oauth_states TO postgres;
