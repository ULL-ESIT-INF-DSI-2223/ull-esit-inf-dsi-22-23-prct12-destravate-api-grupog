import { Document, ObjectId } from 'mongoose';

/**
 * 
 */
export interface TrackHistoryEntryInterface extends Document {
  routeId: ObjectId
  date: string
  kms: number
  averageSlope: number
}