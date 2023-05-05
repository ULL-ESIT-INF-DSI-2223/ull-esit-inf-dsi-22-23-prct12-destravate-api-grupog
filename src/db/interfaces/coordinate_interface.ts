import { Document } from 'mongoose';

/**
 * 
 */
export interface CoordinatesInterface extends Document {
  latitude: number,
  longitude: number,
  mosl: number
}