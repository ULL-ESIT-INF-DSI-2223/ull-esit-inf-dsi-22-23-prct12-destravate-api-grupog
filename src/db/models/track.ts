import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { TrackInterface } from '../interfaces/track_interface.js';
import { TrackSchema } from '../schemas/track_schema.js';

/**
 * 
 */
export const Track = model<TrackInterface>(Collection.TRACKS, TrackSchema);