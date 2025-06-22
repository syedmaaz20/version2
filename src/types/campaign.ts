
export interface Campaign {
  id: string;
  studentName: string;
  goal: number;
  raised: number;
  photo: string;
  shareCode: string; // add this for short url
  videoUrl?: string; // add videoUrl for youtube demo
  isVerified?: boolean; // add verification status
  verificationStatus?: 'pending' | 'approved' | 'rejected'; // verification workflow
  submittedAt?: string; // when profile was submitted for verification
}

export interface FundingBreakdown {
  label: string;
  amount: number;
  percent: number;
  color: string;
  legend?: string;
}

export interface ImpactItem {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export interface Supporter {
  name: string;
  amount: number;
  label?: string;
  avatarUrl?: string;
  time?: string;
  message?: string;
}
