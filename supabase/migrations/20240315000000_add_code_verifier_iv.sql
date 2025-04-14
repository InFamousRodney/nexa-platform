-- Add code_verifier_iv column to oauth_states table
ALTER TABLE oauth_states
ADD COLUMN code_verifier_iv TEXT NOT NULL;

-- Update existing rows with empty IV (they will need to be recreated)
UPDATE oauth_states
SET code_verifier_iv = ''
WHERE code_verifier_iv IS NULL; 