import { ObjectId } from 'mongodb';

export type Shape =
  | 'Brilliant'
  | 'Princess'
  | 'Emerald'
  | 'Oval'
  | 'Marquise'
  | 'Radiant'
  | 'Cushion'
  | 'Asscher'
  | 'Heart'
  | 'Pear';

export type Color = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';

export type Clarity =
  | 'FL'
  | 'IF'
  | 'VVS1'
  | 'VVS2'
  | 'VS1'
  | 'VS2'
  | 'SI1'
  | 'SI2'
  | 'I1'
  | 'I2'
  | 'I3';

export type Cut = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export type Polish = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export type Symmetry = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export type Fluorescence = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';

export type Certificate = 'GIA' | 'IGI' | 'HRD' | 'AGS' | 'Other';

export interface Diamond {
  _id?: ObjectId; // MongoDB ObjectId (only used server-side)
  id: string; // Always available string ID for client usage
  name: string;
  shape: Shape;
  carat: number;
  color: Color;
  clarity: Clarity;
  cut: Cut;
  polish: Polish;
  symmetry: Symmetry;
  fluorescence: Fluorescence;
  certificate: Certificate;
  certificateNumber?: string;
  price: number;
  image?: string;
  description?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
