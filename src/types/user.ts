import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id?: string;
  email: string;
  password: string; // This will store the hashed password
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  token?: string; // For authentication responses
}
