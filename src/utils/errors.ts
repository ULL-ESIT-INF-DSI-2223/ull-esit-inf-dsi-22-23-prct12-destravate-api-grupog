export interface Error {
  message: string
}

export function isError(e: unknown): e is Error {
  return !!e && typeof e === "object" && "message" in e && typeof e.message === "string"
}
