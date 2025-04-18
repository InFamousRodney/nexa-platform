-- Create oauth_states table
CREATE TABLE IF NOT EXISTS oauth_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state TEXT NOT NULL UNIQUE,
    code_verifier TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index on state for faster lookups
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- Add RLS policies
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own states
CREATE POLICY "Users can insert their own states"
    ON oauth_states
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to read their own states
CREATE POLICY "Users can read their own states"
    ON oauth_states
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy to allow users to delete their own states
CREATE POLICY "Users can delete their own states"
    ON oauth_states
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Function to clean up expired states
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_states()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM oauth_states
    WHERE expires_at < NOW();
END;
$$; 