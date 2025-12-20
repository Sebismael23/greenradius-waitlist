// Vercel serverless function to fetch recent subscribers from Mailchimp

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
    return res.status(500).json({ error: 'Mailchimp configuration missing' });
  }

  try {
    // Fetch recent subscribers (last 10, sorted by subscription date)
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members?count=10&sort_field=timestamp_signup&sort_dir=DESC&status=subscribed`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get total subscriber count
    const listResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const listData = await listResponse.json();
    const totalSubscribers = listData.stats?.member_count || 0;

    // Map subscriber data (anonymized - only location and time)
    const recentSubscribers = data.members.map(member => {
      // Get location info
      const location = member.location || {};
      let locationString = 'Unknown Location';
      
      if (location.city && location.country_code) {
        locationString = location.city;
      } else if (location.country_code) {
        locationString = location.country_code;
      } else if (member.merge_fields?.CITY) {
        locationString = member.merge_fields.CITY;
      }
      
      return {
        location: locationString,
        timestamp: member.timestamp_signup || member.timestamp_opt
      };
    });

    return res.status(200).json({
      subscribers: recentSubscribers,
      totalCount: totalSubscribers
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return res.status(500).json({ error: 'Failed to fetch subscriber data' });
  }
}
