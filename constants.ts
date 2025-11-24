import { Ticket, CommunityPost, ParkingSpot } from './types';

export const INITIAL_TICKETS: Ticket[] = [
  { id: 'T-101', title: 'HVAC Noise', severity: 'MEDIUM', status: 'IN_PROGRESS', area: 'Penthouse B' },
  { id: 'T-102', title: 'Lobby Spill', severity: 'LOW', status: 'RESOLVED', area: 'Main Entrance' },
  { id: 'T-103', title: 'Elevator 3 Jam', severity: 'CRITICAL', status: 'PENDING', area: 'Service Core' },
];

export const MOCK_RESIDENT_NAME = "Mr. Stark";

export const PLAZA_THEME = {
  primary: '#0F172A', // Slate 900
  accent: '#0EA5E9',  // Sky 500
  bg: '#FFFFFF',
  surface: '#F1F5F9', // Slate 100
};

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'P-1',
    author: 'Unit 402',
    title: 'Selling: Eames Lounge Replica',
    price: '$800',
    content: 'Beautiful walnut finish, barely used. Moving to Paris next month so everything must go.',
    type: 'SALE',
    likes: 12
  },
  {
    id: 'P-2',
    author: 'Plaza Management',
    title: 'Sunset Yoga on the Roof',
    content: 'Join us this Thursday at 7PM for a complimentary session with instructor Sarah.',
    type: 'EVENT',
    likes: 45
  },
  {
    id: 'P-3',
    author: 'Unit 705',
    title: 'Kids Playdate: Central Garden',
    content: 'Looking for other parents with toddlers for a Saturday morning meetup!',
    type: 'ANNOUNCEMENT',
    likes: 8
  }
];

export const PARKING_LEVEL_1: ParkingSpot[] = [
  { id: 'A1', level: 'L1', number: '101', status: 'OCCUPIED', type: 'RESIDENT' },
  { id: 'A2', level: 'L1', number: '102', status: 'OCCUPIED', type: 'RESIDENT' },
  { id: 'A3', level: 'L1', number: '103', status: 'AVAILABLE', type: 'RESIDENT' },
  { id: 'A4', level: 'L1', number: '104', status: 'OCCUPIED', type: 'EV' },
  { id: 'A5', level: 'L1', number: '105', status: 'ASSIGNED', type: 'GUEST' }, // The target for the guest
  { id: 'A6', level: 'L1', number: '106', status: 'AVAILABLE', type: 'GUEST' },
  { id: 'A7', level: 'L1', number: '107', status: 'OCCUPIED', type: 'RESIDENT' },
  { id: 'A8', level: 'L1', number: '108', status: 'AVAILABLE', type: 'RESIDENT' },
];