-- Drop the code_verifier column as it's now stored in encrypted state
ALTER TABLE public.oauth_states DROP COLUMN IF EXISTS code_verifier;

-- Add encrypted_data column if it doesn't exist
ALTER TABLE public.oauth_states ADD COLUMN IF NOT EXISTS encrypted_data TEXT;

-- Make code_verifier_iv nullable since we're not using it anymore
ALTER TABLE public.oauth_states ALTER COLUMN code_verifier_iv DROP NOT NULL;