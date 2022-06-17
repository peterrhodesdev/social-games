function randomInt(min, max) {
  if (min > max) {
    throw new Error(`min ${min} must be less than max ${max}`);
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomElement(array) {
  return array[randomInt(0, array.length - 1)];
}

function shuffle(array) {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
}

export { randomElement, randomInt, shuffle };
