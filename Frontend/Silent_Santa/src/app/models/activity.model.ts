export interface Activity {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  activityType: 'LOGIN' | 'LOGOUT';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface ActivityFilter {
  userId?: string;
  activityType?: 'LOGIN' | 'LOGOUT';
  startDate?: Date;
  endDate?: Date;
}