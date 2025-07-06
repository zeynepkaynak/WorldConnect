"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface User {
  id: string;
  worldId: string;
  username: string;
  friendCode: string;
  profileImage?: string;
}

interface Friend {
  id: string;
  username: string;
  friendCode: string;
  profileImage?: string;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  status: string;
  createdAt: string;
  fromUser?: {
    username: string;
    friendCode: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [friendCode, setFriendCode] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (sessionKey: string) => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${sessionKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);
      setUsername(data.user.username);

      // Generate QR code
      const qrData = `worldid-friend:${data.user.friendCode}`;
      const qrUrl = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrUrl);

      // Fetch friends
      fetchFriends(sessionKey);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey) {
      router.push('/');
      return;
    }
    fetchProfile(sessionKey);
  }, [router, fetchProfile]);

  const fetchFriends = async (sessionKey: string) => {
    try {
      const response = await fetch('/api/friends', {
        headers: {
          'Authorization': `Bearer ${sessionKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
        setFriendRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const updateProfile = async () => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey) return;

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const addFriend = async () => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey || !friendCode.trim()) return;

    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify({ friendCode: friendCode.trim().toUpperCase() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Friend request sent');
        setFriendCode('');
        fetchFriends(sessionKey); // Refresh friends list
      } else {
        toast.error(data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey) return;

    try {
      const response = await fetch('/api/friends', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify({ requestId, action })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Friend request ${action}ed`);
        fetchFriends(sessionKey); // Refresh friends and requests
      } else {
        toast.error(data.error || `Failed to ${action} friend request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      toast.error(`Failed to ${action} friend request`);
    }
  };

  const copyFriendCode = () => {
    if (user?.friendCode) {
      navigator.clipboard.writeText(user.friendCode);
      toast.success('Friend code copied to clipboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('sessionKey');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <Icons.spinner className="h-16 w-16 animate-spin text-white mx-auto mb-6" />
            <h2 className="text-white text-2xl font-bold mb-2">Loading your profile...</h2>
            <p className="text-white/70">Please wait while we fetch your data</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-white/20 shadow-2xl">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-600 text-white text-xl font-bold">
                {user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {user.username}
              </h1>
              <p className="text-purple-200 text-lg">World ID Verified</p>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10 hover:border-white backdrop-blur-sm"
          >
            <Icons.externalLink className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{friends.length}</div>
            <div className="text-purple-200">Friends</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{friendRequests.length}</div>
            <div className="text-purple-200">Pending Requests</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-xl font-mono font-bold text-blue-400">{user.friendCode}</div>
            <div className="text-purple-200">Your Friend Code</div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-xl transition-all duration-300"
              >
                <Icons.user className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="friends" 
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-xl transition-all duration-300"
              >
                <Icons.user className="h-4 w-4 mr-2" />
                Friends
              </TabsTrigger>
              <TabsTrigger 
                value="qr-code" 
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-xl transition-all duration-300"
              >
                <Icons.copy className="h-4 w-4 mr-2" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Icons.user className="h-6 w-6 mr-3 text-purple-400" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white text-sm font-medium">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Friend Code</Label>
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl font-mono font-bold text-blue-400 bg-white/10 backdrop-blur-sm p-4 rounded-xl flex-1 border border-white/20">
                            {user.friendCode}
                          </div>
                          <Button 
                            onClick={copyFriendCode} 
                            variant="outline" 
                            size="sm" 
                            className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm rounded-xl"
                          >
                            <Icons.copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">World ID</Label>
                      <div className="text-sm font-mono text-slate-300 bg-white/10 backdrop-blur-sm p-4 rounded-xl break-all border border-white/20">
                        {user.worldId}
                      </div>
                    </div>

                    <Button 
                      onClick={updateProfile} 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl h-12 text-lg font-medium shadow-lg"
                    >
                      <Icons.checkCircle className="h-5 w-5 mr-2" />
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="friends" className="mt-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Add Friend Section */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Icons.user className="h-6 w-6 mr-3 text-green-400" />
                      Add New Friend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Input
                        value={friendCode}
                        onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                        placeholder="Enter friend code (e.g. ABC123)"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm rounded-xl uppercase flex-1"
                        maxLength={6}
                      />
                      <Button 
                        onClick={addFriend} 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-8"
                      >
                        <Icons.user className="h-4 w-4 mr-2" />
                        Add Friend
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Friend Requests */}
                {friendRequests.length > 0 && (
                  <Card className="bg-white/10 backdrop-blur-md border border-orange-300/20 rounded-2xl shadow-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-2xl flex items-center">
                        <Icons.alertCircle className="h-6 w-6 mr-3 text-orange-400" />
                        Friend Requests ({friendRequests.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {friendRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-orange-300/20"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 border-2 border-orange-400/30">
                              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
                                {request.fromUser?.username?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white font-medium text-lg">
                                {request.fromUser ? request.fromUser.username : 'Unknown User'}
                              </div>
                              <div className="text-orange-200 text-sm">
                                Friend Code: {request.fromUser ? request.fromUser.friendCode : 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleFriendRequest(request.id, 'accept')}
                              size="sm" 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg"
                            >
                              <Icons.checkCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleFriendRequest(request.id, 'reject')}
                              size="sm" 
                              variant="outline"
                              className="border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 rounded-lg"
                            >
                              <Icons.alertCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Friends List */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Icons.user className="h-6 w-6 mr-3 text-blue-400" />
                      My Friends ({friends.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {friends.length === 0 ? (
                      <div className="text-center py-12">
                        <Icons.user className="h-16 w-16 text-white/30 mx-auto mb-4" />
                        <p className="text-white/70 text-xl mb-2">No friends yet</p>
                        <p className="text-white/50">Share your QR code or friend code to connect with others!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friends.map((friend, index) => (
                          <motion.div
                            key={friend.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12 border-2 border-blue-400/30">
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                  {friend.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-white font-medium text-lg">{friend.username}</div>
                                <div className="text-blue-200 text-sm font-mono">{friend.friendCode}</div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
                              Friend
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="qr-code" className="mt-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Icons.copy className="h-6 w-6 mr-3 text-purple-400" />
                      Your QR Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-8">
                    <div className="max-w-md mx-auto">
                      <p className="text-white/80 text-lg mb-6">
                        Share this QR code with others to let them add you as a friend instantly
                      </p>
                      
                      {qrCodeUrl && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="flex justify-center mb-8"
                        >
                          <div className="bg-white p-6 rounded-3xl shadow-2xl">
                            <Image 
                              src={qrCodeUrl} 
                              alt="Friend QR Code" 
                              className="rounded-2xl"
                              width={256}
                              height={256}
                            />
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                        <div className="text-3xl font-mono font-bold text-blue-400 mb-2">
                          {user.friendCode}
                        </div>
                        <p className="text-white/60">
                          Others can scan this code or enter your friend code manually
                        </p>
                        <Button 
                          onClick={copyFriendCode}
                          className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                        >
                          <Icons.copy className="h-4 w-4 mr-2" />
                          Copy Friend Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
