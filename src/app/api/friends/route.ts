import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const sessionKey = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionKey) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const session = storage.getSession(sessionKey);
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const friends = storage.getFriends(session.userId);
    const friendRequests = storage.getFriendRequests(session.userId);

    // Get user details for friend requests
    const requestsWithUserInfo = friendRequests.map(request => {
      const fromUser = storage.getUserById(request.fromUserId);
      return {
        ...request,
        fromUser: fromUser ? {
          username: fromUser.username,
          friendCode: fromUser.friendCode
        } : null
      };
    });

    return NextResponse.json({
      friends: friends.map(friend => ({
        id: friend.id,
        username: friend.username,
        friendCode: friend.friendCode,
        profileImage: friend.profileImage
      })),
      requests: requestsWithUserInfo
    });
  } catch (error) {
    console.error('Friends GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionKey = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionKey) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const session = storage.getSession(sessionKey);
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const { friendCode } = await request.json();

    if (!friendCode || typeof friendCode !== 'string') {
      return NextResponse.json({ error: 'Friend code is required' }, { status: 400 });
    }

    const friendRequest = storage.createFriendRequest(session.userId, friendCode.trim().toUpperCase());

    if (!friendRequest) {
      return NextResponse.json({ 
        error: 'Invalid friend code or friend request already exists' 
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Friend request sent successfully',
      request: {
        id: friendRequest.id,
        toUserId: friendRequest.toUserId,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Friends POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionKey = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionKey) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const session = storage.getSession(sessionKey);
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const { requestId, action } = await request.json();

    if (!requestId || !action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ 
        error: 'Request ID and valid action (accept/reject) are required' 
      }, { status: 400 });
    }

    const success = storage.updateFriendRequest(requestId, action === 'accept' ? 'accepted' : 'rejected');

    if (!success) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Friend request ${action}ed successfully`
    });
  } catch (error) {
    console.error('Friends PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
