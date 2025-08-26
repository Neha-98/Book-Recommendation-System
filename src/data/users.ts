import { User } from '../types';

// Realistic user data with varied rating patterns - typical of 2020 recommendation systems
export const users: User[] = [
  {
    id: 1,
    name: "Sarah Chen",
    ratings: { 1: 5, 2: 4, 3: 5, 4: 3, 5: 5, 7: 4, 11: 5, 12: 4 }
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    ratings: { 1: 3, 2: 5, 4: 4, 6: 5, 9: 5, 10: 4, 11: 3 }
  },
  {
    id: 3,
    name: "Emily Johnson",
    ratings: { 1: 5, 3: 5, 5: 5, 7: 5, 8: 4, 11: 4, 12: 5 }
  },
  {
    id: 4,
    name: "David Kim",
    ratings: { 2: 5, 4: 3, 6: 4, 9: 5, 10: 5, 11: 2 }
  },
  {
    id: 5,
    name: "Jessica Williams",
    ratings: { 1: 4, 3: 5, 5: 4, 7: 3, 8: 4, 12: 5 }
  },
  {
    id: 6,
    name: "Robert Thompson",
    ratings: { 2: 4, 4: 4, 6: 5, 9: 4, 10: 3, 11: 4 }
  },
  {
    id: 7,
    name: "Amanda Davis",
    ratings: { 1: 5, 2: 3, 3: 4, 5: 5, 7: 5, 12: 4 }
  },
  {
    id: 8,
    name: "Christopher Lee",
    ratings: { 2: 5, 4: 2, 6: 4, 8: 3, 9: 5, 10: 5 }
  },
  {
    id: 9,
    name: "Lisa Martinez",
    ratings: { 1: 4, 3: 5, 5: 3, 11: 5, 12: 5 }
  },
  {
    id: 10,
    name: "James Wilson",
    ratings: { 2: 4, 4: 3, 6: 3, 7: 4, 8: 4, 9: 4 }
  }
];