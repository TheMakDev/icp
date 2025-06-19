
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

interface CheckInOutProps {
  userData: {
    name: string;
    staffId: string;
    department: string;
    isCheckedIn: boolean;
    lastCheckIn: string | null;
    lastCheckOut: string | null;
  };
}

const CheckInOut = ({ userData }: CheckInOutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const currentTime = new Date().toLocaleString();

  const handleCheckIn = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      // Check if there's already a record for today
      const { data: existingRecord, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingRecord) {
        // Update existing record with check-in time
        const { error: updateError } = await supabase
          .from('attendance_records')
          .update({ 
            check_in_time: now,
            status: 'present'
          })
          .eq('id', existingRecord.id);

        if (updateError) throw updateError;
      } else {
        // Create new attendance record
        const { error: insertError } = await supabase
          .from('attendance_records')
          .insert({
            user_id: user.id,
            date: today,
            check_in_time: now,
            status: 'present'
          });

        if (insertError) throw insertError;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['my-today-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['my-weekly-stats'] });
      queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['staff-profiles'] });

      toast({
        title: "Checked In Successfully",
        description: `Welcome to work, ${userData.name}!`,
      });
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Check-in Failed",
        description: "There was an error checking you in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      // Find today's attendance record
      const { data: existingRecord, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (fetchError) {
        throw new Error('No check-in record found for today. Please check in first.');
      }

      // Update with check-out time
      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({ 
          check_out_time: now
        })
        .eq('id', existingRecord.id);

      if (updateError) throw updateError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['my-today-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['my-weekly-stats'] });
      queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['staff-profiles'] });

      toast({
        title: "Checked Out Successfully",
        description: "Have a great day!",
      });
    } catch (error) {
      console.error('Check-out error:', error);
      toast({
        title: "Check-out Failed",
        description: error instanceof Error ? error.message : "There was an error checking you out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Time
          </CardTitle>
          <CardDescription className="text-lg font-mono">
            {currentTime}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Check In/Out Action */}
      <Card>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            userData.isCheckedIn ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {userData.isCheckedIn ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <Clock className="w-10 h-10 text-gray-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {userData.isCheckedIn ? 'You are checked in' : 'Ready to check in?'}
          </CardTitle>
          <CardDescription>
            {userData.isCheckedIn 
              ? 'Click below when you\'re ready to check out' 
              : 'Click below to record your arrival'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Ibadan City Polytechnic Campus</span>
          </div>
          
          {userData.isCheckedIn ? (
            <Button 
              onClick={handleCheckOut}
              disabled={isLoading}
              size="lg"
              variant="destructive"
              className="w-full max-w-xs"
            >
              {isLoading ? 'Processing...' : 'Check Out'}
            </Button>
          ) : (
            <Button 
              onClick={handleCheckIn}
              disabled={isLoading}
              size="lg"
              className="w-full max-w-xs bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Processing...' : 'Check In'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userData.lastCheckOut && (
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Last Check Out</span>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(userData.lastCheckOut).toLocaleString()}
                </span>
              </div>
            )}
            {userData.lastCheckIn && (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Last Check In</span>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(userData.lastCheckIn).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInOut;
