/**
 * Calculates the (positive) remainder left over when one operand is divided by a second operand.
 * @param {number} n dividend
 * @param {number} m divisor
 * @returns n % m > 0
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

export { mod };
