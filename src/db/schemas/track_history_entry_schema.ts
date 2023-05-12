import { TrackHistoryEntryInterface } from "../interfaces/track_history_interface.js"
import { Schema } from 'mongoose';

/**
 * Schema to represent a trackhistoryentry following TrackHistoryEntryInterface
 */
export const TrackHistoryEntrySchema = new Schema<TrackHistoryEntryInterface>({
  routeId: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
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
}, {_id: false})
