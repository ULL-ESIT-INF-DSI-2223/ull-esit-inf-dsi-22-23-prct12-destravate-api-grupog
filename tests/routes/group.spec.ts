import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Group } from "../../src/db/models/group.js";
import { ActivityType } from "../../src/db/activity_type.js";

// describe("API Groups Endpoint", () => {
//   let srv: http.Server

//   before(async () => {
//     db.connect("test")
//     srv = api.start(0)
//     await Group.deleteMany({})
//   })
  
//   it("Create group", async () => {
//     const resp = await request(srv).post("/groups")
//       .send({
//         uid: "mdorta",
//         name: "Miguel Dorta",
//         friends: [],
//         groupFriends: [],
//         favoriteRoutes: [],
//         activeChallenges: [],
//         routeHistory: [],
//         activity: ActivityType.RUNNING
//       })
//       .expect(201);
    
//     // Database test
//     const user = await Group.findOne(resp.body.uid);
//     expect(user).not.to.be.null;
//     expect(user?.name).to.equal('Miguel');
//   })

//   it("Trying to create invalid user", async () => {
//     const resp = await request(srv).post("/users")
//       .send({
//         uid: "mdorta2",
//         name: "Miguel Dorta",
//         activity: ActivityType.RUNNING
//       })
//       .expect()
//       .expect(201);
//   })
// })
