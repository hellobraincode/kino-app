export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  duration: number; // in minutes
  thumbnailUrl: string;
  videoUrl: string;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'guest' | 'member' | 'admin';
  createdAt?: any;
}

export interface MembershipRequest {
  id: string;
  uid: string;
  messengerProfileUrl: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  reviewedAt?: any;
  reviewedBy?: string;
}
