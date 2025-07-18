
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminAttendanceView = () => {
  // Fetch today's attendance records with staff details
  const { data: todayAttendance = [], isLoading } = useQuery({
    queryKey: ['admin-today-attendance'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // First get attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', today)
        .order('check_in_time', { ascending: false });
      
      if (attendanceError) {
        console.error('Error fetching attendance records:', attendanceError);
        return [];
      }

      if (!attendanceData || attendanceData.length === 0) {
        return [];
      }

      // Get user IDs from attendance records
      const userIds = attendanceData.map(record => record.user_id);
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return attendanceData.map(record => ({ ...record, profiles: null }));
      }

      // Combine attendance records with profile data
      const combinedData = attendanceData.map(record => {
        const profile = profilesData?.find(p => p.id === record.user_id);
        return { ...record, profiles: profile || null };
      });

      return combinedData;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateHoursAndMinutes = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return { hours: 0, minutes: 0, display: 'In progress' };
    
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const totalMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { 
      hours, 
      minutes, 
      display: `${hours}h ${minutes}m` 
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attendance records...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Attendance Records
        </CardTitle>
        <CardDescription>
          Real-time attendance status for {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todayAttendance.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No attendance records for today</p>
            <p className="text-sm text-gray-500">Records will appear as staff check in</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAttendance.map((record) => {
              const timeWorked = calculateHoursAndMinutes(record.check_in_time, record.check_out_time);
              
              return (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <div className="font-medium">
                        {record.profiles?.first_name || 'Unknown'} {record.profiles?.last_name || 'User'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {record.profiles?.staff_id || 'N/A'} • {record.profiles?.department || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.check_in_time && record.check_out_time ? (
                          `${new Date(record.check_in_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - ${new Date(record.check_out_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}`
                        ) : record.check_in_time ? (
                          `Checked in at ${new Date(record.check_in_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}`
                        ) : (
                          'No check-in recorded'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {timeWorked.display}
                      </div>
                      <div className="text-xs text-gray-500">Total time</div>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAttendanceView;
