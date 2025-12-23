// Vercel Serverless Function to get recent subscribers for social proof
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || 'us21';

  if (!API_KEY || !LIST_ID) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members?count=5&sort_field=timestamp_signup&sort_dir=DESC`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok && result.members) {
      const subscribers = result.members.map(member => ({
        first_name: member.merge_fields.FNAME || 'Someone',
        city: member.merge_fields.CITY || '',
        state: member.merge_fields.STATE || '',
        timestamp: member.timestamp_signup
      }));
      return res.status(200).json({ success: true, subscribers });
    } else {
      return res.status(400).json({ error: 'Failed to fetch subscribers' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
