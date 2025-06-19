
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const FeedbackMessage = () => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all staff members
  const { data: staffMembers = [] } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');
      
      if (error) {
        console.error('Error fetching staff members:', error);
        return [];
      }
      return data;
    }
  });

  // Send feedback message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !selectedStaff || !subject.trim() || !message.trim()) {
        throw new Error('All fields are required');
      }

      const { error } = await supabase
        .from('feedback_messages')
        .insert({
          admin_id: user.id,
          staff_id: selectedStaff,
          subject: subject.trim(),
          message: message.trim()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "Your feedback has been sent to the staff member.",
      });
      
      // Reset form
      setSelectedStaff('');
      setSubject('');
      setMessage('');
      
      // Refresh any relevant queries
      queryClient.invalidateQueries({ queryKey: ['feedback-messages'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    sendMessageMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Send Feedback to Staff
        </CardTitle>
        <CardDescription>
          Communicate directly with your staff members
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Staff Member
          </label>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.first_name} {staff.last_name} ({staff.staff_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Subject
          </label>
          <Input
            placeholder="Enter message subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Message
          </label>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          onClick={handleSendMessage}
          disabled={!selectedStaff || !subject.trim() || !message.trim() || sendMessageMutation.isPending}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackMessage;
