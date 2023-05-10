import * as api from "./routes/index.js"
import * as db from "./db/index.js"

db.connect("test")
api.start(12345)
