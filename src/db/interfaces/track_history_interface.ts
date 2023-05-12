import { Document, ObjectId } from 'mongoose';

/**
 * Interface to represent an entry of a track history
 */
export interface TrackHistoryEntryInterface extends Document {
  routeId: ObjectId
  date: string
  kms: number
  averageSlope: number
}
