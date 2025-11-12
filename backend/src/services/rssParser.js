import Parser from 'rss-parser';
import logger from '../config/logger.js';

const parser = new Parser({
  timeout: 10000, // 10 seconds
  headers: {
    'User-Agent': 'Push-Notification-Platform/1.0',
  },
});

/**
 * Parse RSS/Atom feed from URL
 * @param {string} feedUrl - URL of the RSS feed
 * @returns {Promise<Object>} - Parsed feed object
 */
export const parseFeed = async (feedUrl) => {
  try {
    logger.info(`Fetching RSS feed: ${feedUrl}`);

    const feed = await parser.parseURL(feedUrl);

    // Normalize feed data
    const normalizedFeed = {
      title: feed.title || 'Untitled Feed',
      description: feed.description || '',
      link: feed.link || '',
      items: feed.items.map((item) => ({
        guid: item.guid || item.id || item.link,
        title: item.title || 'Untitled',
        link: item.link || '',
        description: item.contentSnippet || item.content || item.description || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        image: extractImage(item),
        categories: item.categories || [],
      })),
    };

    logger.info(`Successfully parsed RSS feed: ${feedUrl} (${normalizedFeed.items.length} items)`);

    return normalizedFeed;
  } catch (error) {
    logger.error(`Failed to parse RSS feed ${feedUrl}:`, error);
    throw new Error(`Failed to fetch or parse RSS feed: ${error.message}`);
  }
};

/**
 * Extract image from RSS item
 * Checks multiple common fields for images
 * @param {Object} item - RSS feed item
 * @returns {string|null} - Image URL or null
 */
const extractImage = (item) => {
  // Check various possible image fields
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
    return item.enclosure.url;
  }

  if (item['media:content']?.$?.url) {
    return item['media:content'].$.url;
  }

  if (item['media:thumbnail']?.$?.url) {
    return item['media:thumbnail'].$.url;
  }

  if (item.image?.url) {
    return item.image.url;
  }

  if (item.itunes?.image) {
    return item.itunes.image;
  }

  // Try to extract image from content
  if (item.content || item['content:encoded']) {
    const content = item.content || item['content:encoded'];
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  return null;
};

/**
 * Get new items from feed since last check
 * @param {string} feedUrl - URL of the RSS feed
 * @param {string|null} lastItemGuid - GUID of the last item processed
 * @returns {Promise<Array>} - Array of new items
 */
export const getNewItems = async (feedUrl, lastItemGuid) => {
  const feed = await parseFeed(feedUrl);

  if (!lastItemGuid) {
    // First time checking this feed, return only the most recent item
    return feed.items.slice(0, 1);
  }

  // Find the index of the last processed item
  const lastIndex = feed.items.findIndex((item) => item.guid === lastItemGuid);

  if (lastIndex === -1) {
    // Last item not found, return only the most recent item to be safe
    return feed.items.slice(0, 1);
  }

  if (lastIndex === 0) {
    // No new items
    return [];
  }

  // Return all items newer than the last processed one
  return feed.items.slice(0, lastIndex);
};

/**
 * Validate RSS feed URL
 * @param {string} feedUrl - URL to validate
 * @returns {Promise<boolean>} - True if valid, throws error if invalid
 */
export const validateFeed = async (feedUrl) => {
  try {
    await parseFeed(feedUrl);
    return true;
  } catch (error) {
    throw new Error(`Invalid RSS feed: ${error.message}`);
  }
};
