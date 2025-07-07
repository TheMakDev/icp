
-- Add foreign key constraints to establish proper relationships
ALTER TABLE public.attendance_records
ADD CONSTRAINT attendance_records_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.feedback_messages
ADD CONSTRAINT feedback_messages_admin_id_fkey
FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.feedback_messages
ADD CONSTRAINT feedback_messages_staff_id_fkey
FOREIGN KEY (staff_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
