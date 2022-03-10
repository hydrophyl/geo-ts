import { NextApiHandler } from 'next';
import { query } from '../../lib/db';

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT lat, lng, ae_timediff FROM tbl_postcodes, tbl_mapapi WHERE ae_postcode=postcode
    `);
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
