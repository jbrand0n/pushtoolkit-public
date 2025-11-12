// Help Center Content
export const helpContent = {
  // Main categories for help center
  categories: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        {
          id: 'what-is-push',
          title: 'What are Push Notifications?',
          content: `
Push notifications are messages sent from a website to a user's browser, even when they're not on your site. They appear as pop-ups on desktop or mobile devices.

**Key Benefits:**
- Reach users instantly, even when they're not on your site
- Drive traffic back to your website
- Increase engagement and conversions
- Work across all major browsers (Chrome, Firefox, Safari, Edge)

**How It Works:**
1. Visitors subscribe to your notifications (one click)
2. You send notifications through this dashboard
3. Messages appear on their device instantly
4. Users click to visit your site
          `
        },
        {
          id: 'first-notification',
          title: 'Sending Your First Notification',
          content: `
**Step 1: Install the Code**
Go to Settings → Installation tab and copy the code snippet to your website's HTML.

**Step 2: Get Subscribers**
Visitors to your site will see a permission prompt. When they click "Allow," they become subscribers.

**Step 3: Create a Notification**
- Go to Notifications → New Notification
- Choose "One Time" type
- Add your title (max 50 characters)
- Add your message (max 150 characters)
- Enter the destination URL
- Click "Send Now" or schedule for later

**Pro Tip:** Keep your title short and action-oriented. Your message should create urgency or curiosity.
          `
        },
        {
          id: 'setup-guide',
          title: 'Installation & Setup',
          content: `
**Step 1: Create Your Site**
After signup, create your first site by entering your website name and URL. VAPID keys are generated automatically.

**Step 2: Add Installation Code**
1. Go to Settings → Installation tab
2. Copy the provided code snippet
3. Paste it into your website's HTML (before closing </body> tag)
4. Deploy your website

**Step 3: Test Your Setup**
1. Visit your website
2. You should see a notification permission prompt
3. Click "Allow"
4. Check the Subscribers page - you should see yourself listed

**Step 4: Send a Test Notification**
Create a simple notification and send it to yourself to confirm everything works.

**Troubleshooting:**
- Make sure your website uses HTTPS (required for push notifications)
- Clear browser cache if the permission prompt doesn't appear
- Check browser console for any JavaScript errors
          `
        }
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      articles: [
        {
          id: 'dashboard-overview',
          title: 'Understanding Your Dashboard',
          content: `
The dashboard provides a real-time overview of your push notification performance.

**Key Metrics:**

**Total Subscribers**
- Current number of active subscribers
- Shows trend (increase/decrease) compared to previous period
- Green arrow = growth, Red arrow = decline

**Notifications Sent**
- Total number of notifications delivered
- Includes all types: one-time, recurring, campaigns, and RSS
- Trend indicator shows recent performance

**Click Rate**
- Percentage of delivered notifications that were clicked
- Industry average: 5-15%
- Higher is better - optimize your message and timing

**Value Generated**
- Calculated based on your configured values (Settings → Value Goals)
- Formula: (new subscribers × value per subscriber) + (clicks × value per click)
- Track ROI from your push notification efforts

**Charts:**

**Notifications Performance (Line Chart)**
- Blue line: Notifications sent
- Green line: Successfully delivered
- Purple line: Clicked notifications
- Shows 7-day trend

**Weekly Engagement (Bar Chart)**
- Shows which days get the most clicks
- Use this to optimize send timing
- Higher bars = better engagement

**Recent Activity:**
- Lists your most recent notifications
- Shows performance metrics (CTR, sends)
- Quick access to edit or resend
          `
        },
        {
          id: 'reading-metrics',
          title: 'How to Read Your Metrics',
          content: `
**Click Rate (CTR) - Click-Through Rate**
- Formula: (Clicks ÷ Delivered) × 100
- Good: 10-20%
- Average: 5-10%
- Poor: <5%

**Improving Your CTR:**
1. Use action words in your title ("Get," "Discover," "Save")
2. Create urgency ("Limited time," "Today only")
3. Personalize when possible
4. Test different send times
5. Use emojis sparingly in titles

**Delivery Rate**
- Formula: (Delivered ÷ Sent) × 100
- Should be 95%+ for healthy subscribers
- Lower rates may indicate inactive subscribers
- Clean your list by removing inactive users

**Subscriber Growth**
- Track new vs. unsubscribed users
- Seasonal trends are normal
- Promote your push notifications on high-traffic pages

**Value Tracking**
- Set realistic values in Settings → Value Goals
- Track value per subscriber (lifetime value)
- Track value per click (average conversion value)
- Use this data to calculate ROI
          `
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      articles: [
        {
          id: 'notification-types',
          title: 'Types of Notifications',
          content: `
**One-Time Notifications**
- Send immediately or schedule for a specific time
- Perfect for: announcements, promotions, time-sensitive content
- Example: "Flash sale ends in 2 hours!"

**Recurring Notifications**
- Automatically repeat on a schedule (daily, weekly, monthly)
- Perfect for: daily digests, weekly roundups, monthly newsletters
- Example: "Your weekly blog summary - every Monday at 9 AM"
- Set start date and optional end date
- Can be paused/resumed anytime

**Triggered Notifications**
- Automatically sent based on user actions or events
- Currently used for Welcome Campaigns
- Example: "Welcome! Here's a 10% discount" (sent immediately after subscription)

**Choosing the Right Type:**
- Use One-Time for announcements and promotions
- Use Recurring for regular content updates
- Use Welcome Campaigns for new subscriber onboarding
          `
        },
        {
          id: 'writing-effective',
          title: 'Writing Effective Notifications',
          content: `
**Title (Max 50 characters)**
- Make it action-oriented and specific
- Use power words: "New," "Free," "Save," "Limited"
- ✅ Good: "New Blog: 10 Tips to Boost Sales"
- ❌ Bad: "Check out our latest blog post"

**Message (Max 150 characters)**
- Expand on the title with key details
- Create curiosity or urgency
- Include a clear benefit
- ✅ Good: "Learn proven strategies that increased our revenue by 300%. Read now before the offer expires!"
- ❌ Bad: "We published a new blog post on our website about sales."

**Destination URL**
- Must be a complete URL with https://
- Take users directly to the content (no homepage redirects)
- Include UTM parameters for tracking (optional)
- Example: https://yoursite.com/blog/boost-sales?utm_source=push

**Images**
- Icon: Small square image (192x192px recommended)
- Large Image: Banner image (1200x628px recommended)
- Use high-quality, relevant images
- Images increase click rates by 20-40%

**Action Buttons (Optional)**
- Add up to 2 custom buttons
- Example: "Read More" and "Shop Now"
- Increases engagement options
- Not all browsers support action buttons

**Best Practices:**
- Test notifications on different devices
- Send at optimal times (see Dashboard engagement chart)
- A/B test different messages
- Don't overuse emojis (1-2 max)
- Personalize when possible using segments
          `
        },
        {
          id: 'scheduling',
          title: 'Scheduling & Timing',
          content: `
**Immediate Send**
- Sends to all targeted subscribers instantly
- Use for: breaking news, flash sales, urgent updates
- Typically delivers within 1-2 minutes

**Scheduled Send**
- Set a specific date and time
- Timezone is based on your Settings → Timezone
- Schedule up to 30 days in advance
- Can edit or cancel before send time

**Best Times to Send:**
- **E-commerce:** 8-10 AM, 7-9 PM (local time)
- **News/Content:** 6-8 AM, 12-1 PM, 6-8 PM
- **B2B:** 10 AM - 2 PM on weekdays
- **Entertainment:** 7-10 PM

**Day of Week Performance:**
- Check your Dashboard → Weekly Engagement chart
- Tuesday-Thursday typically performs best
- Weekends vary by industry
- Test and track your own patterns

**Frequency Best Practices:**
- Don't send more than 1-2 per day
- Maintain consistent schedule
- Give users time to engage
- Too many = higher unsubscribe rate
- Quality over quantity

**Recurring Notifications Timing:**
- Daily: Send at same time each day
- Weekly: Choose low-competition day (Tuesday/Wednesday)
- Monthly: First week of month performs best
          `
        },
        {
          id: 'notification-status',
          title: 'Understanding Notification Status',
          content: `
**Draft**
- Not yet sent or scheduled
- Can be edited freely
- Can be sent immediately or scheduled
- Can be deleted

**Scheduled**
- Queued to send at a specific time
- Can still be edited before send time
- Can be cancelled
- Shows countdown to send time

**Sending**
- Currently being delivered to subscribers
- Cannot be edited or cancelled
- Typically takes 1-5 minutes depending on audience size
- Progress shown in real-time

**Completed**
- Successfully sent to all subscribers
- Shows final delivery and click metrics
- Cannot be edited (duplicate to reuse)
- View detailed analytics

**Cancelled**
- Scheduled notification that was cancelled
- Not delivered to any subscribers
- Can be duplicated and rescheduled
- Archived for record-keeping

**Failed**
- Delivery errors occurred
- Shows error details
- Can retry or duplicate
- Contact support if issues persist
          `
        }
      ]
    },
    {
      id: 'campaigns',
      title: 'Welcome Campaigns',
      icon: '🎯',
      articles: [
        {
          id: 'campaigns-overview',
          title: 'What are Welcome Campaigns?',
          content: `
Welcome Campaigns are automated notification sequences sent to new subscribers over time.

**How They Work:**
1. User subscribes to your push notifications
2. Step 1 sends immediately (or after a short delay)
3. Step 2 sends after your defined delay (e.g., 1 day later)
4. Step 3 sends after another delay (e.g., 3 days later)
5. And so on...

**Perfect For:**
- Onboarding new subscribers
- Educational drip sequences
- Product tours
- Building engagement over time
- Converting browsers into customers

**Example E-commerce Campaign:**
- Step 1 (Immediate): "Welcome! Here's 10% off your first order"
- Step 2 (1 day): "Still browsing? Here are our bestsellers"
- Step 3 (3 days): "Your discount expires tomorrow!"
- Step 4 (7 days): "New arrivals you'll love"

**Example Content Site Campaign:**
- Step 1 (Immediate): "Thanks for subscribing! Start here..."
- Step 2 (1 day): "Our 5 most popular articles"
- Step 3 (3 days): "How to get the most from our content"
- Step 4 (7 days): "Weekly digest - stay in the loop"
          `
        },
        {
          id: 'creating-campaigns',
          title: 'Creating Effective Campaigns',
          content: `
**Planning Your Campaign:**

**Step 1: Define Your Goal**
- Onboarding and education?
- Driving first purchase?
- Building long-term engagement?
- Sharing key resources?

**Step 2: Map Your Sequence**
- How many steps? (3-7 is ideal)
- What value does each step provide?
- What action do you want users to take?

**Step 3: Set Timing**
- Immediate welcome (Step 1)
- 1 day (Step 2) - Keep momentum
- 3-4 days (Step 3) - Educational content
- 7 days (Step 4+) - Ongoing engagement

**Creating in the Dashboard:**

1. Go to Campaigns → New Campaign
2. Name your campaign (e.g., "New Subscriber Welcome")
3. Add your first notification:
   - Title, message, URL
   - Icon and images
   - This sends immediately by default
4. Click "Add Notification" for Step 2
5. Set delay (e.g., "1 day")
6. Repeat for additional steps
7. Activate the campaign

**Best Practices:**
- Start simple (3-4 steps)
- Provide value in every step
- Don't just promote - educate
- Use images for visual appeal
- Test on yourself first
- Monitor analytics and optimize
- Keep total sequence under 2 weeks

**Timing Tips:**
- Immediate: Thank you + quick win
- 1 day: Educational content
- 3 days: Social proof or testimonials
- 7 days: Final call-to-action
- 14 days: Ongoing updates or newsletter signup
          `
        },
        {
          id: 'campaign-management',
          title: 'Managing Your Campaigns',
          content: `
**Activating a Campaign:**
- Toggle the Active switch to ON
- Applies to all new subscribers
- Existing subscribers are not affected
- Can be activated/deactivated anytime

**Editing a Campaign:**
- Can edit notification content anytime
- Changes apply to future subscribers
- Subscribers mid-sequence get old version
- Delays can be adjusted (affects new subscribers only)

**Multiple Active Campaigns:**
- Only one welcome campaign can be active at a time
- Deactivate current campaign before activating another
- Switch campaigns for seasonal promotions or A/B testing

**Performance Tracking:**
- Each step shows individual metrics
- Compare step-by-step performance
- See where subscribers drop off
- Optimize based on data

**When to Update Your Campaign:**
- Seasonal changes (holiday promotions)
- Low engagement on specific steps
- Product/service changes
- New content or resources
- A/B testing different approaches

**Deleting a Campaign:**
- Subscribers mid-sequence will complete
- New subscribers won't receive it
- Cannot be undone
- Duplicate before deleting if you want to reuse
          `
        }
      ]
    },
    {
      id: 'subscribers',
      title: 'Subscribers',
      icon: '👥',
      articles: [
        {
          id: 'subscriber-management',
          title: 'Managing Your Subscribers',
          content: `
Your subscribers are people who have opted in to receive push notifications from your website.

**Subscriber Information:**
- **Browser:** Chrome, Firefox, Safari, or Edge
- **Operating System:** Windows, macOS, Linux, Android, iOS
- **Country:** Detected from IP address
- **Subscribed Date:** When they opted in
- **Last Seen:** Last time they were active
- **Status:** Active (can receive) or Inactive (unreachable)

**Active vs. Inactive:**
- **Active:** Can receive notifications (browser installed, permissions granted)
- **Inactive:** Cannot receive (browser uninstalled, permissions revoked, or expired endpoint)
- Only active subscribers count toward your send limits

**Growing Your Subscriber Base:**
1. **Prominent Prompts:** Show permission prompt on high-traffic pages
2. **Value Proposition:** Explain benefits before asking ("Get instant deals!")
3. **Timing:** Ask after users show engagement (scroll, time on page)
4. **Soft Ask:** Use custom UI before browser's native prompt
5. **Incentives:** Offer discount or exclusive content for subscribing

**Removing Subscribers:**
- Click "Remove" next to a subscriber
- They won't receive future notifications
- They can re-subscribe by visiting your site
- Use for testing or cleaning inactive users

**Search & Filter:**
- Search by browser, OS, or country
- Filter by Active/Inactive status
- Export data for analysis (coming soon)
          `
        },
        {
          id: 'subscriber-quality',
          title: 'Subscriber Quality & Retention',
          content: `
**What Makes a Quality Subscriber:**
- **Engaged:** Clicks notifications regularly
- **Recent:** Subscribed or active in last 30 days
- **Intentional:** Opted in after seeing value proposition
- **Active:** Browser still installed with permissions granted

**Improving Subscriber Quality:**

**1. Optimize Your Permission Prompt**
- Don't ask immediately on page load
- Show value before asking
- Use clear, benefit-focused language
- Example: "Get instant alerts for flash sales!" (not just "Allow notifications")

**2. Set Expectations**
- Tell users what they'll receive
- How often they'll hear from you
- What value they'll get
- Example: "1-2 updates per week with exclusive deals"

**3. Deliver on Promises**
- Send valuable content consistently
- Don't spam with too many notifications
- Keep quality high
- Match expectations you set

**4. Clean Your List**
- Remove inactive subscribers (90+ days)
- Filter out unengaged users
- Focus on quality over quantity
- Better deliverability and metrics

**Retention Strategies:**
- Send welcome notification immediately
- Use welcome campaigns for onboarding
- Maintain consistent sending schedule
- Personalize using segments
- Ask for feedback periodically
- Offer unsubscribe alternative (less frequent)

**Red Flags:**
- High immediate unsubscribe rate (bad targeting)
- Low engagement across all notifications (poor content)
- High inactive rate (poor subscriber quality)
- Declining subscriber growth (weak value proposition)

**Benchmarks:**
- **Good:** 60-80% active subscribers
- **Average:** 40-60% active
- **Poor:** <40% active
          `
        }
      ]
    },
    {
      id: 'segments',
      title: 'Segments',
      icon: '🎯',
      articles: [
        {
          id: 'segments-overview',
          title: 'What are Segments?',
          content: `
Segments allow you to target specific groups of subscribers based on their characteristics.

**Why Use Segments:**
- **Higher Engagement:** Send relevant content to the right people
- **Better CTR:** Targeted messages perform 2-3x better
- **Reduced Unsubscribes:** Don't send irrelevant content
- **Personalization:** Tailor messages to user characteristics

**Targeting Options:**

**Browser**
- Chrome, Firefox, Safari, Edge
- Use for: browser-specific features or content
- Example: "New Chrome extension available!"

**Operating System**
- Windows, macOS, Linux, Android, iOS
- Use for: OS-specific downloads or content
- Example: "Download our Mac app"

**Country**
- Target by location
- Use for: regional promotions, language-specific content
- Example: "US-only shipping sale!"

**Subscribed Days Ago**
- New vs. long-term subscribers
- Use for: onboarding vs. retention campaigns
- Example: Target subscribers >30 days for re-engagement

**Combining Rules:**
- All rules must match (AND logic)
- Example: "Chrome + Windows + USA + <7 days" = New US Chrome/Windows users
- More rules = smaller, more targeted audience
          `
        },
        {
          id: 'creating-segments',
          title: 'Creating & Using Segments',
          content: `
**Creating a Segment:**

1. Go to Segments page
2. Click to expand the create form
3. Name your segment descriptively
4. Set your targeting rules:
   - Browser (optional)
   - OS (optional)
   - Country (optional)
   - Days since subscription (optional)
5. See estimated subscriber count
6. Click "Create Segment"

**Naming Best Practices:**
- Be descriptive: "Chrome Users - USA"
- Include key criteria: "New Subscribers (<7 days)"
- Use consistent naming: "Mobile - iOS" / "Mobile - Android"
- Avoid vague names: "Test" or "Segment 1"

**Using Segments in Notifications:**
1. Create or edit a notification
2. In the "Target Segment" dropdown, select your segment
3. Only matching subscribers will receive it
4. Send or schedule as normal

**Using Segments in RSS Feeds:**
- Configure RSS feed to target specific segment
- Auto-generated notifications only go to that segment
- Perfect for topic-specific content

**Segment Ideas:**

**E-commerce:**
- "New Subscribers" - Welcome offers
- "Mobile Users" - App promotion
- "US Customers" - US-only sales
- "Returning Visitors" - Loyalty rewards

**Content Sites:**
- "Chrome Users" - Extension announcements
- "Mobile Readers" - Mobile-optimized content
- "Tech Enthusiasts" - Technical deep-dives
- "New Readers" - Getting started guides

**B2B:**
- "Enterprise" - Based on company size indicators
- "Different Timezones" - Send time optimization
- "Platform-Specific" - OS/browser-specific content

**Testing Segments:**
1. Create a test segment (e.g., "Chrome + Your Country")
2. Ensure you match the criteria
3. Send a test notification
4. Verify you receive it
5. Adjust criteria as needed
          `
        },
        {
          id: 'segment-strategy',
          title: 'Segment Strategy & Optimization',
          content: `
**Segmentation Strategy:**

**Start Simple**
- Begin with 2-3 broad segments
- Add complexity as you learn
- Don't over-segment initially
- Example starters:
  - "Mobile Users"
  - "Desktop Users"
  - "New Subscribers"

**Grow Strategically**
- Add segments based on performance data
- Create segments for A/B testing
- Segment by engagement level
- Seasonal or campaign-specific segments

**Advanced Segmentation:**
- Combine multiple criteria
- Create micro-segments for testing
- Behavioral segments (coming soon)
- Time-based segments for re-engagement

**Optimization Tips:**

**1. Monitor Performance**
- Compare segment CTR
- Track conversion by segment
- Identify best-performing segments
- Focus efforts on high-value segments

**2. A/B Testing with Segments**
- Create two similar segments
- Send different messages to each
- Compare performance
- Scale the winner

**3. Seasonal Segments**
- Create for holidays or events
- Example: "Holiday Shoppers"
- Activate/deactivate as needed
- Reuse year over year

**4. Re-engagement Segments**
- Target inactive subscribers (30+ days)
- "We miss you" campaign
- Special offers for lapsed users
- Win-back strategies

**Common Mistakes:**

❌ Too many tiny segments (under 100 subscribers)
❌ Overlapping segments causing confusion
❌ Generic names you forget
❌ Not updating segments over time
❌ Creating but never using segments

✅ Start broad, refine over time
✅ Clear, distinct segments
✅ Descriptive naming conventions
✅ Regular performance reviews
✅ Actually use your segments!

**Segment Analytics (Coming Soon):**
- Performance by segment
- Growth rates per segment
- Value generated per segment
- Engagement scoring
          `
        }
      ]
    },
    {
      id: 'rss-feeds',
      title: 'RSS Feeds',
      icon: '📡',
      articles: [
        {
          id: 'rss-overview',
          title: 'What are RSS Feed Notifications?',
          content: `
RSS Feed Notifications automatically monitor your RSS/Atom feeds and send push notifications when new content is published.

**How It Works:**
1. Add your blog/podcast/news feed URL
2. System checks for new items every 15 minutes
3. When new content is detected, a notification is created
4. Sent automatically to all subscribers (or a specific segment)
5. Tracks what's been sent to avoid duplicates

**Perfect For:**
- **Bloggers:** Auto-notify readers of new posts
- **News Sites:** Instant breaking news alerts
- **E-commerce:** New product announcements
- **Podcasters:** New episode alerts
- **Content Creators:** YouTube, Medium, or any RSS feed

**Benefits:**
- Set it and forget it - fully automated
- Never miss notifying subscribers of new content
- Consistent engagement without manual work
- Works with any standard RSS or Atom feed

**Supported Platforms:**
Any platform with an RSS/Atom feed:
- WordPress blogs (yoursite.com/feed)
- Medium (medium.com/feed/@username)
- YouTube channels (use channel RSS URL)
- Shopify stores (yourstore.com/blogs/news.atom)
- Podcasts (any podcast RSS URL)
- Custom feeds from your CMS
          `
        },
        {
          id: 'rss-setup',
          title: 'Setting Up RSS Feeds',
          content: `
**Step 1: Find Your RSS Feed URL**

**WordPress:**
- Usually: yoursite.com/feed or yoursite.com/feed/
- Category feed: yoursite.com/category/news/feed

**Medium:**
- User feed: medium.com/feed/@username
- Publication: medium.com/feed/publication-name

**YouTube:**
- Channel: youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID
- Find channel ID in YouTube Studio

**Shopify Blog:**
- yourstore.com/blogs/news.atom

**Custom/Other:**
- Look for RSS icon on website
- Check website source for <link rel="alternate" type="application/rss+xml">
- Use RSS feed finder tools

**Step 2: Configure in Dashboard**

1. Go to RSS Feeds page
2. Click to expand create form
3. Fill in details:
   - **Feed Name:** Descriptive name (e.g., "Main Blog Feed")
   - **RSS Feed URL:** Complete feed URL
   - **Feed Icon:** URL to icon image (optional)
   - **Active:** Check to start monitoring
   - **Create Draft:** Check to review before sending
   - **Show Action Buttons:** Add custom action buttons
   - **Max Pushes Per Day:** Limit sends (prevent spam)

**Step 3: UTM Parameters (Optional)**
Track performance in Google Analytics:
- utm_source: "push" or "notifications"
- utm_medium: "push"
- utm_campaign: "rss-feed" or specific feed name

**Step 4: Targeting**
- All subscribers: Reach everyone
- Specific segment: Target relevant audience
- Example: Tech blog → "Tech Enthusiasts" segment

**Step 5: Save & Activate**
- Click "Create Feed"
- System starts monitoring within 15 minutes
- First notification sent when new item detected
          `
        },
        {
          id: 'rss-best-practices',
          title: 'RSS Feed Best Practices',
          content: `
**Optimization Tips:**

**1. Use Drafts for Quality Control**
- Enable "Create Draft" option
- Review auto-generated notifications
- Edit title/message before sending
- Perfect for infrequent feeds

**2. Set Reasonable Limits**
- Max 2-3 pushes per day
- Prevents spam if feed has multiple updates
- Oldest items sent first
- Remaining queued for next day

**3. Target the Right Audience**
- Don't send all content to all subscribers
- Create segments by interest
- Multiple feeds → multiple segments
- Example: "Tech News" feed → "Tech" segment

**4. Customize Your Icons**
- Use your logo or category-specific icons
- Consistent branding
- Increases recognition
- 192x192px recommended

**5. Optimize UTM Parameters**
- Track which feeds drive traffic
- Measure ROI per feed
- Use in Google Analytics
- Refine strategy based on data

**Content Strategy:**

**High-Frequency Feeds (Multiple daily posts)**
- Set max pushes per day: 2-3
- Use segments to avoid fatigue
- Consider digest format instead
- Monitor unsubscribe rates

**Low-Frequency Feeds (Weekly or less)**
- No daily limit needed
- Send to all subscribers
- Don't use draft mode (auto-send)
- Maximize reach

**Multiple Feeds:**
- Use different segments per feed
- Example: "Blog" + "Podcast" + "Products"
- Different icons per feed
- Track performance separately

**Feed Management:**

**Monitoring Performance:**
- Check Last Fetched timestamp
- Verify Last Item GUID updates
- Monitor engagement (CTR)
- Adjust max daily sends based on data

**Pausing Feeds:**
- Click "Pause" to temporarily stop
- Useful during holidays or maintenance
- Resume anytime with "Activate"
- No data lost during pause

**Troubleshooting:**

**Feed Not Updating:**
- Verify RSS URL is accessible
- Check feed has new items
- Last Item GUID should change with new content
- System checks every 15 minutes

**Too Many Notifications:**
- Lower "Max Pushes Per Day"
- Use draft mode for approval
- Create more specific segments

**Low Engagement:**
- Improve feed content quality
- Better targeting with segments
- Optimize send times
- A/B test notification formats
          `
        }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      articles: [
        {
          id: 'general-settings',
          title: 'General Settings',
          content: `
Configure your site's basic information and notification preferences.

**Site Information:**

**Site Name**
- Your website or brand name
- Shown in dashboard header
- Used in some notification contexts

**Website URL**
- Your full website URL with https://
- Used to validate notification origins
- Required for VAPID configuration

**Notification Icon**
- Default icon for all notifications
- Shown if individual notification doesn't have icon
- Recommended: 192x192px, square image
- Your logo or brand mark works well

**Primary Language**
- Language of your notification content
- 24+ languages supported
- Affects browser rendering and permissions
- Match your website's language

**Timezone**
- Used for scheduling notifications
- All scheduled times use this timezone
- Affects recurring notification timing
- Choose your business location timezone

**Value Goals:**

Track the monetary value generated by push notifications.

**Value Currency**
- USD, EUR, GBP, etc.
- Used in dashboard metrics
- Displays "Value Generated" stat

**Value Per New Subscriber**
- Estimated lifetime value of a subscriber
- Used to calculate subscriber acquisition ROI
- Industry average: $1-5 for e-commerce

**Value Per Click**
- Average value when user clicks notification
- Based on conversion rates and AOV
- Example: 5% conversion × $50 AOV = $2.50/click

**Formula:**
Total Value = (New Subscribers × Value Per Sub) + (Clicks × Value Per Click)

**Setting Realistic Values:**
1. Calculate average order value (AOV)
2. Estimate conversion rate from push clicks
3. Value per click = AOV × conversion rate
4. Track over time and adjust

**Example for E-commerce:**
- AOV: $50
- Push click conversion rate: 3%
- Value per click: $50 × 0.03 = $1.50
- Subscriber LTV: $10 (based on historical data)
          `
        },
        {
          id: 'installation',
          title: 'Installation Instructions',
          content: `
The installation code enables push notifications on your website.

**What the Code Does:**
1. Registers a service worker in the browser
2. Requests notification permission from visitors
3. Subscribes users to your push notifications
4. Sends subscription data to your dashboard

**Installation Steps:**

**Step 1: Copy the Code**
- Go to Settings → Installation tab
- Click "Show Installation Code"
- Copy the entire code snippet

**Step 2: Add to Your Website**
- Paste before closing </body> tag
- On every page where you want the prompt
- Or use via Google Tag Manager

**Step 3: Upload Service Worker**
- Download service-worker.js file (link in settings)
- Upload to your website root directory
- Must be accessible at: yoursite.com/service-worker.js

**Step 4: Deploy & Test**
- Deploy your updated website
- Visit your site in incognito/private mode
- You should see notification permission prompt
- Click "Allow" to subscribe
- Check Subscribers page to see yourself

**Important Requirements:**

✅ **HTTPS Required**
- Push notifications only work on HTTPS sites
- localhost works for testing
- Get free SSL from Let's Encrypt

✅ **Service Worker Location**
- Must be at root domain level
- Can't be in subdirectory
- Controls scope of push functionality

✅ **Browser Support**
- Chrome 42+ ✅
- Firefox 44+ ✅
- Safari 16+ (macOS 13+) ✅
- Edge 17+ ✅
- Opera 29+ ✅

**Installation Methods:**

**Method 1: Direct HTML**
- Paste code in website HTML
- Before </body> tag
- Simplest method

**Method 2: Google Tag Manager**
- Create Custom HTML tag
- Paste installation code
- Set trigger: All Pages
- Publish container

**Method 3: WordPress Plugin**
- Install "Insert Headers and Footers" plugin
- Paste code in footer section
- Save settings

**Troubleshooting:**

**Permission Prompt Not Showing:**
- Check browser console for errors
- Verify HTTPS is enabled
- Clear browser cache
- Service worker must be accessible
- Check browser blocks push notifications

**Subscribers Not Appearing:**
- Verify API endpoint is reachable
- Check browser console for 400/500 errors
- Confirm site ID in code matches dashboard
- Check firewall/CORS settings

**Testing:**
- Use incognito/private mode for fresh test
- Try different browsers
- Check multiple devices
- Verify subscription in dashboard
          `
        },
        {
          id: 'vapid-keys',
          title: 'VAPID Keys Explained',
          content: `
VAPID (Voluntary Application Server Identification) keys enable secure push notification delivery.

**What are VAPID Keys?**

VAPID keys are cryptographic key pairs used to identify your server when sending push notifications.

**Public Key:**
- Shared with browsers and subscribers
- Included in installation code
- Safe to expose publicly
- Used by browsers to create subscriptions

**Private Key:**
- Kept secret on server
- Never shared or exposed
- Used to sign push messages
- Proves notifications are from you

**How They Work:**

1. **Subscription:**
   - Browser uses public key to subscribe
   - Creates unique endpoint for each user
   - Stores subscription in our database

2. **Sending:**
   - Server signs notification with private key
   - Browser validates using public key
   - Ensures message is from legitimate source
   - Prevents spoofing/tampering

**Automatic Generation:**
- Created automatically when you create a site
- Unique pair for each site
- Stored securely in database
- No manual configuration needed

**Security Notes:**

✅ **Public Key - Safe to Share:**
- Visible in installation code
- Exposed to all website visitors
- Cannot be used to send notifications
- Harmless if leaked

🔒 **Private Key - Keep Secret:**
- Never exposed to browsers
- Shown as ••• in dashboard
- Only used server-side
- Treat like a password

**If Private Key is Compromised:**
1. Contact support to regenerate keys
2. All subscribers must re-subscribe
3. Update installation code
4. Monitor for unauthorized sends

**VAPID Contact Email:**
- Set on server: mailto:admin@example.com
- Browser vendors may use for issues
- Change in production configuration
- Include in VAPID setup

**Best Practices:**
- Never share private key
- Don't commit keys to version control
- Use environment variables in production
- Encrypt at rest (recommended)
- Regular security audits
- Monitor for unauthorized access

**Key Rotation:**
- Not currently supported
- Would require all users to re-subscribe
- Contact support if needed
- Plan for service interruption
          `
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      articles: [
        {
          id: 'common-issues',
          title: 'Common Issues & Solutions',
          content: `
**Permission Prompt Issues:**

**Problem: Permission prompt doesn't appear**
✅ Solutions:
- Ensure site uses HTTPS
- Check browser hasn't blocked notifications (site settings)
- Verify service worker is loaded (DevTools → Application → Service Workers)
- Clear browser cache and cookies
- Try incognito/private mode

**Problem: Permission prompt shows but can't click**
✅ Solutions:
- Check for JavaScript errors in console
- Disable browser extensions temporarily
- Verify no CSS z-index conflicts
- Test in different browser

**Subscriber Issues:**

**Problem: Subscribers not appearing in dashboard**
✅ Solutions:
- Verify installation code has correct site ID
- Check API endpoint is reachable
- Look for network errors in browser console
- Confirm database is accepting connections
- Check firewall rules

**Problem: Subscribers marked as "Inactive"**
✅ Reasons:
- User revoked notification permissions
- User uninstalled browser
- Subscription endpoint expired
- Browser profile deleted
- User on different device

**Delivery Issues:**

**Problem: Notifications not delivering**
✅ Solutions:
- Check notification status (Draft/Scheduled/Sending)
- Verify subscribers are "Active"
- Look for backend errors in logs
- Test with small segment first
- Check service worker is registered

**Problem: Low delivery rate (<80%)**
✅ Solutions:
- Clean inactive subscribers
- Check endpoint expiration
- Verify VAPID keys are correct
- Test notification on multiple browsers
- Review browser-specific limitations

**Engagement Issues:**

**Problem: Low click rate (<2%)**
✅ Solutions:
- Improve notification copy (title/message)
- Add compelling images
- Better targeting with segments
- Optimize send timing
- Test different content types
- Don't send too frequently

**Problem: High unsubscribe rate**
✅ Solutions:
- Reduce send frequency
- Improve content relevance
- Better segmentation
- Set clear expectations upfront
- Provide value in every notification

**Technical Issues:**

**Problem: 500 Internal Server Error**
✅ Solutions:
- Check server logs
- Verify database connection
- Restart backend service
- Check for VAPID key issues
- Contact support if persists

**Problem: CORS errors in browser**
✅ Solutions:
- Verify API URL in frontend config
- Check backend CORS settings
- Ensure credentials included in requests
- Verify domain is whitelisted

**Problem: Service worker won't register**
✅ Solutions:
- Must be served over HTTPS (or localhost)
- Check file path is /service-worker.js
- Verify MIME type is application/javascript
- Clear service worker cache
- Check scope is correct

**Problem: Notifications look broken**
✅ Solutions:
- Image URLs must use HTTPS
- Images must be accessible (not 404)
- Check image dimensions (too large/small)
- Test in multiple browsers
- Verify JSON payload structure

**Still Stuck?**
- Check browser console for errors
- Review server logs
- Test in incognito mode
- Try different browser/device
- Check system status
- Contact support with error details
          `
        },
        {
          id: 'browser-differences',
          title: 'Browser-Specific Behavior',
          content: `
Different browsers handle push notifications slightly differently.

**Chrome (Desktop & Mobile)**
✅ Best Support:
- All features supported
- Action buttons work
- Images display properly
- Reliable delivery
- Notification center

⚠️ Limitations:
- Users can disable per-site
- Quiet permissions UI (if user ignores prompts)
- Background sync required

**Firefox (Desktop & Mobile)**
✅ Good Support:
- Core features work well
- Image support
- Reliable delivery

⚠️ Limitations:
- Action buttons not supported on all versions
- Different notification UI on mobile
- Permission prompt works differently

**Safari (macOS & iOS)**
✅ Growing Support:
- Supported on macOS 13+ (Safari 16+)
- iOS 16.4+ support (limited)
- Basic features work

⚠️ Limitations:
- More restrictive permission UI
- No action buttons
- iOS requires web app added to home screen
- Smaller image size limits
- Must be really careful with permission prompt timing

**Edge (Desktop)**
✅ Excellent Support:
- Chromium-based (same as Chrome)
- Full feature parity
- Notification center integration

⚠️ Limitations:
- Same as Chrome

**Best Practices for Cross-Browser:**

1. **Test on all major browsers**
   - Chrome (primary)
   - Firefox (important secondary)
   - Safari (if targeting Mac users)
   - Mobile browsers

2. **Design for lowest common denominator**
   - Don't rely on action buttons
   - Use standard notification format
   - Keep images optimized
   - Test without images

3. **Feature detection**
   - Check for push support before prompting
   - Graceful degradation
   - Alternative call-to-actions

4. **Permission prompt strategy**
   - Different browsers have different UIs
   - Safari is more restrictive
   - Use soft-ask technique
   - Clear value proposition

**Browser Market Share Considerations:**
- Chrome: ~65% (prioritize testing here)
- Safari: ~20% (important for iOS users)
- Edge: ~5%
- Firefox: ~3%
- Others: ~7%

**Mobile Considerations:**

**Android:**
- Excellent Chrome support
- Firefox support
- System notification center
- Background delivery

**iOS:**
- Safari support (iOS 16.4+)
- Must add to home screen first
- More restrictive
- Limited background delivery

**Recommended Approach:**
- Build for Chrome first (best support)
- Test on Firefox (catch compatibility issues)
- Test on Safari (if relevant to audience)
- Design works without advanced features
- Progressive enhancement
          `
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: '⭐',
      articles: [
        {
          id: 'notification-dos-donts',
          title: 'Notification Do\'s and Don\'ts',
          content: `
**DO:**

✅ **Provide Clear Value**
- Every notification should benefit the user
- Ask: "Would I want to receive this?"
- Focus on subscriber needs, not just your goals

✅ **Be Specific and Actionable**
- "New: 50% off running shoes today" (specific)
- vs. "Check out our latest deals" (vague)

✅ **Respect User Time**
- Keep messages concise and scannable
- Clear call-to-action
- Don't waste their click

✅ **Test Before Sending**
- Send to yourself first
- Check on multiple devices
- Verify links work
- Review for typos

✅ **Maintain Consistent Schedule**
- Set expectations (e.g., "Daily at 9 AM")
- Stick to your schedule
- Consistency builds trust

✅ **Segment Your Audience**
- Send relevant content to right people
- Don't blast everyone with everything
- Personalize when possible

✅ **Track and Optimize**
- Monitor CTR for each notification
- Learn from best performers
- Iterate and improve
- A/B test regularly

**DON'T:**

❌ **Send Too Frequently**
- More isn't better
- 1-2 per day maximum
- Quality over quantity
- Monitor unsubscribe rates

❌ **Use Clickbait**
- Don't mislead users
- Deliver on your promise
- Builds long-term trust
- Avoid "You won't believe..."

❌ **Send Generic Messages**
- "New blog post" (bad)
- "New: 10 tips to boost productivity" (good)
- Specificity drives clicks

❌ **Ignore Time Zones**
- Don't send at 3 AM user's time
- Use appropriate timing
- Consider global audience
- Schedule thoughtfully

❌ **Forget Mobile Users**
- Most notifications viewed on mobile
- Test on small screens
- Keep URLs mobile-friendly
- Optimize landing pages

❌ **Neglect Your Subscribers**
- Silent for weeks then spam
- Inconsistent sends hurt engagement
- Communicate regularly
- Maintain relationship

❌ **Skip the Value Proposition**
- Explain why they should subscribe
- Set clear expectations
- Don't trick users into subscribing
- Transparency builds trust

**Permission Prompt Best Practices:**

✅ **DO:**
- Wait for user engagement (30 seconds+ on page)
- Show value proposition first
- Use soft-ask before browser prompt
- Make it easy to say yes

❌ **DON'T:**
- Show prompt immediately on page load
- Use dark patterns
- Hide the deny option
- Ask repeatedly if denied

**Content Guidelines:**

**For E-commerce:**
✅ Flash sales, exclusive deals, back-in-stock, price drops, order updates
❌ Every new product, constant reminders, pure promotion

**For Content/Blogs:**
✅ New articles, breaking news, important updates, weekly digests
❌ Every minor update, old content, filler content

**For SaaS/Tools:**
✅ New features, important updates, account activity, security alerts
❌ Every minor change, pure promotional, constant upsells
          `
        },
        {
          id: 'optimization-tips',
          title: 'Performance Optimization Tips',
          content: `
**Improve Click-Through Rate (CTR):**

**1. Compelling Titles**
- Use numbers: "5 Ways to..." (vs. "Ways to...")
- Create urgency: "Today Only" (vs. "Limited Time")
- Ask questions: "Ready to save 50%?"
- Use power words: "Free," "New," "Exclusive," "Save"
- Be specific: "50% Off Nike Shoes" (vs. "Big Sale")

**2. Engaging Messages**
- Expand on title with key benefit
- Include social proof: "Join 10,000 readers"
- Create FOMO: "Only 5 items left"
- Clear value: "Learn to 10x your traffic"

**3. Visual Elements**
- Always include icon (increases CTR 20%+)
- Use large images when relevant (40%+ boost)
- High-quality, relevant images
- Consistent branding

**4. Timing Optimization**
- Check Dashboard → Weekly Engagement chart
- Test different send times
- Consider user timezone
- Industry benchmarks:
  - E-commerce: 8-10 AM, 7-9 PM
  - News: 6-8 AM, 12-1 PM, 6-8 PM
  - B2B: 10 AM - 2 PM weekdays

**5. Audience Targeting**
- Use segments for relevance
- Personalize by attributes
- Exclude recently engaged users
- Test different segments

**Improve Delivery Rate:**

**1. Clean Your List**
- Remove inactive subscribers (90+ days)
- Monitor and remove bounced endpoints
- Regular list hygiene (monthly)

**2. Maintain Subscriber Quality**
- Clear value proposition
- Don't trick users into subscribing
- Set proper expectations
- Make unsubscribe easy

**3. Technical Optimization**
- Keep VAPID keys secure
- Monitor server logs for errors
- Ensure endpoints are valid
- Test notifications regularly

**Reduce Unsubscribe Rate:**

**1. Frequency Management**
- Don't oversend (1-2 per day max)
- Consistent schedule
- Respect user preferences
- Offer frequency options (future feature)

**2. Content Quality**
- Every notification must provide value
- Relevant to subscriber
- High-quality content
- Meet expectations set

**3. Segmentation**
- Send relevant content only
- Don't spam entire list
- Targeted campaigns
- Personalized content

**Increase Subscriber Growth:**

**1. Permission Prompt Optimization**
- Show value before asking
- Soft-ask technique
- Clear benefits
- Right timing (after engagement)

**2. Incentives**
- Exclusive content for subscribers
- Discount on first order
- Early access to sales
- Special subscriber-only benefits

**3. Promotion**
- Call-out on high-traffic pages
- Social media promotion
- Email signature
- Content upgrades

**A/B Testing:**

**Test Variables:**
- Title variations
- Message copy
- Send time
- Day of week
- With/without images
- Different segments
- Landing pages

**Testing Process:**
1. Create two similar segments (50/50 split)
2. Change ONE variable only
3. Send to both segments
4. Wait 24 hours for results
5. Analyze CTR difference
6. Use winner for future sends

**Benchmark Performance:**

**Click-Through Rate:**
- Excellent: 15%+
- Good: 10-15%
- Average: 5-10%
- Poor: <5%

**Delivery Rate:**
- Excellent: 95%+
- Good: 90-95%
- Average: 85-90%
- Poor: <85%

**Unsubscribe Rate (per send):**
- Excellent: <0.5%
- Good: 0.5-1%
- Average: 1-2%
- Poor: >2%

**Track Your Progress:**
- Set baseline metrics (week 1)
- Implement optimizations
- Measure weekly changes
- Document what works
- Iterate continuously
          `
        }
      ]
    }
  ]
};

// Quick reference tooltips for UI elements
export const tooltips = {
  dashboard: {
    totalSubscribers: 'Total number of users who have opted in to receive push notifications. Only active subscribers can receive notifications.',
    notificationsSent: 'Total count of all notifications sent across all campaigns, one-time, and recurring notifications.',
    clickRate: 'Percentage of delivered notifications that were clicked. Industry average is 5-15%.',
    valueGenerated: 'Calculated based on your configured values in Settings. Formula: (new subscribers × value per subscriber) + (clicks × value per click)',
    trendIndicator: 'Shows percentage change compared to previous period. Green = growth, Red = decline.',
    notificationChart: 'Shows notification performance over the last 7 days. Blue = sent, Green = delivered, Purple = clicked.',
    engagementChart: 'Weekly engagement by day of week. Use this data to optimize when you send notifications.',
  },
  notifications: {
    oneTime: 'Send immediately or schedule for a specific date and time. Perfect for announcements and promotions.',
    recurring: 'Automatically repeat on a schedule (daily, weekly, or monthly). Great for content digests.',
    triggered: 'Event-based notifications. Currently used for Welcome Campaigns.',
    targetSegment: 'Choose which group of subscribers will receive this notification. Select "All Subscribers" or a specific segment.',
    title: 'Maximum 50 characters. Make it action-oriented and specific. This is the first thing users see.',
    message: 'Maximum 150 characters. Expand on your title with key details that create curiosity or urgency.',
    destinationUrl: 'The URL users will visit when they click. Must start with https://',
    iconUrl: 'Small square image shown with notification. Recommended size: 192x192px. Defaults to site icon if not set.',
    largeImage: 'Optional banner image shown with notification. Recommended size: 1200x628px. Increases engagement by 20-40%.',
    actionButtons: 'Add up to 2 custom action buttons (e.g., "Shop Now", "Learn More"). Not supported in all browsers.',
    scheduledAt: 'Set a specific date and time to send. Uses your site\'s configured timezone from Settings.',
  },
  campaigns: {
    campaignName: 'Descriptive name for this welcome sequence (e.g., "New Subscriber Onboarding").',
    isActive: 'When active, this campaign automatically runs for all new subscribers. Only one campaign can be active at a time.',
    sequence: 'The order of notifications in your campaign. Step 1 sends immediately, subsequent steps send after delays.',
    delay: 'Time to wait after the previous step before sending this notification. Use for spacing out your sequence.',
    delayUnits: 'Choose minutes, hours, or days based on your campaign strategy.',
  },
  subscribers: {
    browser: 'The web browser used when the user subscribed (Chrome, Firefox, Safari, Edge).',
    os: 'Operating system of the subscriber\'s device (Windows, macOS, Linux, Android, iOS).',
    country: 'Detected from IP address at time of subscription. Used for geographic targeting.',
    subscribedAt: 'Date and time when the user opted in to notifications.',
    lastSeen: 'Last time this subscriber was active. Used to identify inactive users.',
    isActive: 'Active subscribers can receive notifications. Inactive means browser uninstalled, permissions revoked, or endpoint expired.',
    remove: 'Removes this subscriber. They won\'t receive future notifications but can re-subscribe by visiting your site.',
  },
  segments: {
    segmentName: 'Descriptive name for this group (e.g., "Chrome Users - USA" or "New Subscribers").',
    browser: 'Target users by their web browser. Leave as "Any" to include all browsers.',
    os: 'Target users by operating system. Useful for OS-specific content or downloads.',
    country: 'Target users by country. Great for regional promotions or language-specific content.',
    subscribedDaysAgo: 'Target based on how long ago they subscribed. Useful for new vs. long-term subscribers.',
    estimatedCount: 'Approximate number of current subscribers matching these rules. Updates when you create/edit.',
  },
  rssFeeds: {
    feedName: 'Descriptive name for this feed (e.g., "Main Blog Feed" or "Product Updates").',
    feedUrl: 'Complete URL to your RSS or Atom feed. System checks this URL every 15 minutes for new items.',
    feedIcon: 'Icon shown with auto-generated notifications. Defaults to site icon if not set.',
    isActive: 'When active, feed is monitored every 15 minutes. Pause to temporarily stop monitoring.',
    createDraft: 'If enabled, notifications are created as drafts for review before sending. Disable for automatic sending.',
    showActionButtons: 'Add default action buttons to auto-generated notifications.',
    maxPushesPerDay: 'Limit notifications from this feed per day. Prevents spam if feed updates frequently.',
    utmParams: 'Add tracking parameters to destination URLs for Google Analytics tracking.',
    targetSegment: 'Send auto-generated notifications to all subscribers or a specific segment.',
    lastFetched: 'Last time the system checked this feed for new content.',
    lastItemGuid: 'Unique ID of the last processed item. Used to prevent duplicate notifications.',
  },
  settings: {
    siteName: 'Your website or brand name. Shown in the dashboard header.',
    websiteUrl: 'Your complete website URL with https://. Used for VAPID configuration.',
    notificationIcon: 'Default icon for all notifications. Shown if individual notification doesn\'t have a custom icon. Recommended: 192x192px square image.',
    primaryLanguage: 'Language of your notification content. Affects browser rendering and permission prompts.',
    timezone: 'All scheduled times use this timezone. Choose your business location or target audience timezone.',
    valueCurrency: 'Currency for value tracking. Used in dashboard "Value Generated" metric.',
    valuePerSubscriber: 'Estimated lifetime value of each subscriber. Used to calculate ROI.',
    valuePerClick: 'Average value when a user clicks a notification. Based on your conversion rate and average order value.',
    publicKey: 'VAPID public key for browser subscriptions. Safe to share publicly. Included in installation code.',
    privateKey: 'VAPID private key for signing notifications. Keep this secret! Only used server-side.',
  },
};

// Search function for help content
export const searchHelpContent = (query) => {
  const results = [];
  const lowerQuery = query.toLowerCase();

  helpContent.categories.forEach(category => {
    category.articles.forEach(article => {
      const titleMatch = article.title.toLowerCase().includes(lowerQuery);
      const contentMatch = article.content.toLowerCase().includes(lowerQuery);

      if (titleMatch || contentMatch) {
        results.push({
          category: category.title,
          categoryIcon: category.icon,
          ...article
        });
      }
    });
  });

  return results;
};
