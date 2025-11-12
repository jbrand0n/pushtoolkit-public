# Resend Email Setup Guide (2 Minutes!)

Resend is now integrated into your Push Notification Platform! It's incredibly easy to set up.

## ✅ Current Status

✅ Resend package installed (`resend`)
✅ Email service updated to use Resend
✅ Environment variables configured
✅ Password reset emails ready
✅ Email verification emails ready

**Current Mode:** Console logging (emails logged to terminal)
**To Enable:** Add your Resend API key to `.env`

---

## 🚀 Resend Setup (Literally 2 Minutes)

### Step 1: Create Account (30 seconds)

1. Go to [https://resend.com](https://resend.com)
2. Click **"Start Building"**
3. Sign up with **GitHub** (easiest) or email
4. That's it! You're in.

**Free Tier:** 3,000 emails/month, 100 emails/day

---

### Step 2: Get API Key (30 seconds)

1. You'll land on the dashboard after signup
2. Click **"API Keys"** in left sidebar (or you might already see it)
3. Click **"Create API Key"**
4. Give it a name: **"Push Notification Platform"**
5. Click **"Add"**
6. **COPY THE API KEY** (starts with `re_`)

**That's it!** No sender verification, no domain setup, no BS.

---

### Step 3: Add to .env (30 seconds)

Open `backend/.env` and update:

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev
FROM_NAME=Push Notification Platform
```

**Important Notes:**
- Keep `FROM_EMAIL=onboarding@resend.dev` for now (Resend provides this for testing)
- You can change `FROM_NAME` to your brand name
- When you have a domain, you can add it to Resend and use your own email

---

### Step 4: Restart Backend (10 seconds)

```bash
cd backend
# Stop the server (Ctrl+C if running)
npm start
```

You should see: `✓ Resend email service initialized`

---

## 🧪 Test It Now!

### Test Password Reset

1. Go to [http://localhost:5173/forgot-password](http://localhost:5173/forgot-password)
2. Enter any email address
3. Click "Send Reset Link"
4. **Check your email!** (It'll actually arrive this time 🎉)

### Test Email Verification

1. Go to [http://localhost:5173/signup](http://localhost:5173/signup)
2. Create an account with a real email
3. Check your inbox for verification email
4. Click the link to verify

---

## 💡 Using Your Own Domain (Optional)

Want to send from `hello@yourdomain.com` instead of `onboarding@resend.dev`?

### In Resend Dashboard:

1. Click **"Domains"** in sidebar
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend gives you to your domain registrar
5. Wait for verification (usually 5-10 minutes)

### In your .env:

```env
FROM_EMAIL=hello@yourdomain.com
```

Done! Now emails come from your branded domain.

---

## 📊 Why Resend is Better

**vs SendGrid:**
- ❌ SendGrid: Complex sender verification, domain authentication, confusing UI
- ✅ Resend: No verification needed, just works, clean API

**vs Others:**
- 3x more free emails than SendGrid (3,000 vs 100/month)
- Simpler API than Mailgun
- Better developer experience than all competitors
- Used by companies like Vercel, Supabase, Cal.com

---

## 🔧 Troubleshooting

### Emails Not Sending

**Check backend console:**
```
⚠ RESEND_API_KEY not set - emails will be logged to console only
```
→ Add your API key to `.env` and restart

**Error: "Invalid API key"**
→ Make sure you copied the full key (starts with `re_`)

**Emails going to spam**
→ Add your own domain in Resend (see "Using Your Own Domain" above)

### Still Issues?

Check the backend terminal for error messages. Resend errors are very clear and helpful.

---

## 📈 Upgrading

Once you exceed 3,000 emails/month:

- **Pro Plan:** $20/month → 50,000 emails
- **Business Plan:** $80/month → 100,000 emails

Still cheaper than SendGrid and way easier! 🎉

---

## ✅ You're Done!

Your email system is fully configured and ready to send real emails.

**Next Steps:**
1. Add your API key to `.env`
2. Restart the backend
3. Test password reset
4. Enjoy stress-free email sending! 🚀

Questions? Check [Resend docs](https://resend.com/docs) or the backend logs.
