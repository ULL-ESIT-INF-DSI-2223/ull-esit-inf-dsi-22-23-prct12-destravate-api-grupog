import { connect as connectDb } from "mongoose"

/**
 * Function to connect to the database
 * @param dbName name of the database that will be connected to
 */
export async function connect(dbName: string): Promise<void> {
  await connectDb(`mongodb+srv://grupog:3iRlvRw9qxYyEaSP@destravatedb.fvzjaan.mongodb.net/${dbName}`)
}
