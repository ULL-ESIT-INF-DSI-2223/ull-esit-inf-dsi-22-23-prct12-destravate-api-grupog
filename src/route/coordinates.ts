/**
 * Coordinates class represents geographic coordinates.
 */
export default class Coordinates {
  public latitude: number
  public longitude: number
  public mosl: number

  /**
   * constructor creates a new Coordinates object from the data provided.
   * @param latitude Degrees to the north of the equator. If negative, to the south.
   * @param longitude Degrees to the east of the prime meridian. If negative, to the west.
   * @param mosl Meters over sea level.
   */
  constructor(latitude: number, longitude: number, mosl: number) {
    if (latitude > 90 || latitude < -90 || isNaN(latitude)) {
      throw new Error("Invalid North-South Coordinate");
    }
    if (longitude > 180 || longitude < -180 || isNaN(longitude)) {
      throw new Error("Invalid East-West Coordinate");
    }
    if (mosl > 10_000 || mosl < -500 || isNaN(mosl)) {
      throw new Error("Invalid meters over sea level");
    }
    this.longitude = longitude
    this.latitude = latitude
    this.mosl = mosl
  }

  /**
   * parse function creates a new Coordinates object from the coordinates contained in the string provided.
   * @param s String containing coordinates.
   * @returns A new Coordinates object from the coordinates contained in the string.
   */
  static parse(s: string): Coordinates {
    const m = /^([\d.]+)°([NS]) ([\d.]+)°([EW]) (\d+)m$/.exec(s)
    if (!m) {
      throw new Error("invalid coordinates string");
    }
    return new Coordinates(
      Number(m[1]) * (m[2] === "N" ? 1 : -1),
      Number(m[3]) * (m[4] === "E" ? 1 : -1),
      Number(m[5]))
  }

  /**
   * toString returns a string representation of the given Coordinates object.
   * @returns A string containing the given coordinates.
   */
  static toString(c: Coordinates): string {
    return `${Math.abs(c.latitude)}°${c.latitude >= 0 ? "N" : "S"} ${Math.abs(c.longitude)}°${c.longitude >= 0 ? "E" : "W"} ${c.mosl}m`
  }
}
