-- Database helper functions and triggers

-- Trigger function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers helper script (executed on setup)
-- Trigger associations can be added to individual tables as needed.
