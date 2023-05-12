import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { User } from "../../src/db/models/user.js";
import { ActivityType } from "../../src/db/activity_type.js";

describe("API Users Endpoint", () => {
  let srv: http.Server

  before(async () => {
    db.connect("test")
    srv = api.start(0)
    await User.deleteMany({})
  })
  
  it("Create user", async () => {
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
})
