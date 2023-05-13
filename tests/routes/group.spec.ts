import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Group } from "../../src/db/models/group.js";
import { ActivityType } from "../../src/db/activity_type.js";
import { User } from "../../src/db/models/user.js";
import { Track } from "../../src/db/models/track.js";

/* Test user */
const Lperez = new User({
  _id: "lperez",
  name: "Lucas Pérez",
  friends: [],
  groupFriends: [],
  favoriteRoutes: [],
  activegroups: [],
  routeHistory: [],
  activity: ActivityType.BICYCLE
})

const Mdorta = new User({
    _id: "mdorta",
    name: "Miguel Dorta",
    friends: [],
    groupFriends: [],
    favoriteRoutes: [],
    activegroups: [],
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

/* Test Group */
const testGroup = new Group({
  name: "TestGroup 1",
  createdBy: Lperez._id,
  activity: "Correr"
})

/* Test Group 2 */
const testGroup2 = new Group({
  name: "TestGroup 2",
  createdBy: Mdorta._id,
  activity: "Correr"
})

describe("API Group Endpoint", () => {
  let srv: http.Server
  
  before(async function() {
    this.timeout(5000);
    db.connect("test")
    srv = api.start(0)
    await Promise.all([Track.deleteMany({}), User.deleteMany({}), Group.deleteMany({})])
    await Promise.all([Lperez.save(), Mdorta.save(), testTrack.save(), testTrack2.save()])
    await Promise.all([testGroup.save(), testGroup2.save()])
  })
    
  it("Create group", async () => {
    const resp = await request(srv).post("/groups")
      .send({
        name: "Caminantes de Andorra",
        participants: [Lperez._id],
        favouriteRoutes: [],
        routeHistory: [],
        createdBy: Lperez._id,
        activity: ActivityType.RUNNING
      })
      .expect(201);
    
    // Database test
    const group = await Group.findOne( {name: "Caminantes de Andorra"} );
    expect(group).not.to.be.null;
  }).timeout(5000)

  it("Trying to create invalid group", async () => {
    const resp = await request(srv).post("/groups")
      .send({
        participants: [Lperez._id],
        favouriteRoutes: [],
        routeHistory: [],
        createdBy: Lperez._id,
        activity: ActivityType.RUNNING
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: "groups validation failed: name: Path `name` is required."})
  }).timeout(5000)

  it("Trying to create group with duplicated name", async () => {
    const resp = await request(srv).post("/groups")
      .send({
        name: "Caminantes de Andorra",
        participants: [Lperez._id],
        favouriteRoutes: [],
        routeHistory: [],
        createdBy: Lperez._id,
        activity: ActivityType.RUNNING
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(resp.body).to.deep.equal({error: 'E11000 duplicate key error collection: test.groups index: name_1 dup key: { name: "Caminantes de Andorra" }'})
  }).timeout(5000)

  it("Find group by ID", async () => {
    const resp = await request(srv).get(`/groups/${testGroup._id.toString()}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(resp.body).to.deep.equal({
      _id: testGroup._id.toString(),
      name: "TestGroup 1",
      participants: [],
      favoriteRoutes: [],
      routeHistory: [],
      createdBy: Lperez._id,
      activity: "Correr"
    })
  }).timeout(5000)

  it("Fail to find group by ID", async () => {
    const resp = await request(srv).get("/groups/645e4ab17c8caa283070dcc2")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Group with ID '645e4ab17c8caa283070dcc2'"})
  }).timeout(5000)

  it("Find group by name", async () => {
    const resp = await request(srv).get("/groups?name=TestGroup%201")
      .expect('Content-Type', /json/)
      .expect(200);

      expect(resp.body).to.deep.equal({
        _id: testGroup._id.toString(),
        name: "TestGroup 1",
        participants: [],
        favoriteRoutes: [],
        routeHistory: [],
        createdBy: Lperez._id,
        activity: "Correr"
      })
  }).timeout(5000)

  it("Fail to find group by name", async () => {
    const resp = await request(srv).get("/groups?name=TestGroup3")
      .expect('Content-Type', /json/)
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Group with name 'TestGroup3'"})
  }).timeout(5000)

  it("Fail to update by name", async () => {
    const resp = await request(srv).put("/groups?name=Teide%20Group")
      .send({ activity: ActivityType.BICYCLE })
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Group with name 'Teide Group'"})
  }).timeout(5000)
  
  it("Fail to update by ID", async () => {
    const resp = await request(srv).put("/groups/645e4ab17c8caa283070dcc2")
      .send({ activity: ActivityType.BICYCLE })
      .expect(404);

    expect(resp.body).to.deep.equal({error: "Not Found: Group with ID '645e4ab17c8caa283070dcc2'"})
  }).timeout(5000)

  it("Update group by ID", async () => {
    const resp = await request(srv).put(`/groups/${testGroup._id.toString()}`)
      .send({ activity: ActivityType.BICYCLE })
      .expect(204);
    
    const group = await Group.findOne( {name: "TestGroup 1"} );
    expect(group).not.to.be.null;
    expect(group?.activity).to.equal(ActivityType.BICYCLE);
  }).timeout(5000)

  it("Update group by name", async () => {
    const resp = await request(srv).put("/groups?name=TestGroup%202")
      .send({
        participants: [
          Lperez._id,
          Mdorta._id
        ]
      })
      .expect(204);

    expect(resp.body).to.deep.equal({})

    const group = await Group.findOne( {name: "TestGroup 2"} );
    expect(group).not.to.be.null;
    expect(group?.participants).to.be.eql([Lperez._id, Mdorta._id]);
  }).timeout(5000)

  it("Delete a group by ID", async () => {
    const resp = await request(srv).delete(`/groups/${testGroup2._id.toString()}`)
      .expect(204);

    const group = await Group.findOne( {name: "TestGroup 2"} );
    expect(group).to.be.null;
  }).timeout(5000)

  it("Delete a group by name", async () => {
    const resp = await request(srv).delete("/groups?name=TestGroup%201")
      .expect(204);

    const group = await Group.findOne( {name: "TestGroup 1"} );
    expect(group).to.be.null;
  }).timeout(5000)

  it("Delete a group that doesn't exist", async () => {
    const resp = await request(srv).delete("/groups?name=Challenge%20Lunar")
      .expect(204);
  }).timeout(5000)

  it("Test cascade deletion of group", async () => {
    await Promise.all([Group.deleteMany({}), User.deleteMany({})])
    const group1 = new Group({
      _id: "0123456789abcdef00000000",
      name: "Santacruceros",
      participants: [],
      favoriteRoutes: [],
      routeHistory: [],
      createdBy: "",
      activity: ActivityType.RUNNING,
    })
    const group2 = new Group({
      _id: "0123456789abcdef00000001",
      name: "Laguneros",
      participants: [],
      favoriteRoutes: [],
      routeHistory: [],
      createdBy: "",
      activity: ActivityType.BICYCLE,
    })
    await Promise.all([group1.save(), group2.save()])

    let user = new User({
      _id: "pepe",
      name: "Pepe del Castillo",
      friends: [],
      groupFriends: [group1._id, group2._id],
      favoriteRoutes: [],
      activeChallenges: [],
      routeHistory: [],
      activity: ActivityType.RUNNING,
    })
    await user.save()

    await request(srv).delete("/groups/0123456789abcdef00000000").expect(204)

    user = (await User.findById(user._id))!

    expect(user.groupFriends.length).to.equal(1)
    expect(user.groupFriends[0].toString()).to.equal("0123456789abcdef00000001")
  }).timeout(5000)
})
