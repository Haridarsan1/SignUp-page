import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Phone, MapPin, Calendar, Shield, Activity, Chrome, Star, Settings, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, UserProfile } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const { data } = await getUserProfile(user.id);
        setProfile(data);
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const getAuthProviderDisplay = () => {
    if (profile?.auth_provider === 'google') return 'Google';
    return 'Email/Password';
  };

  const getAuthProviderIcon = () => {
    if (profile?.auth_provider === 'google') return <Chrome className="w-5 h-5 text-red-500" />;
    return <Mail className="w-5 h-5 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xs text-gray-600">Welcome back, {profile?.username || user?.email?.split('@')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-semibold shadow-sm hover:shadow"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Active</h3>
            <p className="text-sm text-gray-600 mt-1">Account Status</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{getAuthProviderDisplay()}</h3>
            <p className="text-sm text-blue-100 mt-1">Authentication Method</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Member Since</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{profile?.full_name || 'User'}</h2>
                      <p className="text-blue-100 font-medium">@{profile?.username || user?.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
                      {getAuthProviderIcon()}
                      Signed in via {getAuthProviderDisplay()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </h3>

                <div className="grid gap-6">
                  {profile?.username && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-semibold">Username</p>
                        <p className="text-gray-900 font-bold">@{profile.username}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-semibold">Email</p>
                      <p className="text-gray-900 font-bold">{profile?.email || user?.email}</p>
                    </div>
                  </div>

                  {profile?.phone_number && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-shadow">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <Phone className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-semibold">Phone Number</p>
                        <p className="text-gray-900 font-bold">{profile.phone_number}</p>
                      </div>
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <MapPin className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-semibold">Location</p>
                        <p className="text-gray-900 font-bold">{profile.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-semibold">Member Since</p>
                      <p className="text-gray-900 font-bold">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Account Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-900">Email Verified</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">2FA</span>
                  <span className="text-xs text-blue-700 font-semibold">Not Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Last Login</span>
                  <span className="text-xs text-gray-700 font-semibold">Just now</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium text-sm">
                  Edit Profile
                </button>
                <button className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium text-sm">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium text-sm">
                  Privacy Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Profile Completion</span>
                    <span className="font-bold text-blue-600">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">Total Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
