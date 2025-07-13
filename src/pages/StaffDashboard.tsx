import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut, Calendar, User, MessageSquare, Menu, X } from 'lucide-react';
import AttendanceHistory from '@/components/attendance/AttendanceHistory';
import CheckInOut from '@/components/attendance/CheckInOut';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FeedbackMessages from '@/components/staff/FeedbackMessages';

const StaffDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isLoading: profileLoading } = useProfile();
  const { signOut } = useAuth();

  const { data: todayAttendance } = useQuery({
    queryKey: ['my-today-attendance', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', profile.id)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today attendance:', error);
        return null;
      }
      return data;
    },
    enabled: !!profile?.id
  });

  const { data: weeklyStats } = useQuery({
    queryKey: ['my-weekly-stats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return { daysAttended: 0, totalHours: 0 };
      
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', profile.id)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0]);
      
      if (error) {
        console.error('Error fetching weekly stats:', error);
        return { daysAttended: 0, totalHours: 0 };
      }

      const daysAttended = data?.filter(record => record.status === 'present' || record.status === 'late').length || 0;
      const totalHours = data?.reduce((total, record) => {
        if (record.check_in_time && record.check_out_time) {
          const checkIn = new Date(record.check_in_time);
          const checkOut = new Date(record.check_out_time);
          const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0) || 0;

      return { daysAttended, totalHours };
    },
    enabled: !!profile?.id
  });

  const handleLogout = async () => {
    await signOut();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    closeMobileMenu();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  const userData = {
    name: `${profile.first_name} ${profile.last_name}`,
    staffId: profile.staff_id,
    department: profile.department,
    isCheckedIn: todayAttendance?.check_in_time && !todayAttendance?.check_out_time,
    lastCheckIn: todayAttendance?.check_in_time,
    lastCheckOut: todayAttendance?.check_out_time
  };

  const renderContent = () => {
    switch (currentView) {
      case 'checkin':
        return <CheckInOut userData={userData} />;
      case 'history':
        return <AttendanceHistory />;
      case 'messages':
        return <FeedbackMessages />;
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">Welcome back, {userData.name}!</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  {userData.department} • Staff ID: {userData.staffId}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {userData.isCheckedIn ? (
                      <>
                        <LogIn className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <span className="text-green-600 font-medium text-sm">Checked In</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="text-gray-500 font-medium text-sm">Checked Out</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{weeklyStats?.daysAttended || 0}/5</div>
                  <p className="text-xs text-gray-500">Days attended</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">{(weeklyStats?.totalHours || 0).toFixed(1)}</div>
                  <p className="text-xs text-gray-500">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-sm">
                  Manage your attendance and view records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
                <Button 
                  onClick={() => handleNavClick('checkin')}
                  className="bg-green-600 hover:bg-green-700 w-full sm:flex-1"
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check In/Out
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleNavClick('history')}
                  className="w-full sm:flex-1"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View History
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleNavClick('messages')}
                  className="w-full sm:flex-1"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </CardContent>
            </Card>

            {/* Feedback Messages Preview - Hidden on mobile to save space */}
            <div className="hidden sm:block">
              <FeedbackMessages />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900">Staff Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">ICP Attendance System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                size="sm"
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={closeMobileMenu}></div>
          <div className="relative flex flex-col w-64 h-full bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Menu</h2>
                <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <button 
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavClick('checkin')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'checkin' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Check In/Out
              </button>
              <button 
                onClick={() => handleNavClick('history')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'history' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                History
              </button>
              <button 
                onClick={() => handleNavClick('messages')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'messages' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Messages
              </button>
            </nav>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                size="sm"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="bg-white border-b hidden sm:block">
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
            <button 
              onClick={() => setCurrentView('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'messages' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;
