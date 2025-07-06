export interface ZKProof {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
}

export interface LoginRequest {
  appId: string;
  zkProof: ZKProof;
  actionId?: string;
}

export interface LoginResponse {
  success: boolean;
  sessionKey?: string;
  validUntil?: number;
  txHash?: string;
  error?: string;
}

export interface User {
  id: string;
  worldId: string;
  sessionKey: string;
  username?: string;
  profileImage?: string;
  friendCode: string; // Unique friend code for QR
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  friendCode: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
