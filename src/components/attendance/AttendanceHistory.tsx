import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AttendanceHistory = () => {
  const { user } = useAuth();

  // Fetch user's attendance records
  const { data: attendanceRecords = [], isLoading } = useQuery({
    queryKey: ['my-attendance-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching attendance history:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Absent</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      case 'late':
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />;
      case 'absent':
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
    }
  };

  const calculateHoursAndMinutes = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return { hours: 0, minutes: 0, totalHours: 0 };
    
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const totalMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalHours = totalMinutes / 60;
    
    return { hours, minutes, totalHours };
  };

  // Calculate summary stats
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(record => record.status === 'present' || record.status === 'late').length;
  const totalHours = attendanceRecords.reduce((sum, record) => {
    const { totalHours } = calculateHoursAndMinutes(record.check_in_time, record.check_out_time);
    return sum + totalHours;
  }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Loading attendance history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500">{presentDays} of {totalDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
            </div>
            <p className="text-xs text-gray-500">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Average Hours/Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {presentDays > 0 ? `${Math.floor(totalHours / presentDays)}h ${Math.round(((totalHours / presentDays) % 1) * 60)}m` : '0h 0m'}
            </div>
            <p className="text-xs text-gray-500">When present</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            Recent Attendance
          </CardTitle>
          <CardDescription className="text-sm">
            Your attendance history for the past few days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found</p>
              <p className="text-sm text-gray-500">Start by checking in to create your first record</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {attendanceRecords.map((record, index) => {
                const timeWorked = calculateHoursAndMinutes(record.check_in_time, record.check_out_time);
                
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      {getStatusIcon(record.status)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
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
                            'No attendance recorded'
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 ml-6 sm:ml-0">
                      <div className="text-right">
                        <div className="font-medium text-sm sm:text-base">
                          {timeWorked.hours > 0 || timeWorked.minutes > 0 
                            ? `${timeWorked.hours}h ${timeWorked.minutes}m`
                            : '0h 0m'
                          }
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
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
    </div>
  );
};

export default AttendanceHistory;
