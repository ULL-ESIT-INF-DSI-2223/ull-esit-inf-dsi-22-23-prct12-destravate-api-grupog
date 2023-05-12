// import * as http from "node:http";
// import request from "supertest";
// import { expect } from "chai";
// import * as api from "../../src/routes/index.js"
// import * as db from "../../src/db/index.js"
// import { Track } from "../../src/db/models/track.js";
// import { ActivityType } from "../../src/db/activity_type.js";

// describe("API Users Endpoint", () => {
//   let srv: http.Server
  
//   before(() => {
//     db.connect("test")
//     srv = api.start(0)
//   })
    
//   it("Default route", async () => {
//     const resp = await request(srv).get("/").expect('Content-Type', "application/json").expect(404);
//     expect(resp.body).to.deep.equal({error: "Not found: Endpoint or Method"})
//   })

//   it("Create track", async () => {
//     const resp = await request(srv).post("/tracks")
//     .send({
//        name: "Poner nombre",
//        start: {
//              latitude: 50,
//              longitude: 110,
//              mosl: 4_000
//         },
//        end: {
//             latitude: 55,
//             longitude: 150,
//             mosl: 3_000
//        },
//        distanceKm: 30_000,
//        averageSlope: 35,
//        userIds: ["123452", "312342"],
//        activity: ActivityType.RUNNING,
//        averageScore: 7
//     }).expect(201);
//   })
// })
