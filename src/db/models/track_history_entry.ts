import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { TrackHistoryEntryInterface } from '../interfaces/track_history_interface.js';
import { TrackHistoryEntrySchema } from '../schemas/track_history_entry_schema.js';

/**
 * 
 */
export const TrackHistoryEntry = model<TrackHistoryEntryInterface>(Collection.TRACK_HISOTORY, TrackHistoryEntrySchema)