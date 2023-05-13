export interface Error {
  message: string
}

/**
 * Function to indicate if something is a native java script error
 */
export function isError(e: unknown): e is Error {
  return !!e && typeof e === "object" && "message" in e && typeof e.message === "string"
}
