
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Calendar, TrendingUp, Settings, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  // Mock data - will be replaced with actual data from Supabase
  const stats = {
    totalStaff: 156,
    presentToday: 142,
    lateToday: 8,
    absentToday: 6,
    totalHoursToday: 1136,
    attendanceRate: 91.0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">ICP Attendance Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-600">{stats.totalStaff}</div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Currently checked in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</div>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">This month average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-orange-600">{stats.totalHoursToday}</div>
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Logged today</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Staff Management
              </CardTitle>
              <CardDescription>
                View and manage all staff members, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Staff
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Attendance Records
              </CardTitle>
              <CardDescription>
                Monitor daily attendance, approve entries, and track patterns
              </CardDescription>
            </CardContent>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Records
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Generate Reports
              </CardTitle>
              <CardDescription>
                Create detailed attendance reports and analytics
              </CardDescription>
            </CardContent>
            <CardContent>
              <Button className="w-full" variant="outline">
                Create Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
            <CardDescription>
              Real-time attendance status for {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.lateToday}</div>
                <div className="text-sm text-yellow-700">Late Arrivals</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.absentToday}</div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg">
                View Detailed Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
