import { connect } from 'mongoose';
import { Track } from './models/track.js';
import { Challenge } from './models/challenge.js';
import { testDatabaseURL } from './connections_db.js';

connect(testDatabaseURL).then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

const challenge = new Challenge({
  name: "Challenge test",
  routes: "6454ecde8b3e2063f017fbc7",
  userIds: ["1", "12", "13"],
  activity: "Ciclismo"
})

challenge.save().then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})

const trackTest = new Track({
  name: "Prueba",
  start: {latitude:81, longitude:100, mosl: 1_001},
  end: {latitude:81, longitude:100, mosl: 1_001},
  distanceKm: 1,
  averageSlope: 0,
  userIds: ["1", "12"],
  activity: "Ciclismo",
  averageScore: 5
})

trackTest.save().then((result) => {
  console.log("Ruta añadida")
}).catch((error) => {
  console.log(error)
})
