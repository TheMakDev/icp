
-- Update the handle_new_user function to generate unique staff IDs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_staff_id TEXT;
  counter INTEGER := 1;
  base_year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
BEGIN
  -- Generate a unique staff ID
  LOOP
    new_staff_id := 'ICP/' || base_year || '/' || LPAD(counter::TEXT, 3, '0');
    
    -- Check if this staff_id already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE staff_id = new_staff_id) THEN
      EXIT; -- Found a unique staff_id, exit the loop
    END IF;
    
    counter := counter + 1;
    
    -- Safety check to prevent infinite loop
    IF counter > 9999 THEN
      new_staff_id := 'ICP/' || base_year || '/' || gen_random_uuid()::TEXT;
      EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (id, staff_id, first_name, last_name, department, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'staff_id', new_staff_id),
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff')
  );
  RETURN NEW;
END;
$$;
