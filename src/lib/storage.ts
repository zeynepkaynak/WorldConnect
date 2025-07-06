import { User, Friend, FriendRequest } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define global storage on the global object to persist across module reloads
declare global {
  var __worldid_storage: {
    users: Map<string, User>;
    sessions: Map<string, { userId: string; expiresAt: Date }>;
    friends: Map<string, Friend>;
    friendRequests: Map<string, FriendRequest>;
    friendCodeToUserId: Map<string, string>;
  } | undefined;
}

// Initialize global storage if it doesn't exist
if (!global.__worldid_storage) {
  global.__worldid_storage = {
    users: new Map<string, User>(),
    sessions: new Map<string, { userId: string; expiresAt: Date }>(),
    friends: new Map<string, Friend>(),
    friendRequests: new Map<string, FriendRequest>(),
    friendCodeToUserId: new Map<string, string>(),
  };
}

// In-memory storage (in production, use a real database)
class Storage {
  private users: Map<string, User>;
  private sessions: Map<string, { userId: string; expiresAt: Date }>;
  private friends: Map<string, Friend>;
  private friendRequests: Map<string, FriendRequest>;
  private friendCodeToUserId: Map<string, string>;

  constructor() {
    this.users = global.__worldid_storage!.users;
    this.sessions = global.__worldid_storage!.sessions;
    this.friends = global.__worldid_storage!.friends;
    this.friendRequests = global.__worldid_storage!.friendRequests;
    this.friendCodeToUserId = global.__worldid_storage!.friendCodeToUserId;
    
    console.log('🔧 Storage initialized with global state:', {
      usersCount: this.users.size,
      sessionsCount: this.sessions.size,
      friendsCount: this.friends.size,
    });
  }

  // User operations
  createUser(worldId: string, sessionKey: string = ''): User {
    const userId = uuidv4();
    const friendCode = this.generateFriendCode();
    
    const user: User = {
      id: userId,
      worldId,
      sessionKey,
      username: `User${Math.floor(Math.random() * 10000)}`,
      friendCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(userId, user);
    this.friendCodeToUserId.set(friendCode, userId);
    
    console.log('🔍 Storage - User created:', {
      userId,
      friendCode,
      username: user.username
    });
    
    return user;
  }

  getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUserByWorldId(worldId: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.worldId === worldId) {
        return user;
      }
    }
    return undefined;
  }

  getUserByFriendCode(friendCode: string): User | undefined {
    const userId = this.friendCodeToUserId.get(friendCode);
    return userId ? this.users.get(userId) : undefined;
  }

  updateUser(userId: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Session operations
  createSession(userId: string): string {
    const sessionKey = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    console.log('🔍 Storage - Creating session:', {
      sessionKey: sessionKey.substring(0, 10) + '...',
      userId,
      expiresAt
    });
    
    this.sessions.set(sessionKey, { userId, expiresAt });
    
    console.log('🔍 Storage - Total sessions:', this.sessions.size);
    
    return sessionKey;
  }

  getSession(sessionKey: string): { userId: string; expiresAt: Date } | undefined {
    console.log('🔍 Storage - Looking for session:', sessionKey ? sessionKey.substring(0, 10) + '...' : 'null');
    console.log('🔍 Storage - Available sessions:', Array.from(this.sessions.keys()).map(key => key.substring(0, 10) + '...'));
    
    const session = this.sessions.get(sessionKey);
    if (!session) {
      console.log('❌ Storage - Session not found');
      return undefined;
    }
    
    if (session.expiresAt < new Date()) {
      console.log('❌ Storage - Session expired');
      this.sessions.delete(sessionKey);
      return undefined;
    }
    
    console.log('✅ Storage - Session found and valid');
    return session;
  }

  deleteSession(sessionKey: string): void {
    this.sessions.delete(sessionKey);
  }

  // Friend operations
  createFriendRequest(fromUserId: string, friendCode: string): FriendRequest | null {
    const toUser = this.getUserByFriendCode(friendCode);
    if (!toUser || toUser.id === fromUserId) return null;

    // Check if already friends or request exists
    const existingFriend = this.getFriend(fromUserId, toUser.id);
    if (existingFriend) return null;

    const existingRequest = this.findFriendRequest(fromUserId, toUser.id);
    if (existingRequest) return existingRequest;

    const requestId = uuidv4();
    const friendRequest: FriendRequest = {
      id: requestId,
      fromUserId,
      toUserId: toUser.id,
      friendCode,
      status: 'pending',
      createdAt: new Date(),
    };

    this.friendRequests.set(requestId, friendRequest);
    return friendRequest;
  }

  getFriendRequests(userId: string): FriendRequest[] {
    return Array.from(this.friendRequests.values()).filter(
      request => request.toUserId === userId && request.status === 'pending'
    );
  }

  updateFriendRequest(requestId: string, status: 'accepted' | 'rejected'): boolean {
    const request = this.friendRequests.get(requestId);
    if (!request) return false;

    request.status = status;
    
    if (status === 'accepted') {
      // Create friendship for both users
      this.createFriendship(request.fromUserId, request.toUserId);
    }

    return true;
  }

  private createFriendship(userId1: string, userId2: string): void {
    const friendship1: Friend = {
      id: uuidv4(),
      userId: userId1,
      friendId: userId2,
      status: 'accepted',
      createdAt: new Date(),
    };

    const friendship2: Friend = {
      id: uuidv4(),
      userId: userId2,
      friendId: userId1,
      status: 'accepted',
      createdAt: new Date(),
    };

    this.friends.set(friendship1.id, friendship1);
    this.friends.set(friendship2.id, friendship2);
  }

  getFriends(userId: string): User[] {
    const friendIds = Array.from(this.friends.values())
      .filter(friend => friend.userId === userId && friend.status === 'accepted')
      .map(friend => friend.friendId);

    return friendIds
      .map(id => this.users.get(id))
      .filter(user => user !== undefined) as User[];
  }

  private getFriend(userId1: string, userId2: string): Friend | undefined {
    return Array.from(this.friends.values()).find(
      friend => 
        (friend.userId === userId1 && friend.friendId === userId2) ||
        (friend.userId === userId2 && friend.friendId === userId1)
    );
  }

  private findFriendRequest(fromUserId: string, toUserId: string): FriendRequest | undefined {
    return Array.from(this.friendRequests.values()).find(
      request => 
        (request.fromUserId === fromUserId && request.toUserId === toUserId) ||
        (request.fromUserId === toUserId && request.toUserId === fromUserId)
    );
  }

  private generateFriendCode(): string {
    let code: string;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (this.friendCodeToUserId.has(code));
    
    return code;
  }
}

// Use global singleton pattern to persist across Next.js module reloads
declare global {
  var __worldid_storage_instance: Storage | undefined;
}

export const storage = (() => {
  if (!global.__worldid_storage_instance) {
    global.__worldid_storage_instance = new Storage();
  }
  return global.__worldid_storage_instance;
})();
