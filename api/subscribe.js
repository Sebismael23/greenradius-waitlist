// Vercel serverless function to handle Mailchimp subscriptions

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
    return res.status(500).json({ error: 'Mailchimp configuration missing' });
  }

  try {

    // Accept all fields from modal form
    const {
      email_address,
      first_name,
      last_name,
      city,
      state,
      company,
      comment
    } = req.body;

    if (!email_address) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    // Map fields to Mailchimp merge fields (adjust keys to match your Mailchimp audience fields)
    const merge_fields = {
      FNAME: first_name || '',
      LNAME: last_name || '',
      CITY: city || '',
      STATE: state || '',
      COMPANY: company || '',
      COMMENT: comment || ''
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address,
        status: 'subscribed',
        tags: ['waitlist', 'early-adopter'],
        merge_fields
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed!' 
      });
    } else if (data.title === 'Member Exists') {
      return res.status(200).json({ 
        success: true, 
        message: "You're already on the list!" 
      });
    } else {
      throw new Error(data.detail || 'Subscription failed');
    }

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: error.message || 'Failed to subscribe' });
  }
}
