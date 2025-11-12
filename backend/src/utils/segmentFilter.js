/**
 * Segment Filtering Utility
 * Evaluates subscriber data against segment rules
 */

/**
 * Evaluate a single rule against subscriber data
 * @param {Object} subscriber - Subscriber object
 * @param {Object} rule - Rule to evaluate
 * @returns {boolean} Whether subscriber matches the rule
 */
const evaluateRule = (subscriber, rule) => {
  const { field, operator, value } = rule;

  // Get the field value from subscriber
  let fieldValue;
  if (field.startsWith('tags.')) {
    const tagKey = field.substring(5);
    fieldValue = subscriber.tags?.[tagKey];
  } else if (field.startsWith('metadata.')) {
    const metadataKey = field.substring(9);
    fieldValue = subscriber.metadata?.[metadataKey];
  } else {
    fieldValue = subscriber[field];
  }

  // Evaluate based on operator
  switch (operator) {
    case 'equals':
      return fieldValue === value;

    case 'not_equals':
      return fieldValue !== value;

    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(value);

    case 'not_contains':
      return typeof fieldValue === 'string' && !fieldValue.includes(value);

    case 'starts_with':
      return typeof fieldValue === 'string' && fieldValue.startsWith(value);

    case 'ends_with':
      return typeof fieldValue === 'string' && fieldValue.endsWith(value);

    case 'greater_than':
      return Number(fieldValue) > Number(value);

    case 'less_than':
      return Number(fieldValue) < Number(value);

    case 'greater_than_or_equal':
      return Number(fieldValue) >= Number(value);

    case 'less_than_or_equal':
      return Number(fieldValue) <= Number(value);

    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);

    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);

    case 'is_null':
      return fieldValue === null || fieldValue === undefined;

    case 'is_not_null':
      return fieldValue !== null && fieldValue !== undefined;

    case 'exists':
      return fieldValue !== undefined;

    case 'not_exists':
      return fieldValue === undefined;

    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
};

/**
 * Evaluate segment rules against a subscriber
 * @param {Object} subscriber - Subscriber object
 * @param {Object} segmentRules - Segment rules object
 * @returns {boolean} Whether subscriber matches the segment
 */
export const matchesSegment = (subscriber, segmentRules) => {
  if (!segmentRules || !segmentRules.conditions) {
    return true; // No rules means all subscribers match
  }

  const { conditions, operator = 'AND' } = segmentRules;

  if (!Array.isArray(conditions) || conditions.length === 0) {
    return true; // No conditions means all subscribers match
  }

  // Evaluate all conditions
  const results = conditions.map(condition => {
    // Handle nested groups
    if (condition.conditions) {
      return matchesSegment(subscriber, condition);
    }

    // Evaluate single rule
    return evaluateRule(subscriber, condition);
  });

  // Apply operator
  if (operator === 'OR') {
    return results.some(result => result === true);
  } else if (operator === 'AND') {
    return results.every(result => result === true);
  } else if (operator === 'NOT') {
    return !results[0];
  }

  return false;
};

/**
 * Build Prisma where clause from segment rules
 * This is a simplified version - complex rules should be filtered in-memory
 * @param {Object} segmentRules - Segment rules object
 * @returns {Object} Prisma where clause
 */
export const buildSegmentWhereClause = (segmentRules) => {
  if (!segmentRules || !segmentRules.conditions) {
    return {};
  }

  const { conditions, operator = 'AND' } = segmentRules;

  if (!Array.isArray(conditions) || conditions.length === 0) {
    return {};
  }

  // For simple cases, build direct Prisma queries
  // For complex cases, return empty object and filter in-memory

  // Only handle simple single-level AND conditions for now
  if (operator === 'AND' && conditions.every(c => !c.conditions)) {
    const where = {};

    for (const condition of conditions) {
      const { field, operator: op, value } = condition;

      // Only handle simple fields (not nested tags/metadata) for database query
      if (field === 'browser' || field === 'os' || field === 'country') {
        if (op === 'equals') {
          where[field] = value;
        } else if (op === 'in') {
          where[field] = { in: value };
        }
      } else if (field === 'isActive') {
        where.isActive = value;
      }
    }

    return where;
  }

  // For complex rules, return empty (will filter in-memory)
  return {};
};

/**
 * Filter subscribers by segment rules
 * @param {Array} subscribers - Array of subscriber objects
 * @param {Object} segmentRules - Segment rules object
 * @returns {Array} Filtered subscribers
 */
export const filterSubscribersBySegment = (subscribers, segmentRules) => {
  if (!segmentRules) {
    return subscribers;
  }

  return subscribers.filter(subscriber => matchesSegment(subscriber, segmentRules));
};
