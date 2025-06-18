
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Calendar, CheckCircle } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ICP Attendance</h1>
                <p className="text-sm text-gray-600">Ibadan City Polytechnic</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowLogin(true)}>
                Login
              </Button>
              <Button onClick={() => setShowSignup(true)}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Attendance Tracking System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline attendance management for Ibadan City Polytechnic with secure, 
            real-time tracking for staff and comprehensive monitoring tools for administrators.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Quick Check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fast and secure attendance tracking with one-click check-in and check-out
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive staff profiles and role-based access control
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View detailed attendance records and generate comprehensive reports
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor attendance, approve entries, and access analytics
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Join Ibadan City Polytechnic's digital attendance system today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowSignup(true)} className="bg-blue-600 hover:bg-blue-700">
              Sign Up as Staff
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowLogin(true)}>
              Admin Login
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Ibadan City Polytechnic. All rights reserved.</p>
            <p className="mt-2 text-sm">Secure attendance tracking system</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
