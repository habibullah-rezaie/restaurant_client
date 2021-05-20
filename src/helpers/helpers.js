export const isEqual = (a, b) => {
  const aProbs = Object.getOwnPropertyNames(a);
  const bProbs = Object.getOwnPropertyNames(b);

  if (aProbs.length !== bProbs.length) return false;

  for (let i = 0; i < aProbs.length; i++) {
    const aProbName = aProbs[i];

    if (typeof a[aProbName] !== typeof b[aProbName]) return false;
    if (typeof a[aProbName] === "object")
      if (!isEqual(a[aProbName], b[aProbName])) 
        return false;
    if (a[aProbName] !== b[aProbName]) return false;
  }

  return true;
};

export const wait = async (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
