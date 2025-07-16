
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Calendar, TrendingUp, Settings, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import AdminAttendanceView from '@/components/admin/AdminAttendanceView';
import FeedbackMessage from '@/components/admin/FeedbackMessage';
import logo from '../asset/logo.png'
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

interface StaffStats {
  totalStaff: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  totalHoursToday: number;
  attendanceRate: number;
}

const AdminSidebar = ({ currentView, setCurrentView }: { currentView: string; setCurrentView: (view: string) => void }) => {
  const { setOpenMobile } = useSidebar();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'feedback', label: 'Send Feedback', icon: MessageSquare },
  ];

  const handleMenuClick = (viewId: string) => {
    setCurrentView(viewId);
    setOpenMobile(false); // Close sidebar on mobile when menu item is clicked
  };

  return (
    
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="ICP Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">ICP Attendance Management</p>
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

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Fetch all staff profiles
  const { data: staffProfiles } = useQuery({
    queryKey: ['staff-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');
      
      if (error) {
        console.error('Error fetching staff profiles:', error);
        return [];
      }
      return data;
    }
  });

  // Fetch today's attendance records
  const { data: todayAttendance } = useQuery({
    queryKey: ['today-attendance'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', today);
      
      if (error) {
        console.error('Error fetching attendance records:', error);
        return [];
      }
      return data;
    }
  });

  // Calculate stats from real data
  const stats: StaffStats = {
    totalStaff: staffProfiles?.length || 0,
    presentToday: todayAttendance?.filter(record => record.status === 'present').length || 0,
    lateToday: todayAttendance?.filter(record => record.status === 'late').length || 0,
    absentToday: (staffProfiles?.length || 0) - (todayAttendance?.length || 0),
    totalHoursToday: todayAttendance?.reduce((total, record) => {
      if (record.check_in_time && record.check_out_time) {
        const checkIn = new Date(record.check_in_time);
        const checkOut = new Date(record.check_out_time);
        const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0) || 0,
    attendanceRate: staffProfiles?.length > 0 ? 
      ((todayAttendance?.length || 0) / staffProfiles.length * 100) : 0
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar for mobile and desktop */}
        <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="md:hidden" />
                  {/* Desktop navigation tabs - hidden on mobile */}
                  <div className="hidden md:flex items-center gap-3">
                    <Button 
                      variant={currentView === 'dashboard' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCurrentView('dashboard')}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant={currentView === 'feedback' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCurrentView('feedback')}
                    >
                      Send Feedback
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" onClick={handleLogout} size="sm">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <Card className="mx-4 sm:mx-6 lg:mx-8 mt-4">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                {/* <User className="w-4 h-4 sm:w-5 sm:h-5" /> */}
                <span className="truncate">Admin Dashboard</span>
              </CardTitle>
              {/* <CardDescription className="text-sm">
                {useAuth().userData.department} • Staff ID: {useAuth().userData.admin}
              </CardDescription> */}
            </CardHeader>
            </Card>
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            {currentView === 'dashboard' && (
              <>
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
                      <p className="text-xs text-gray-500 mt-1">Registered staff</p>
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
                        <div className="text-2xl font-bold text-purple-600">{stats.attendanceRate.toFixed(1)}%</div>
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Today's rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-orange-600">{Math.round(stats.totalHoursToday)}</div>
                        <Calendar className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Logged today</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Real Attendance Records */}
                <AdminAttendanceView />
              </>
            )}

            {currentView === 'feedback' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <FeedbackMessage />
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Tips</CardTitle>
                    <CardDescription>
                      Best practices for effective staff communication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Be Specific</h4>
                      <p className="text-sm text-blue-700">
                        Provide clear, actionable feedback that helps staff understand exactly what needs improvement.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Stay Positive</h4>
                      <p className="text-sm text-green-700">
                        Balance constructive criticism with recognition of good performance.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Follow Up</h4>
                      <p className="text-sm text-purple-700">
                        Check in with staff after sending feedback to ensure understanding and progress.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
