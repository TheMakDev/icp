
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const FeedbackMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch feedback messages for the current user
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['my-feedback-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('feedback_messages')
        .select(`
          *,
          profiles!inner (
            first_name,
            last_name
          )
        `)
        .eq('staff_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedback messages:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Mark message as read
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('feedback_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('staff_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feedback-messages'] });
    }
  });

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Messages from Admin
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Important messages and feedback from administration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No messages yet</p>
            <p className="text-sm text-gray-500">Messages from admin will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-lg border ${
                  message.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{message.subject}</h4>
                    {!message.is_read && (
                      <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {message.is_read ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3">{message.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    From: {message.profiles?.first_name} {message.profiles?.last_name} • {' '}
                    {new Date(message.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  
                  {!message.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(message.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackMessages;
