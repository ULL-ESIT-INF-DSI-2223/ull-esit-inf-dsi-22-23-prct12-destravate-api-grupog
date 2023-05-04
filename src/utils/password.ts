import bcrypt from "bcrypt"

const rounds = 12

/**
 * hashPassword hashes the user password using bcrypt.
 * @param pass Password of the user.
 * @returns The hash of the password.
 */
export function hashPassword(pass: string): string {
  return bcrypt.hashSync(pass, rounds)
}

/**
 * passwordMatches checks whether the password provided matches the hash provided.
 * @param pass Password to check.
 * @param hash Hash to check against.
 * @returns True if the password matches the hash. False otherwise.
 */
export function passwordMatches(pass: string, hash: string): boolean {
  return bcrypt.compareSync(pass, hash)
}
