
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

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
          <CardHeader>
            <CardTitle>Welcome back, {profile?.first_name}!</CardTitle>
            <CardDescription>Redirecting you to your dashboard...</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSignOut} variant="outline">
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">ICP Attendance</h1>
                <p className="text-sm text-gray-600">Ibadan City Polytechnic</p>
              </div>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Attendance Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Streamline attendance tracking for Ibadan City Polytechnic staff with our modern, efficient system.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Easy Check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quick and simple attendance marking with real-time tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive staff profiles and role-based access control
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Detailed reports and insights on attendance patterns
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enterprise-grade security with data protection
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Admin Login Information */}
        <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Shield className="w-5 h-5" />
              Admin Access Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <p className="mb-4">
              To create an admin account, sign up with these details:
            </p>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p><strong>Email:</strong> admin@icp.edu.ng</p>
              <p><strong>Role:</strong> Select "Administrator" during signup</p>
              <p><strong>Staff ID:</strong> ICP/ADMIN/2024</p>
              <p><strong>Department:</strong> Administration</p>
            </div>
            <p className="mt-4 text-sm">
              After signing up, you'll have full administrative access to manage staff and view all attendance records.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
