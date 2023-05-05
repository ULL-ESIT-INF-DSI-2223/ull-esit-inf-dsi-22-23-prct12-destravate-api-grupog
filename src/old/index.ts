import MainManager from "./cli/managers/main_manager.js";
import Database from "./db/database.js";

const db = new Database();
await db.load();
await (new MainManager(db)).main()
