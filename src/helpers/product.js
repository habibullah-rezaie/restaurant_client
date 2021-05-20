/**
 *
 * @param {String} description
 * @param {Number} length
 */
export function summerizeDescription(description, length) {
  const descriptionSlice = description.slice(0, length);

  if (descriptionSlice.endsWith(".")) return descriptionSlice;

  const sentences = descriptionSlice.split(".");
  const lastIncompeteSentence = sentences[sentences.length - 1];
  if (lastIncompeteSentence.length < 30) {
    return descriptionSlice.slice(0, length - lastIncompeteSentence.length);
  }

  const words = descriptionSlice.split(" ");
  if (words.length >= 2) return words.slice(0, words.length - 2).join(" ");
  return descriptionSlice.slice(0, length - 3);
}

export function calcItemPrice(price, qty, toppings, discount = 0) {
  const toppingsPrice = toppings.reduce((a, b) => a + b.price, 0);

  const result = qty * ((price * (100 - discount)) / 100 + toppingsPrice);
  return Math.round(result * 100) / 100;
}
