import * as http from "node:http";
import request from "supertest";
import { expect } from "chai";
import * as api from "../../src/routes/index.js"
import * as db from "../../src/db/index.js"

describe("Default Endpoint", () => {
  let srv: http.Server

  before(() => {
    srv = api.start(0)
  })
  
  it("Test default route", async () => {
    const resp = await request(srv).get("/").expect('Content-Type', /json/).expect(404);
    expect(resp.body).to.deep.equal({error: "Not found: Endpoint or Method"})
  })
})
