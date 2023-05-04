/**
 * compareStrings copies the behavior of the default string comparison of Javascript.
 * @param a String 1.
 * @param b String 2.
 * @returns The comparison value of the strings.
 */
export function compareStrings(a: string, b: string): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

/**
 * compareStringsIgnoreCase compares both strings using the default behavior of Javascript but ignoring the case.
 * @param a String 1.
 * @param b String 2.
 * @returns The comparison value of the strings, ignoring casing.
 */
export function compareStringsIgnoreCase(a: string, b: string): number {
  return compareStrings(a.toLowerCase(), b.toLowerCase())
}

/**
 * compareStringsFirstIgnoringCase compares both strings first while ignoring the case, and if they are found to be
 * identical compares them regularly.
 * @param a String 1.
 * @param b String 2.
 * @returns The comparison value of the strings.
 */
export function compareStringsFirstIgnoringCase(a: string, b: string): number {
  const diff = compareStringsIgnoreCase(a, b)
  if (diff !== 0) {
    return diff
  }
  return compareStrings(a, b)
}

