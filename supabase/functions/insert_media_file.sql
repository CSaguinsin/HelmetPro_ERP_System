-- Function to insert media files with admin privileges
CREATE OR REPLACE FUNCTION insert_media_file(
  device_id TEXT,
  file_type TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  optimization_status TEXT,
  thumbnail_urls JSONB,
  display_order INTEGER
) 
RETURNS JSONB
SECURITY DEFINER -- This makes the function run with the privileges of the user who created it (should be admin)
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  inserted_record JSONB;
BEGIN
  -- Insert the record and return the result
  INSERT INTO media_files (
    device_id,
    file_type,
    file_url,
    created_at,
    optimization_status,
    thumbnail_urls,
    display_order
  )
  VALUES (
    device_id,
    file_type,
    file_url,
    created_at,
    optimization_status,
    thumbnail_urls,
    display_order
  )
  RETURNING to_jsonb(media_files.*) INTO inserted_record;
  
  RETURN inserted_record;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_media_file TO authenticated;
GRANT EXECUTE ON FUNCTION insert_media_file TO anon; 