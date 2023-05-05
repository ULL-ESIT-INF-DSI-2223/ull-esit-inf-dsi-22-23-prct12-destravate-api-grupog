import { TrackHistoryEntryInterface } from "../interfaces/track_history_interface.js"
import { Schema, Types } from 'mongoose';

/**
 * 
 */
export const TrackHistoryEntrySchema = new Schema<TrackHistoryEntryInterface>({
  routeId: {
    type: Types.ObjectId,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  kms: {
    type: Number,
    required: true
  },
  averageSlope: {
    type: Number,
    required: true
  },
})
