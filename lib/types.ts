// lib/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "organizer" | "guest";
  createdAt: string;
}

export interface Event {
  _id: string; // Changed from id to _id
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  organizerId: string;
  imageUrl?: string;
  category: "wedding" | "corporate" | "birthday" | "conference" | "other";
  isPublic: boolean;
  rsvpDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVP {
  _id: string; // Changed from id to _id
  eventId: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  status: "attending" | "not-attending" | "maybe";
  plusOnes: number;
  dietaryRestrictions?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventStats {
  totalEvents: number;
  totalRSVPs: number;
  attendingCount: number;
  notAttendingCount: number;
  maybeCount: number;
}