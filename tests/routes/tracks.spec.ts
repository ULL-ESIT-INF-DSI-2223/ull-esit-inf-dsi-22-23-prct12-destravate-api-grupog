import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Track } from "../../src/db/models/track.js";
import { ActivityType } from "../../src/db/activity_type.js";
import { User } from "../../src/db/models/user.js";
import { Challenge } from "../../src/db/models/challenge.js";
import { Group } from "../../src/db/models/group.js";
import { testTime } from "./vars.js";

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

/* Test tracks */
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

const testTrack2 = new Track({
  name: "Camino de Candelaria",
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

describe("API Track Endpoint", () => {
  let srv: http.Server
  
  before(async function() {
    this.timeout(5000);
    db.connect(`test${testTime}`)
    srv = api.start(0)
    await Promise.all([Track.deleteMany({}), User.deleteMany({})])
    await Promise.all([Lperez.save(), testTrack.save(), testTrack2.save()])
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
       userIds: ["lperez"],
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

    expect(resp.body).to.deep.equal({error: `E11000 duplicate key error collection: test${testTime}.tracks index: name_1 dup key: { name: "Pico del Inglés" }`})
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

  it("Find track by name", async () => {
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

  it("Fail to find track by name", async () => {
    const resp = await request(srv).get("/tracks?name=Erjos%20a%20Las")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Track with name 'Erjos a Las'"})
  }).timeout(5000)

  it("Fail to update", async () => {
    const resp = await request(srv).put("/tracks?name=Ruta%20Lunar")
      .send({ averageSlope: 15 })
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Track with name 'Ruta Lunar'"})
  }).timeout(5000)

    it("Fail to update by ID", async () => {
      const resp = await request(srv).put("/tracks/645e4ab17c8caa283070dcc2")
        .send({ averageSlope: 15 })
        .expect(404);

      expect(resp.body).to.deep.equal({error: "Not Found: Track with ID '645e4ab17c8caa283070dcc2'"})
    }).timeout(5000)

  it("Update track by ID", async () => {
    const resp = await request(srv).put(`/tracks/${testTrack._id.toString()}`)
      .send({
        averageScore: 10
      })
      .expect(204);
    
    const track = await Track.findOne( {name: "Erjos a Las Portelas"} );
    expect(track).not.to.be.null;
    expect(track?.averageScore).to.be.eql(10);
  }).timeout(5000)

  it("Update track by name", async () => {
    const resp = await request(srv).put("/tracks?name=Camino%20de%20Candelaria")
      .send({
        averageSlope: 25
      })
      .expect(204);

    expect(resp.body).to.deep.equal({})

    const track = await Track.findOne( {name: "Camino de Candelaria"} );
    expect(track).not.to.be.null;
    expect(track?.averageSlope).to.be.eql(25);
  }).timeout(5000)

  it("Delete a track by ID", async () => {
    const resp = await request(srv).delete(`/tracks/${testTrack._id.toString()}`)
      .expect(204);

    const track = await Track.findOne( {name: "Erjos a Las Portelas"} );
    expect(track).to.be.null;
  }).timeout(5000)

  it("Delete a track by name", async () => {
    const resp = await request(srv).delete("/tracks?name=Camino%20de%20Candelaria")
      .expect(204);

    const track = await Track.findOne( {name: "Camino de Candelaria"} );
    expect(track).to.be.null;
  }).timeout(5000)

  it("Delete a track that doesn't exist", async () => {
    const resp = await request(srv).delete("/tracks?name=Ruta%20Lunar")
      .expect(204);
  }).timeout(5000)

  it("Test cascade deletion of tracks", async () => {
    await Promise.all([Challenge.deleteMany({}), Group.deleteMany({}), Track.deleteMany({}), User.deleteMany({})])
    const track1 = new Track({
      _id: "0123456789abcdef00000002",
      name: "Barrando de Ruiz",
      start: {
        latitude: 0,
        longitude: 0,
        mosl: 0,
      },
      end: {
        latitude: 1,
        longitude: 2,
        mosl: 3,
      },
      distanceKm: 2,
      averageSlope: 23,
      userIds: [],
      activity: ActivityType.RUNNING,
      averageScore: 4,
    })
    const track2 = new Track({
      _id: "0123456789abcdef00000003",
      name: "Barrando del Infierno",
      start: {
        latitude: 9,
        longitude: 8,
        mosl: 7,
      },
      end: {
        latitude: 1,
        longitude: 2,
        mosl: 3,
      },
      distanceKm: 2,
      averageSlope: 23,
      userIds: [],
      activity: ActivityType.RUNNING,
      averageScore: 1,
    })
    await Promise.all([track1.save(), track2.save()])

    let challenge = new Challenge({
      _id: "0123456789abcdef00000000",
      name: "Extreme Running",
      routes: ["0123456789abcdef00000002", "0123456789abcdef00000003"],
      userIds: [],
      activity: ActivityType.RUNNING,
    });
    let group = new Group({
      _id: "0123456789abcdef00000001",
      name: "Santacruceros",
      participants: [],
      favoriteRoutes: ["0123456789abcdef00000003", "0123456789abcdef00000002"],
      routeHistory: [
        {
          routeId: track1._id,
          date: "2023-05-13T17:54:24.082Z",
          kms: 2,
          averageSlope: 23,
        },
        {
          routeId: track2._id,
          date: "2023-05-13T17:54:24.082Z",
          kms: 2,
          averageSlope: 23,
        },
      ],
      createdBy: "",
      activity: ActivityType.RUNNING,
    })
    let user = new User({
      _id: "pepe",
      name: "Pepe del Castillo",
      friends: [],
      groupFriends: [],
      activeChallenges: [],
      favoriteRoutes: ["0123456789abcdef00000003", "0123456789abcdef00000002"],
      routeHistory: [
        {
          routeId: track1._id,
          date: "2023-05-13T17:54:24.082Z",
          kms: 2,
          averageSlope: 23,
        },
        {
          routeId: track2._id,
          date: "2023-05-13T17:54:24.082Z",
          kms: 2,
          averageSlope: 23,
        },
      ],
      activity: ActivityType.RUNNING,
    })
    await Promise.all([challenge.save(), group.save(), user.save()])

    await request(srv).delete("/tracks/0123456789abcdef00000002").expect(204)

    const newDocs = await Promise.all([Challenge.findById(challenge._id), Group.findById(group._id), User.findById(user._id)])
    challenge = newDocs[0]!
    group = newDocs[1]!
    user = newDocs[2]!

    expect(challenge.routes.length).to.equal(1)
    expect(challenge.routes[0].toString()).to.equal("0123456789abcdef00000003")
    
    expect(group.favoriteRoutes.length).to.equal(1)
    expect(group.favoriteRoutes[0].toString()).to.equal("0123456789abcdef00000003")
    expect(group.routeHistory.length).to.equal(1)
    expect(group.routeHistory[0].routeId.toString()).to.equal("0123456789abcdef00000003")

    expect(user.favoriteRoutes.length).to.equal(1)
    expect(user.favoriteRoutes[0].toString()).to.equal("0123456789abcdef00000003")
    expect(user.routeHistory.length).to.equal(1)
    expect(user.routeHistory[0].routeId.toString()).to.equal("0123456789abcdef00000003")
    
  }).timeout(5000)
})
