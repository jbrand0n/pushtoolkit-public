# VAPID Keys - Automatic Setup ✅

## TL;DR - Nothing to Do!

**VAPID keys are automatically generated** when you create a new site. Zero configuration required!

## What Are VAPID Keys?

VAPID (Voluntary Application Server Identification) keys are cryptographic keys used for Web Push notifications. They consist of:

- **Public Key**: Shared with the browser and subscribers (safe to expose)
- **Private Key**: Kept secret on your server (used to sign push messages)

## How It Works in Your Platform

### 1. Creating a Site

When you create a new site via the dashboard:

```javascript
// This happens automatically in the backend
const vapidKeys = generateVapidKeys();  // ← Auto-generated!

const site = await prisma.site.create({
  data: {
    name: 'My Website',
    url: 'https://example.com',
    vapidPublicKey: vapidKeys.publicKey,   // Stored in database
    vapidPrivateKey: vapidKeys.privateKey,  // Stored securely
    ...
  }
});
```

### 2. Installation Code

When you get your installation code (Settings → Installation tab):

```html
<script>
  var publicKey = 'BKx7...';  // ← Your auto-generated public key

  // Browser uses this to subscribe to push notifications
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });
</script>
```

### 3. Sending Notifications

When you send a notification, the backend automatically:

```javascript
// Uses the private key to sign the message
webpush.setVapidDetails(
  'mailto:your@email.com',
  site.vapidPublicKey,    // Public key
  site.vapidPrivateKey    // Private key (never exposed)
);

// Sends the notification
await webpush.sendNotification(subscription, payload);
```

## Where to See Your VAPID Keys

### In the Dashboard:

1. Go to **Settings** in the sidebar
2. Click on the **"VAPID Keys"** tab
3. You'll see:
   - ✅ Public Key (full display)
   - 🔒 Private Key (hidden for security - shows as ••••)

### What Each Site Gets:

- ✅ **Unique VAPID key pair** per site
- ✅ **Stored securely** in the database
- ✅ **Automatically used** when sending notifications
- ✅ **Never expires** (unless you regenerate)

## Security Notes

### Public Key (Safe to Share)
- ✅ Shown in installation code
- ✅ Exposed to browsers/subscribers
- ✅ Used by browsers to create subscriptions
- ✅ Cannot be used to send notifications

### Private Key (Keep Secret!)
- 🔒 Never sent to browsers
- 🔒 Never shown in dashboard (hidden as ••••)
- 🔒 Only used server-side
- 🔒 Used to sign and send push notifications
- ⚠️ **Important**: In production, this should be encrypted at rest (TODO in code)

## Common Questions

### Q: Do I need to generate VAPID keys manually?
**A: No!** They're auto-generated when you create a site.

### Q: Can I use the same keys for multiple sites?
**A: No, each site gets unique keys.** This is for security and isolation.

### Q: What if I lose my private key?
**A: It's stored in the database.** As long as your database is backed up, you're safe.

### Q: Can I regenerate keys for an existing site?
**A: Not yet implemented**, but if needed:
1. All existing subscribers would need to re-subscribe
2. You'd need to update your installation code

### Q: Do the keys expire?
**A: No, they never expire** unless you manually regenerate them.

### Q: Where's my VAPID contact email?
**A: Set in the backend** (`backend/src/utils/vapid.js` line 17):
```javascript
subject = 'mailto:admin@example.com'  // ← Change this in production!
```

## Production Checklist

Before going live, update:

1. **VAPID Contact Email**:
   - File: `backend/src/utils/vapid.js`
   - Change: `'mailto:admin@example.com'` → `'mailto:your@domain.com'`
   - Why: Browser vendors may contact you about push issues

2. **Private Key Encryption** (Recommended):
   - Currently stored as plain text in database
   - TODO: Implement encryption at rest
   - See: `backend/src/controllers/siteController.js` line 36

## Testing Your VAPID Setup

### 1. Create a Site
```bash
# Via dashboard
1. Click "+ New Site"
2. Fill in details
3. Click "Create Site"

# VAPID keys are auto-generated!
```

### 2. View Keys
```bash
# Via dashboard
1. Go to Settings
2. Click "VAPID Keys" tab
3. See your public key
```

### 3. Test with Installation Code
```bash
# Via dashboard
1. Go to Settings
2. Click "Installation" tab
3. Copy the code (includes your public key)
4. Add to your website
5. Visit your site
6. Allow notifications when prompted
7. Check "Subscribers" page to see yourself!
```

## Example Keys (What They Look Like)

### Public Key:
```
BKx7m3B8Nv8L9QyJ5K3P4R6T8V2W9X0Y1Z3A5B7C9D1E3F5G7H9J1K3L5M7N9P
```
- Base64-encoded
- ~88 characters
- Safe to expose publicly

### Private Key:
```
ABCdefGHIjklMNOpqrSTUvwxYZ0123456789-_ABCdef
```
- Base64-encoded
- ~44 characters
- Must keep secret!

---

## Summary

✅ **Automatic**: Keys generated on site creation
✅ **Unique**: Each site has its own key pair
✅ **Secure**: Private keys never exposed to browsers
✅ **Persistent**: Stored in database
✅ **No Setup**: Just create a site and go!

**You literally don't need to do anything with VAPID keys!** 🎉

They're handled automatically from site creation to sending notifications.
