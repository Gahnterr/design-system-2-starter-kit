/** Subsequence match, case-insensitive: "adr" finds "addresses". */
export function fuzzyMatch(query, text) {
    const haystack = text.toLowerCase();
    let position = 0;
    for (const char of query.toLowerCase()) {
        position = haystack.indexOf(char, position);
        if (position === -1) {
            return false;
        }
        position += 1;
    }
    return true;
}
