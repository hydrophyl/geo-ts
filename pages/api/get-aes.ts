import { NextApiHandler } from 'next';

function generateRandomLocationsInGermany(count: number) {
  const locations = [];
  for (let i = 0; i < count; i++) {
    const lat = (Math.random() * (55.0581 - 47.2701)) + 47.2701; // Latitude range for Germany
    const lon = (Math.random() * (15.0419 - 5.8663)) + 5.8663;  // Longitude range for Germany
    locations.push({
      lat: parseFloat(lat.toFixed(6)),
      lon: parseFloat(lon.toFixed(6)),
      weight: Math.floor(Math.random() * 100), // Random weight value
    });
  }
  return locations;
}

const handler: NextApiHandler = async (_, res) => {
  // Mocked data
  const results = generateRandomLocationsInGermany(50);
  return res.json(results);
};

export default handler;