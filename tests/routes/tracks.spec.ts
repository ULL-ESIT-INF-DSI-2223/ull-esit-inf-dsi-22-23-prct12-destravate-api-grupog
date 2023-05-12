import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Track } from "../../src/db/models/track.js";
import { ActivityType } from "../../src/db/activity_type.js";
import { User } from "../../src/db/models/user.js";

/* Test user */
const Lperez = new User({
  _id: "lperez",
  name: "Lucas Pérez",
  friends: [],
  groupFriends: [],
  favoriteRoutes: [],
  activeChallenges: [],
  routeHistory: [],
  activity: ActivityType.BICYCLE
})

/* Test track */
const testTrack = new Track({
  name: "Erjos a Las Portelas",
  start: {
    latitude: 50,
    longitude: 110,
    mosl: 4_000
  },
  end: {
    latitude: 55,
    longitude: 150,
    mosl: 3_000
   },
   distanceKm: 30_000,
   averageSlope: 35,
   userIds: [],
   activity: ActivityType.RUNNING,
   averageScore: 7
})

describe("API Users Endpoint", () => {
  let srv: http.Server
  
  before(async () => {
    db.connect("test")
    srv = api.start(0)
    await Track.deleteMany({})
    await Lperez.save()
    await testTrack.save()
  })
    
  it("Create track", async () => {
    const resp = await request(srv).post("/tracks")
    .send({
      name: "Pico del Inglés",
      start: {
        latitude: 50,
        longitude: 110,
        mosl: 4000
      },
      end: {
        latitude: 55,
        longitude: 150,
        mosl: 3000
       },
       distanceKm: 30000,
       averageSlope: 35,
       userIds: [],
       activity: ActivityType.RUNNING,
       averageScore: 7
    }).expect(201);

    // Database test
    const track = await Track.findOne( {name: "Pico del Inglés"} );
    expect(track).not.to.be.null;

  }).timeout(5000)

  it("Trying to create invalid track", async () => {
    const resp = await request(srv).post("/tracks")
      .send({
        start: {
          latitude: 50,
          longitude: 110,
          mosl: 4_000
        },
        end: {
          latitude: 55,
          longitude: 150,
          mosl: 3_000
        },
        distanceKm: 30_000,
        averageSlope: 35,
        userIds: [],
        averageScore: 7
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: "tracks validation failed: activity: Path `activity` is required., name: Path `name` is required."})
  }).timeout(5000)

  it("Trying to create track with duplicated name", async () => {
    const resp = await request(srv).post("/tracks")
      .send({
        name: "Pico del Inglés",
        start: {
          latitude: 50,
          longitude: 110,
          mosl: 4_000
        },
        end: {
          latitude: 55,
          longitude: 150,
          mosl: 3_000
        },
        distanceKm: 30_000,
        averageSlope: 35,
        userIds: [],
        activity: ActivityType.RUNNING,
        averageScore: 7
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: 'E11000 duplicate key error collection: test.tracks index: name_1 dup key: { name: "Pico del Inglés" }'})
  }).timeout(5000)

  it("Find track by ID", async () => {
    const resp = await request(srv).get(`/tracks/${testTrack._id.toString()}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(resp.body).to.deep.equal({
      _id: testTrack._id.toString(),
      name: "Erjos a Las Portelas",
      start: {
        latitude: 50,
        longitude: 110,
        mosl: 4_000
      },
      end: {
        latitude: 55,
        longitude: 150,
        mosl: 3_000
      },
      distanceKm: 30_000,
      averageSlope: 35,
      userIds: [],
      activity: ActivityType.RUNNING,
      averageScore: 7
    })
  }).timeout(5000)

  it("Fail to find track by ID", async () => {
    const resp = await request(srv).get("/tracks/645e4ab17c8caa283070dcc2")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Track with ID '645e4ab17c8caa283070dcc2'"})
  }).timeout(5000)

  it("Find user by name", async () => {
    const resp = await request(srv).get("/tracks?name=Erjos%20a%20Las%20Portelas")
      .expect('Content-Type', /json/)
      .expect(200);

      expect(resp.body).to.deep.equal({
        _id: testTrack._id.toString(),
        name: "Erjos a Las Portelas",
        start: {
          latitude: 50,
          longitude: 110,
          mosl: 4_000
        },
        end: {
          latitude: 55,
          longitude: 150,
          mosl: 3_000
          },
          distanceKm: 30_000,
          averageSlope: 35,
          userIds: [],
          activity: ActivityType.RUNNING,
          averageScore: 7
      })
  }).timeout(5000)

  it("Fail to find user by name", async () => {
    const resp = await request(srv).get("/tracks?name=Erjos%20a%20Las")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Track with name 'Erjos a Las'"})
  }).timeout(5000)

})

