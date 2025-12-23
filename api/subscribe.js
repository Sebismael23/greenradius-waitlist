// Vercel Serverless Function for Mailchimp Subscription
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email_address, first_name, last_name, city, state, company, comment } = req.body;

  if (!email_address) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || 'us21';

  if (!API_KEY || !LIST_ID) {
    console.error('Missing Mailchimp credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address,
    status: 'subscribed',
    merge_fields: {
      FNAME: first_name || '',
      LNAME: last_name || '',
      CITY: city || '',
      STATE: state || '',
      COMPANY: company || '',
      COMMENT: comment || ''
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    } else if (result.title === 'Member Exists') {
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    } else {
      console.error('Mailchimp error:', result);
      return res.status(400).json({ error: result.detail || 'Subscription failed' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
