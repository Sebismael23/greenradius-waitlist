# Mailchimp Setup Guide for GreenRadius Waitlist

This guide will help you connect your GreenRadius waitlist to Mailchimp on Vercel.

## Step 1: Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Click on your profile icon → **Account & billing**
3. Go to **Extras** → **API keys**
4. Click **Create A Key**
5. Copy the API key (it looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us21`)

## Step 2: Find Your Audience (List) ID

1. Go to **Audience** → **All contacts**
2. Click **Settings** → **Audience name and defaults**
3. Find the **Audience ID** at the bottom of the page (it looks like: `abc123def4`)

## Step 3: Get Your Server Prefix

Your server prefix is in your API key and your Mailchimp URL:
- If your API key ends in `-us21`, your server prefix is `us21`
- Or look at your Mailchimp dashboard URL: `https://us21.admin.mailchimp.com`

## Step 4: Configure Vercel Environment Variables

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - `MAILCHIMP_API_KEY` = your API key
   - `MAILCHIMP_LIST_ID` = your audience ID
   - `MAILCHIMP_SERVER_PREFIX` = your server prefix (e.g., `us21`)
4. Click **Save** for each variable

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel (or it will auto-deploy if already connected)
3. Vercel will automatically detect the API functions in `api/`
4. Your waitlist is now connected to Mailchimp!

## How It Works

### Subscription Flow
1. User enters email in the waitlist form
2. Form submits to `/api/subscribe`
3. Vercel serverless function adds the subscriber to your Mailchimp audience
4. User sees success message

### Real-Time Notifications
1. Page loads and calls `/api/recent-subscribers`
2. Function fetches recent subscribers from Mailchimp (anonymized - only location)
3. Notifications show "Someone from [City] joined the waitlist [time ago]!"
4. Notifications rotate every 30 seconds with real data

## Features

✅ **Real subscriber count** - Shows actual number from Mailchimp  
✅ **Real-time notifications** - Shows actual recent signups with location  
✅ **Privacy-focused** - Only shows city, not names or emails  
✅ **Auto-tagging** - Subscribers are tagged with "waitlist" and "early-adopter"  
✅ **Duplicate handling** - Existing subscribers see "You're already on the list!"  

## Local Development

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Create a `.env.local` file with your Mailchimp credentials:
   ```
   MAILCHIMP_API_KEY=your_api_key_here
   MAILCHIMP_LIST_ID=your_list_id_here
   MAILCHIMP_SERVER_PREFIX=us21
   ```

3. Run Vercel Dev:
   ```bash
   vercel dev
   ```

4. Open `http://localhost:3000` in your browser

## Troubleshooting

### "Mailchimp configuration missing" error
- Make sure all 3 environment variables are set in Vercel
- Redeploy after adding environment variables

### Notifications not showing real data
- Check browser console for errors
- Verify your Mailchimp audience has subscribers with location data
- Mailchimp gets location from IP when users subscribe

### Form not submitting
- Check that API functions are deployed (check Functions tab in Vercel)
- Check function logs in Vercel dashboard

## Need Help?

- [Mailchimp API Documentation](https://mailchimp.com/developer/marketing/api/)
- [Vercel Serverless Functions Documentation](https://vercel.com/docs/functions)
