
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, BarChart3, Shield, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import logo from '../asset/logo.png'

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    if (user && profile) {
      // Redirect authenticated users to their appropriate dashboard
      if (profile.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/staff-dashboard');
      }
    }
  }, [user, profile, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Welcome back, {profile?.first_name}!</CardTitle>
            <CardDescription className="text-sm">Redirecting you to your dashboard...</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src={logo} alt="ICP Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900">ICP Attendance</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Ibadan City Polytechnic</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="px-3 py-1.5 sm:px-4 sm:py-2"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Attendance Management System
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Streamline attendance tracking for Ibadan City Polytechnic staff with our modern, efficient system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-6 py-3 sm:px-8"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-6 py-3 sm:px-8"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          <Card className="text-center p-4 sm:p-6">
            <CardHeader className="pb-2 sm:pb-4">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
              <CardTitle className="text-base sm:text-lg">Easy Check-in</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base">
                Quick and simple attendance marking with real-time tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardHeader className="pb-2 sm:pb-4">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-600 mx-auto mb-2 sm:mb-4" />
              <CardTitle className="text-base sm:text-lg">Staff Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base">
                Comprehensive staff profiles and role-based access control
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardHeader className="pb-2 sm:pb-4">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600 mx-auto mb-2 sm:mb-4" />
              <CardTitle className="text-base sm:text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base">
                Detailed reports and insights on attendance patterns
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardHeader className="pb-2 sm:pb-4">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-600 mx-auto mb-2 sm:mb-4" />
              <CardTitle className="text-base sm:text-lg">Secure</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base">
                Enterprise-grade security with data protection
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Admin Login Information */}
        <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              Admin Access Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base">
              To create an admin account, sign up with these details:
            </p>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200 space-y-1 sm:space-y-2">
              <p className="text-sm sm:text-base"><strong>Email:</strong> admin@icp.edu.ng</p>
              <p className="text-sm sm:text-base"><strong>Role:</strong> Select "Administrator" during signup</p>
              <p className="text-sm sm:text-base"><strong>Staff ID:</strong> ICP/ADMIN/2024</p>
              <p className="text-sm sm:text-base"><strong>Department:</strong> Administration</p>
            </div>
            <p className="text-xs sm:text-sm">
              After signing up, you'll have full administrative access to manage staff and view all attendance records.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base">
              © 2024 Ibadan City Polytechnic Attendance Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
