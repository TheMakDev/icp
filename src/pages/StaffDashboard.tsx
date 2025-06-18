
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut, Calendar, User } from 'lucide-react';
import AttendanceHistory from '@/components/attendance/AttendanceHistory';
import CheckInOut from '@/components/attendance/CheckInOut';

const StaffDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Mock user data - will be replaced with actual user data from Supabase
  const userData = {
    name: 'John Doe',
    staffId: 'ICP/2024/001',
    department: 'Computer Science',
    isCheckedIn: false,
    lastCheckIn: null,
    lastCheckOut: '2024-01-15 17:30:00'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'checkin':
        return <CheckInOut userData={userData} />;
      case 'history':
        return <AttendanceHistory />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Welcome back, {userData.name}!
                </CardTitle>
                <CardDescription>
                  {userData.department} • Staff ID: {userData.staffId}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {userData.isCheckedIn ? (
                      <>
                        <LogIn className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Checked In</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 font-medium">Checked Out</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">4/5</div>
                  <p className="text-xs text-gray-500">Days attended</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">32.5</div>
                  <p className="text-xs text-gray-500">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your attendance and view records
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setCurrentView('checkin')}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check In/Out
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('history')}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
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
                <h1 className="text-lg font-semibold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-600">ICP Attendance System</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('checkin')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'checkin' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Check In/Out
            </button>
            <button 
              onClick={() => setCurrentView('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'history' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;
