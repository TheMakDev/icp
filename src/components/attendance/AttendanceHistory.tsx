
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const AttendanceHistory = () => {
  // Mock data - will be replaced with actual data from Supabase
  const attendanceRecords = [
    {
      date: '2024-01-15',
      checkIn: '09:15 AM',
      checkOut: '05:30 PM',
      totalHours: '8.25',
      status: 'present'
    },
    {
      date: '2024-01-14',
      checkIn: '09:00 AM',
      checkOut: '05:15 PM',
      totalHours: '8.25',
      status: 'present'
    },
    {
      date: '2024-01-13',
      checkIn: '09:30 AM',
      checkOut: '05:45 PM',
      totalHours: '8.25',
      status: 'late'
    },
    {
      date: '2024-01-12',
      checkIn: '-',
      checkOut: '-',
      totalHours: '0',
      status: 'absent'
    },
    {
      date: '2024-01-11',
      checkIn: '08:45 AM',
      checkOut: '05:00 PM',
      totalHours: '8.25',
      status: 'present'
    }
  ];

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

  // Calculate summary stats
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(record => record.status === 'present' || record.status === 'late').length;
  const totalHours = attendanceRecords.reduce((sum, record) => sum + parseFloat(record.totalHours), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((presentDays / totalDays) * 100)}%
            </div>
            <p className="text-xs text-gray-500">{presentDays} of {totalDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalHours}</div>
            <p className="text-xs text-gray-500">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Hours/Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {presentDays > 0 ? (totalHours / presentDays).toFixed(1) : '0'}
            </div>
            <p className="text-xs text-gray-500">When present</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Attendance
          </CardTitle>
          <CardDescription>
            Your attendance history for the past few days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(record.status)}
                  <div>
                    <div className="font-medium">{new Date(record.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                    <div className="text-sm text-gray-600">
                      {record.checkIn !== '-' ? `${record.checkIn} - ${record.checkOut}` : 'No attendance recorded'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{record.totalHours}h</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
