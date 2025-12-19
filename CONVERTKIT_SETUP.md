# ConvertKit Integration Setup Guide

## Step 1: Create Your ConvertKit Account

1. Go to [ConvertKit.com](https://convertkit.com) and sign up (free for up to 10,000 subscribers)
2. Verify your email address

## Step 2: Create a Form in ConvertKit

1. Log in to ConvertKit
2. Go to **Grow** → **Landing Pages & Forms**
3. Click **+ Create new** → Select **Form**
4. Choose **Inline** form type
5. Select a template (you can customize later)
6. Name your form (e.g., "GreenRadius Waitlist")
7. Click **Save**

## Step 3: Get Your Form ID

1. After creating the form, look at the URL in your browser
   - It will look like: `https://app.convertkit.com/forms/YOUR_FORM_ID/edit`
   - Copy the number (e.g., `1234567`)

2. Or click on **Settings** → **HTML Embed** and find the form ID in the code

## Step 4: Update Your Website

**Find and replace** `YOUR_FORM_ID` in these files:
- `index.html` (appears 4 times)
- `features.html` (appears 2 times)
- `about.html` (appears 1 time)

Replace `YOUR_FORM_ID` with your actual form ID number.

### Quick Find & Replace:
- Search for: `YOUR_FORM_ID`
- Replace with: `1234567` (your actual form ID)

## Step 5: Configure Your Form in ConvertKit

### Incentive Email (Recommended)
1. Go to your form in ConvertKit
2. Click **Settings** → **Incentive Email**
3. Enable incentive email
4. Customize the email subject and body:
   ```
   Subject: 🎉 You're on the GreenRadius Waitlist!
   
   Body: Thanks for joining the GreenRadius waitlist! 
   
   You're now among the first to help transform neighborhoods 
   into environmental forces for good.
   
   What happens next?
   ✓ We'll keep you updated on our progress
   ✓ You'll get early access when we launch
   ✓ First 500 members get Lifetime Pro free!
   
   - The GreenRadius Team 🌱
   ```

### Success Message
1. Go to **Settings** → **After submit**
2. Choose "Show a success message"
3. Leave as default (our website handles success UI)

### Add Tags (Optional but Recommended)
1. Go to **Settings** → **Tags**
2. Create a tag called "Waitlist"
3. This helps you segment subscribers later

## Step 6: Test Your Integration

1. Open your website in a browser
2. Enter a test email address
3. Click "Join Waitlist"
4. Check ConvertKit to see if the subscriber appears
5. Check the test email for the confirmation

## Additional ConvertKit Features to Set Up

### 1. Welcome Sequence (Recommended)
Create an automated email sequence for new subscribers:
1. Go to **Send** → **Sequences**
2. Create a sequence called "Waitlist Welcome"
3. Add 2-3 emails over a week
4. Set the trigger: "Subscribes to form: GreenRadius Waitlist"

**Example Sequence:**
- **Day 0:** Welcome + What to expect
- **Day 3:** Sneak peek of features
- **Day 7:** Invite to follow on social media

### 2. Subscriber Segments
Create segments for:
- Early adopters (first 500)
- Different city locations (if you collect that data)

### 3. Landing Page (Optional)
ConvertKit can host a dedicated landing page that you can link to from social media.

## Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify the Form ID is correct
- Make sure ConvertKit form is published (not draft)

### Not receiving confirmation emails?
- Check spam folder
- Verify incentive email is enabled in ConvertKit
- Check email address is valid

### CORS errors?
- ConvertKit should handle this automatically
- If issues persist, the form will fall back to a regular POST submission

## Support

- ConvertKit Help: https://help.convertkit.com
- ConvertKit API Docs: https://developers.convertkit.com

---

**Your Form ID:** `_____________` (write it here for reference)

**Forms Updated:**
- [ ] index.html
- [ ] features.html  
- [ ] about.html

**Tested On:**
- [ ] Desktop
- [ ] Mobile
- [ ] Received confirmation email
