import express from "express";
import challenges from "./challenges.js";
import groups from "./groups.js";
import tracks from "./tracks.js";
import users from "./users.js";
import "../db/connections.js"
import { sendError } from "./_common.js";

const app = express();
app.use(express.json());

challenges(app)
groups(app)
tracks(app)
users(app)

app.all("*", (_, resp) => sendError(resp, "Not found: Endpoint or Method", 404))
app.listen(12345)
