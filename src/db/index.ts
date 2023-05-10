import { connect as connectDb } from "mongoose"

export async function connect(dbName: string): Promise<void> {
  await connectDb(`mongodb+srv://grupog:3iRlvRw9qxYyEaSP@destravatedb.fvzjaan.mongodb.net/${dbName}`)
}
