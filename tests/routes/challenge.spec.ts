import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Challenge } from "../../src/db/models/challenge.js";
import { Track } from "../../src/db/models/track.js";
import { ActivityType } from "../../src/db/activity_type.js";
import { User } from "../../src/db/models/user.js";
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

const Mdorta = new User({
    _id: "mdorta",
    name: "Miguel Dorta",
    friends: [],
    groupFriends: [],
    favoriteRoutes: [],
    activeChallenges: [],
    routeHistory: [],
    activity: ActivityType.RUNNING
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

/* Test challenge */
const testChallenge = new Challenge({
  name: "Candelaria Challenge",
  activity: ActivityType.RUNNING
})

/* Test challenge 2 */
const testChallenge2 = new Challenge({
  name: "Arona Challenge",
  activity: ActivityType.RUNNING
})

describe("API Challenge Endpoint", () => {
  let srv: http.Server
  
  before(async function() {
    this.timeout(5000);
    db.connect(`test${testTime}`)
    srv = api.start(0)
    await Promise.all([Track.deleteMany({}), User.deleteMany({}), Challenge.deleteMany({})])
    await Promise.all([Lperez.save(), Mdorta.save(), testTrack.save(), testTrack2.save(), testChallenge.save(), testChallenge2.save()])
  })
    
  it("Create Challenge", async () => {
    const resp = await request(srv).post("/challenges")
    .send({
      name: "La Laguna Challenge",
      userIds: [
        Lperez._id
      ],
      routes: [
        testTrack._id,
        testTrack2._id
      ],
      activity: "Correr"
    }).expect(201);

    // Database test
    const challenge = await Challenge.findOne( {name: "La Laguna Challenge"} );
    expect(challenge).not.to.be.null;

  }).timeout(5000)

  it("Trying to create invalid challenge", async () => {
    const resp = await request(srv).post("/challenges")
      .send({
        userIds: [
          Lperez._id
        ],
        routes: [
          testTrack._id,
          testTrack2._id
        ],
        activity: "Correr"
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: "challenges validation failed: name: Path `name` is required."})
  }).timeout(5000)

  it("Trying to create challenge with duplicated name", async () => {
    const resp = await request(srv).post("/challenges")
      .send({
        name: "La Laguna Challenge",
        userIds: [
          Lperez._id
        ],
        routes: [
          testTrack._id,
          testTrack2._id
        ],
        activity: "Correr"
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: `E11000 duplicate key error collection: test${testTime}.challenges index: name_1 dup key: { name: "La Laguna Challenge" }`})
  }).timeout(5000)

  it("Find challenge by ID", async () => {
    const resp = await request(srv).get(`/challenges/${testChallenge._id.toString()}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(resp.body).to.deep.equal({
      _id: testChallenge._id.toString(),
      name: "Candelaria Challenge",
      routes: [],
      userIds: [],
      activity: "Correr"
    })
  }).timeout(5000)

  it("Fail to find challenge by ID", async () => {
    const resp = await request(srv).get("/challenges/645e4ab17c8caa283070dcc2")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Challenge with ID '645e4ab17c8caa283070dcc2'"})
  }).timeout(5000)

  it("Find challenge by name", async () => {
    const resp = await request(srv).get("/challenges?name=Arona%20Challenge")
      .expect('Content-Type', /json/)
      .expect(200);

      expect(resp.body).to.deep.equal({
        _id: testChallenge2._id.toString(),
        name: "Arona Challenge",
        routes: [],
        userIds: [],
        activity: "Correr"
      })
  }).timeout(5000)

  it("Fail to find challenge by name", async () => {
    const resp = await request(srv).get("/challenges?name=Challenge")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Challenge with name 'Challenge'"})
  }).timeout(5000)

  it("Fail to update by name", async () => {
    const resp = await request(srv).put("/challenges?name=Teide%20Challenge")
      .send({ activity: ActivityType.RUNNING })
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Challenge with name 'Teide Challenge'"})
  }).timeout(5000)
  
  it("Fail to update by ID", async () => {
    const resp = await request(srv).put("/challenges/645e4ab17c8caa283070dcc2")
      .send({
        userIds: [
          Mdorta._id
        ]
      })
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Challenge with ID '645e4ab17c8caa283070dcc2'"})
  }).timeout(5000)

  it("Update challenge by ID", async () => {
    const resp = await request(srv).put(`/challenges/${testChallenge._id.toString()}`)
      .send({
        userIds: [
          Mdorta._id
        ]
      })
      .expect(204);
    
    const challenge = await Challenge.findOne( {name: "Candelaria Challenge"} );
    expect(challenge).not.to.be.null;
    expect(challenge?.userIds).to.be.eql([Mdorta._id]);
  }).timeout(5000)

  it("Update challenge by name", async () => {
    const resp = await request(srv).put("/challenges?name=Arona%20Challenge")
      .send({
        userIds: [
          Lperez._id
        ]
      })
      .expect(204);

    expect(resp.body).to.deep.equal({})

    const challenge = await Challenge.findOne( {name: "Arona Challenge"} );
    expect(challenge).not.to.be.null;
    expect(challenge?.userIds).to.be.eql([Lperez._id]);
  }).timeout(5000)

  it("Delete a challenge by ID", async () => {
    const resp = await request(srv).delete(`/challenges/${testChallenge._id.toString()}`)
      .expect(204);

    const challenge = await Challenge.findOne( {name: "Candelaria Challenge"} );
    expect(challenge).to.be.null;
  }).timeout(5000)

  it("Delete a challenge by name", async () => {
    const resp = await request(srv).delete("/challenges?name=Arona%20Challenge")
      .expect(204);

    const challenge = await Challenge.findOne( {name: "Arona Challenge"} );
    expect(challenge).to.be.null;
  }).timeout(5000)

  it("Delete a challenge that doesn't exist", async () => {
    const resp = await request(srv).delete("/challenges?name=Challenge%20Lunar")
      .expect(204);
  }).timeout(5000)
  
  it("Test cascade deletion of challenges", async () => {
    await Promise.all([Challenge.deleteMany({}), User.deleteMany({})])
    const challenge1 = new Challenge({
      _id: "0123456789abcdef00000000",
      name: "Extreme Running",
      routes: [],
      userIds: [],
      activity: ActivityType.RUNNING,
    });
    const challenge2 = new Challenge({
      _id: "0123456789abcdef00000001",
      name: "Extreme Bikes",
      routes: [],
      userIds: [],
      activity: ActivityType.BICYCLE,
    });
    await Promise.all([challenge1.save(), challenge2.save()])

    let user = new User({
      _id: "pepe",
      name: "Pepe del Castillo",
      friends: [],
      groupFriends: [],
      favoriteRoutes: [],
      activeChallenges: [challenge1._id, challenge2._id],
      routeHistory: [],
      activity: ActivityType.RUNNING,
    })
    await user.save()

    await request(srv).delete("/challenges/0123456789abcdef00000000").expect(204)

    user = (await User.findById(user._id))!

    expect(user.activeChallenges.length).to.equal(1)
    expect(user.activeChallenges[0].toString()).to.equal("0123456789abcdef00000001")
  }).timeout(5000)
})
