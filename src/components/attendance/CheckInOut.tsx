
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface CheckInOutProps {
  userData: {
    name: string;
    staffId: string;
    department: string;
    isCheckedIn: boolean;
    lastCheckIn: string | null;
    lastCheckOut: string | null;
  };
}

const CheckInOut = ({ userData }: CheckInOutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(userData.isCheckedIn);
  
  const currentTime = new Date().toLocaleString();

  const handleCheckIn = async () => {
    setIsLoading(true);
    // Simulate API call - will be replaced with Supabase function
    setTimeout(() => {
      setCheckedIn(true);
      setIsLoading(false);
      toast({
        title: "Checked In Successfully",
        description: `Welcome to work, ${userData.name}!`,
      });
    }, 1000);
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    // Simulate API call - will be replaced with Supabase function
    setTimeout(() => {
      setCheckedIn(false);
      setIsLoading(false);
      toast({
        title: "Checked Out Successfully",
        description: "Have a great day!",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Time
          </CardTitle>
          <CardDescription className="text-lg font-mono">
            {currentTime}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Check In/Out Action */}
      <Card>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            checkedIn ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {checkedIn ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <Clock className="w-10 h-10 text-gray-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {checkedIn ? 'You are checked in' : 'Ready to check in?'}
          </CardTitle>
          <CardDescription>
            {checkedIn 
              ? 'Click below when you\'re ready to check out' 
              : 'Click below to record your arrival'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Ibadan City Polytechnic Campus</span>
          </div>
          
          {checkedIn ? (
            <Button 
              onClick={handleCheckOut}
              disabled={isLoading}
              size="lg"
              variant="destructive"
              className="w-full max-w-xs"
            >
              {isLoading ? 'Processing...' : 'Check Out'}
            </Button>
          ) : (
            <Button 
              onClick={handleCheckIn}
              disabled={isLoading}
              size="lg"
              className="w-full max-w-xs bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Processing...' : 'Check In'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userData.lastCheckOut && (
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Last Check Out</span>
                </div>
                <span className="text-sm text-gray-600">{userData.lastCheckOut}</span>
              </div>
            )}
            {userData.lastCheckIn && (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Last Check In</span>
                </div>
                <span className="text-sm text-gray-600">{userData.lastCheckIn}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInOut;
