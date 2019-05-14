const getRandomString = () => {
  const rand = Math.random(); // generate random number to determine string length
  console.log(rand);
  const lengths = [
    { length: 6, min: 0, max: 0.68 }, // setting probabilities of string lengths
    { length: 7, min: 0.68, max: 0.925 },
    { length: 8, min: 925, max: 1 }
  ];
  var length = 0;
  for (var i = 0; i < lengths.length; i++) {
    if (rand <= lengths[i].max) { // if rand falls in the min-max range
      length = lengths[i].length;
      break;
    }
  }
  var randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // there are 62 characters to choose from when generating a random string.
  // with 6 character slots, there are 56,800,235,584 (~57 billion) unique combinations.
  // with 7 character slots, there are 3.5216146e+12 -- 3,521,614,600,000 (~3.5 trillion) unique combinations.
  // with 8 character slots, there are 2.1834011e+14 -- 218,340,110,000,000 (~220 trillion) unique combinations.
  console.log(possible.length);

  for (var i = 0; i < length; i++)
      randomString += possible.charAt(Math.floor(Math.random() * possible.length));

  // return randomString so we can save as a key in firebase.
  console.log(randomString);
  return randomString;
}

export default getRandomString;
