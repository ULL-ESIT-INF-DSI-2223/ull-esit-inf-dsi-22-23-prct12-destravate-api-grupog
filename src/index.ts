import * as api from "./routes/index.js"
import * as db from "./db/index.js"

db.connect("destravate")
api.start(0)
