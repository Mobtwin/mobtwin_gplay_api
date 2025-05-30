const androidVersions = ["14", "13", "12", "11", "10", "9"];
const deviceModels = [
  "Pixel 7 Pro", "Pixel 6", "Samsung Galaxy S22", "OnePlus 10 Pro",
  "Xiaomi 13", "Nothing Phone 1", "Samsung Galaxy A52"
];
const locales = ["en-US", "en-GB", "de-DE", "fr-FR", "es-ES", "pt-BR"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMobileChromeUA() {
  const android = getRandomItem(androidVersions);
  const model = getRandomItem(deviceModels).replace(/ /g, "_");
  const chromeMajor = 113 + Math.floor(Math.random() * 10);
  const build = `${chromeMajor}.0.${Math.floor(Math.random() * 5000)}.${Math.floor(Math.random() * 150)}`;
  return `Mozilla/5.0 (Linux; Android ${android}; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${build} Mobile Safari/537.36`;
}

export function generateGooglePlayHeaders() {
  return {
    "User-Agent": generateMobileChromeUA(),
    "Accept-Language": getRandomItem(locales),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Upgrade-Insecure-Requests": "1",
    "Referer": "https://play.google.com/"
  };
}


