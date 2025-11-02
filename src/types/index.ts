export interface Availability {
  id: number;
  user_name: string;
  date: string; // ISO format YYYY-MM-DD
  available: boolean;
  created_at?: string;
}

export interface AvailabilityRequest {
  userName: string;
  date: string;
  available?: boolean;
}

export interface AvailabilityResponse {
  message: string;
  id?: number;
  available: boolean;
}

export type AppScreen = 'matrix' | 'title' | 'nameEntry' | 'calendar' | 'celebration' | 'summary';

export interface DayAvailability {
  date: string;
  users: string[];
}
