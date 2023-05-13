import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { User } from "../../src/db/models/user.js";
import { ActivityType } from "../../src/db/activity_type.js";
import { Challenge } from "../../src/db/models/challenge.js";
import { Group } from "../../src/db/models/group.js";
import { Track } from "../../src/db/models/track.js";

describe("API Users Endpoint", () => {
  let srv: http.Server

  before(async () => {
    db.connect("test")
    srv = api.start(0)
    await User.deleteMany({})
  })
  
  it("Create user 1", async () => {
    const resp = await request(srv).post("/users")
      .send({
        _id: "mdorta",
        name: "Miguel Dorta",
        friends: [],
        groupFriends: [],
        favoriteRoutes: [],
        activeChallenges: [],
        routeHistory: [],
        activity: ActivityType.RUNNING
      })
      .expect(201);
    
    // Database test
    const user = await User.findById( resp.body._id );
    expect(user).not.to.be.null;
    expect(user?.name).to.equal('Miguel Dorta');
  }).timeout(5000)

  it("Create user 2", async () => {
    const resp = await request(srv).post("/users")
      .send({
        _id: "lperez",
        name: "Lucas Pérez",
        friends: [],
        groupFriends: [],
        favoriteRoutes: [],
        activeChallenges: [],
        routeHistory: [],
        activity: ActivityType.RUNNING
      })
      .expect(201);
    
    // Database test
    const user = await User.findById( resp.body._id );
    expect(user).not.to.be.null;
    expect(user?.name).to.equal('Lucas Pérez');
  }).timeout(5000)

  it("Trying to create invalid user", async () => {
    const resp = await request(srv).post("/users")
      .send({
        _id: "mdorta2",
        name: "Miguel Dorta",
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: "users validation failed: activity: Path `activity` is required."})
  }).timeout(5000)

  it("Trying to create user with duplicated id", async () => {
    const resp = await request(srv).post("/users")
      .send({
        _id: "mdorta",
        name: "Miguel Dorta",
        friends: [],
        groupFriends: [],
        favoriteRoutes: [],
        activeChallenges: [],
        routeHistory: [],
        activity: ActivityType.RUNNING
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: 'E11000 duplicate key error collection: test.users index: _id_ dup key: { _id: "mdorta" }'})
  }).timeout(5000)

  it("Find user by ID", async () => {
    const resp = await request(srv).get("/users/mdorta")
      .expect('Content-Type', /json/)
      .expect(200);

    expect(resp.body).to.deep.equal({
      _id: "mdorta",
      name: "Miguel Dorta",
      friends: [],
      groupFriends: [],
      favoriteRoutes: [],
      activeChallenges: [],
      routeHistory: [],
      activity: ActivityType.RUNNING
    })
  }).timeout(5000)

  it("Fail to find user by ID", async () => {
    const resp = await request(srv).get("/users/mdorta2")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: User with ID 'mdorta2'"})
  }).timeout(5000)

  it("Find user by name", async () => {
    const resp = await request(srv).get("/users?name=Miguel%20Dorta")
      .expect('Content-Type', /json/)
      .expect(200);

      expect(resp.body).to.deep.equal({
        _id: "mdorta",
        name: "Miguel Dorta",
        friends: [],
        groupFriends: [],
        favoriteRoutes: [],
        activeChallenges: [],
        routeHistory: [],
        activity: ActivityType.RUNNING
      })
  }).timeout(5000)

  it("Fail to find user by name", async () => {
    const resp = await request(srv).get("/users?name=MiguelDorta")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: User with name 'MiguelDorta'"})
  }).timeout(5000)

  it("Update user by ID", async () => {
    const resp = await request(srv).put("/users/lperez")
      .send({ friends: ["mdorta"] })
      .expect(204);
  }).timeout(5000)

  it("Update user by name", async () => {
    const resp = await request(srv).put("/users?name=Miguel%20Dorta")
      .send({ friends: ["lperez"] })
      .expect(204);
  }).timeout(5000)

  it("Delete user by ID", async () => {
    await request(srv).delete("/users/lperez").expect(204);
  }).timeout(5000)

  it("Delete user by name", async () => {
    await request(srv).delete("/users?name=Miguel%20Dorta").expect(204);
  }).timeout(5000)

  it("Test cascade deletion of user", async () => {
    await Promise.all([Challenge.deleteMany({}), Group.deleteMany({}), Track.deleteMany({}), User.deleteMany({})])
    let challenge = new Challenge({
      _id: "0123456789abcdef00000000",
      name: "Extreme Running",
      routes: [],
      userIds: [],
      activity: ActivityType.RUNNING,
    });
    let group = new Group({
      _id: "0123456789abcdef00000001",
      name: "Santacruceros",
      participants: [],
      favoriteRoutes: [],
      routeHistory: [],
      createdBy: "",
      activity: ActivityType.RUNNING,
    })
    let track = new Track({
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
    const user1 = new User({
      _id: "pepe",
      name: "Pepe del Castillo",
      friends: [],
      groupFriends: [],
      favoriteRoutes: [],
      activeChallenges: [],
      routeHistory: [],
      activity: ActivityType.RUNNING,
    })
    let user2 = new User({
      _id: "paco",
      name: "Paco Santana",
      friends: [],
      groupFriends: [],
      favoriteRoutes: [],
      activeChallenges: [],
      routeHistory: [],
      activity: ActivityType.RUNNING,
    })
    await Promise.all([challenge.save(), group.save(), track.save(), user1.save(), user2.save()])

    challenge.userIds = ["pepe", "paco"]
    group.participants = ["paco", "pepe"]
    group.createdBy = "pepe"
    track.userIds = ["pepe", "paco"]
    user1.friends = ["paco"]
    user1.groupFriends = ["0123456789abcdef00000001"]
    user2.friends = ["pepe"]
    user2.groupFriends = ["0123456789abcdef00000001"]

    await Promise.all([challenge.save(), group.save(), track.save(), user1.save(), user2.save()])

    await request(srv).delete("/users/pepe").expect(204)

    const newDocs = await Promise.all([Challenge.findById(challenge._id), Track.findById(track._id), User.findById(user2._id), Group.findById("0123456789abcdef00000001")])
    challenge = newDocs[0]!
    track = newDocs[1]!
    user2 = newDocs[2]!

    expect(newDocs[3]).to.be.null
    expect(challenge.userIds).to.deep.equal(["paco"])
    expect(track.userIds).to.deep.equal(["paco"])
    expect(user2.friends).to.deep.equal([])
    expect(user2.groupFriends).to.deep.equal([])
    
  }).timeout(5000)
})
