import { connect } from 'mongoose';
import { Track } from './models/track.js';
import { Challenge } from './models/challenge.js';

connect('mongodb+srv://grupog:3iRlvRw9qxYyEaSP@destravatedb.fvzjaan.mongodb.net/test').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});
