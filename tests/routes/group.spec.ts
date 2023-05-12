import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Group } from "../../src/db/models/group.js";
import { ActivityType } from "../../src/db/activity_type.js";
import { User } from "../../src/db/models/user.js";

/* Test user */
const testUser = new User({
  _id: "testUser1",
  name: "Test 1",
  friends: [],
  groupFriends: [],
  favoriteRoutes: [],
  activeChallenges: [],
  routeHistory: [],
  activity: ActivityType.RUNNING
})

/* Test user 2 */
const testUser2 = new User({
  _id: "testUser2",
  name: "Test 2",
  friends: [],
  groupFriends: [],
  favoriteRoutes: [],
  activeChallenges: [],
  routeHistory: [],
  activity: ActivityType.RUNNING
})

describe("API Groups Endpoint", () => {
  let srv: http.Server

  before(async () => {
    db.connect("test")
    srv = api.start(0)
    await Promise.all([Group.deleteMany({}), testUser.save(), testUser2.save()])
  })
  
  it("Create group", async () => {
    const resp = await request(srv).post("/groups")
      .send({
        name: "Caminantes de Andorra",
        participants: ["testUser2", "testUser1"],
        favouriteRoutes: [],
        routeHistory: [],
        createdBy: "testUser2",
        activity: ActivityType.RUNNING
      })
      .expect(201);
    
    // Database test
    const group = await Group.findOne( {name: "Caminantes de Andorra"} );
    expect(group).not.to.be.null;
  }).timeout(5000)

  // it("Trying to create invalid user", async () => {
  //   const resp = await request(srv).post("/groups")
  //     .send({
  //       _id: "mdorta2",
  //       name: "Miguel Dorta",
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(400);

  //   expect(resp.body).to.deep.equal({error: "groups validation failed: activity: Path `activity` is required."})
  // }).timeout(5000)

  // it("Trying to create user with duplicated id", async () => {
  //   const resp = await request(srv).post("/groups")
  //     .send({
  //       _id: "mdorta",
  //       name: "Miguel Dorta",
  //       friends: [],
  //       groupFriends: [],
  //       favoriteRoutes: [],
  //       activeChallenges: [],
  //       routeHistory: [],
  //       activity: ActivityType.RUNNING
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(400);

  //   expect(resp.body).to.deep.equal({error: 'E11000 duplicate key error collection: test.groups index: _id_ dup key: { _id: "mdorta" }'})
  // }).timeout(5000)

  // it("Find user by ID", async () => {
  //   const resp = await request(srv).get("/groups/mdorta")
  //     .expect('Content-Type', /json/)
  //     .expect(200);

  //   expect(resp.body).to.deep.equal({
  //     _id: "mdorta",
  //     name: "Miguel Dorta",
  //     friends: [],
  //     groupFriends: [],
  //     favoriteRoutes: [],
  //     activeChallenges: [],
  //     routeHistory: [],
  //     activity: ActivityType.RUNNING
  //   })
  // }).timeout(5000)

  // it("Fail to find user by ID", async () => {
  //   const resp = await request(srv).get("/groups/mdorta2")
  //     .expect('Content-Type', /json/)
  //     .expect(404);

  //   expect(resp.body).to.deep.equal({error: "Not Found: User with ID 'mdorta2'"})
  // }).timeout(5000)

  // it("Find user by name", async () => {
  //   const resp = await request(srv).get("/groups?name=Miguel%20Dorta")
  //     .expect('Content-Type', /json/)
  //     .expect(200);

  //     expect(resp.body).to.deep.equal({
  //       _id: "mdorta",
  //       name: "Miguel Dorta",
  //       friends: [],
  //       groupFriends: [],
  //       favoriteRoutes: [],
  //       activeChallenges: [],
  //       routeHistory: [],
  //       activity: ActivityType.RUNNING
  //     })
  // }).timeout(5000)

  // it("Fail to find user by name", async () => {
  //   const resp = await request(srv).get("/groups?name=MiguelDorta")
  //     .expect('Content-Type', /json/)
  //     .expect(404);

  //   expect(resp.body).to.deep.equal({error: "Not Found: User with name 'MiguelDorta'"})
  // }).timeout(5000)
})
