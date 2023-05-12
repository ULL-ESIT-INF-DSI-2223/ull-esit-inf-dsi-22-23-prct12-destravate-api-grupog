import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"
import { Challenge } from "../../src/db/models/challenge.js";

// describe("API Challenges Endpoint", () => {
//   let srv: http.Server

//   before(async () => {
//     db.connect("test")
//     srv = api.start(0)
//     await Challenge.deleteMany({})
//   })
  
//   it("Create challenge", async () => {
//     const resp = await request(srv).post("/challenges")
//       .send({
//         uid: "mdorta",
//         name: "Miguel Dorta",
//         friends: [],
//         groupFriends: [],
//         favoriteRoutes: [],
//         activeChallenges: [],
//         routeHistory: [],
//       })
//       .expect(201);
    
//     // Database test
//     const user = await Challenge.findOne(resp.body.uid);
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
