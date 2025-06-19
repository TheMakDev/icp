
-- Create feedback_messages table for admin to staff communication
CREATE TABLE public.feedback_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  staff_id UUID REFERENCES auth.users(id) NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback_messages ENABLE ROW LEVEL SECURITY;

-- Policy for admins to send and view all messages
CREATE POLICY "Admins can manage all feedback messages" 
  ON public.feedback_messages 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy for staff to view their own messages
CREATE POLICY "Staff can view their own feedback messages" 
  ON public.feedback_messages 
  FOR SELECT 
  USING (staff_id = auth.uid());

-- Policy for staff to mark their messages as read
CREATE POLICY "Staff can update read status of their messages" 
  ON public.feedback_messages 
  FOR UPDATE 
  USING (staff_id = auth.uid() AND auth.uid() = staff_id)
  WITH CHECK (staff_id = auth.uid());
