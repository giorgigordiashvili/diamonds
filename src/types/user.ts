import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id?: string;
  name?: string; // Add name property
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
  name?: string; // Add name property
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  token?: string; // For authentication responses
}
