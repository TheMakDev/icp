import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut, Calendar, User, MessageSquare, Home, History } from 'lucide-react';
import AttendanceHistory from '@/components/attendance/AttendanceHistory';
import CheckInOut from '@/components/attendance/CheckInOut';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FeedbackMessages from '@/components/staff/FeedbackMessages';
import logo from '../asset/logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const StaffSidebar = ({ currentView, setCurrentView }: { currentView: string; setCurrentView: (view: string) => void }) => {
  const { setOpenMobile } = useSidebar();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'checkin', label: 'Check In/Out', icon: Clock },
    { id: 'history', label: 'History', icon: History },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const handleMenuClick = (viewId: string) => {
    setCurrentView(viewId);
    setOpenMobile(false); // Close sidebar on mobile when menu item is clicked
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="ICP Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <div>
            <h1 className="text-sm sm:text-lg font-semibold text-gray-900">Student Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600">ICP Attendance System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={currentView === item.id}
                onClick={() => handleMenuClick(item.id)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

const StaffDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
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
                  onClick={() => setCurrentView('checkin')}
                  className="bg-green-600 hover:bg-green-700 w-full sm:flex-1"
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check In/Out
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('history')}
                  className="w-full sm:flex-1"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View History
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('messages')}
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
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar for mobile and desktop */}
        <StaffSidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="md:hidden" />
                  {/* Desktop navigation tabs - hidden on mobile */}
                  <div className="hidden md:flex space-x-8">
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
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboard;
