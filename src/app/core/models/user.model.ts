export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security practices even in mock
  hasBiometricsEnabled: boolean;
  avatarUrl?: string;
}
