import { Document } from 'mongoose';

/**
 * Interface to represent a Coordinate
 */
export interface CoordinatesInterface extends Document {
  latitude: number,
  longitude: number,
  mosl: number
}
