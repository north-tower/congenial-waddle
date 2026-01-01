# Analytics & Usage Tracking

This application includes a comprehensive analytics system to track how users interact with the platform.

## Features

The analytics system tracks:

- **Page Views**: Automatic tracking of all page navigation
- **User Actions**: Registration, login, logout
- **Comparison Events**: Start, completion, exports
- **Retailer Interactions**: Searches, selections, views
- **Country Selections**: When users select countries for comparison
- **History Views**: When users view their comparison history
- **Guide Views**: When users access the guide page
- **Error Tracking**: Automatic error logging

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Enable/disable analytics (default: true)
VITE_ANALYTICS_ENABLED=true

# Google Analytics 4 Measurement ID (optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend analytics endpoint (optional)
VITE_ANALYTICS_ENDPOINT=/api/analytics
```

### Google Analytics Setup

1. Create a Google Analytics 4 property
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add it to your `.env` file as `VITE_GA_MEASUREMENT_ID`
4. The analytics will automatically initialize on app load

### Backend Analytics Endpoint (Optional)

If you want to store analytics data in your own database, create an endpoint that accepts POST requests with this format:

```typescript
{
  event: string;           // Event type (e.g., 'page_view', 'comparison_complete')
  properties?: object;     // Additional event data
  userId?: string;         // User ID if authenticated
  timestamp: string;       // ISO timestamp
}
```

Example endpoint implementation (Node.js/Express):

```javascript
app.post('/api/analytics', authenticate, async (req, res) => {
  const { event, properties, userId, timestamp } = req.body;
  
  // Store in your database
  await analyticsModel.create({
    event,
    properties,
    userId: userId || req.user?.id,
    timestamp: new Date(timestamp),
  });
  
  res.json({ success: true });
});
```

## Usage

### Automatic Tracking

Most tracking happens automatically:
- Page views are tracked on every route change
- User authentication events are tracked automatically
- Component interactions are tracked where implemented

### Manual Tracking

You can manually track custom events:

```typescript
import { analytics } from '../utils/analytics';

// Track a custom event
analytics.trackEvent('custom_event', {
  custom_property: 'value',
});

// Or use convenience methods
analytics.trackFeatureClick('export_button', 'comparison_page');
analytics.trackError(error, 'payment_processing');
```

## Tracked Events

### User Events
- `user_register` - When a user registers
- `user_login` - When a user logs in
- `user_logout` - When a user logs out

### Comparison Events
- `comparison_start` - When user starts selecting retailers
- `comparison_complete` - When comparison is submitted and results shown
- `comparison_export` - When user exports results
- `export_pdf` - When PDF export is triggered
- `export_excel` - When Excel export is triggered

### Retailer Events
- `retailer_search` - When user searches for retailers
- `retailer_select` - When user selects a retailer
- `retailer_view` - When user views a retailer detail page

### Navigation Events
- `page_view` - Automatic on every route change
- `history_view` - When user views comparison history
- `history_item_view` - When user views a specific history item
- `guide_view` - When user views the guide page
- `country_select` - When user selects a country

### Error Events
- `error_occurred` - When errors happen (with context)

## Viewing Analytics

### Google Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Navigate to Reports > Engagement > Events
4. View all tracked events and their properties

### Backend Analytics

Query your database to analyze user behavior:

```sql
-- Most popular events
SELECT event, COUNT(*) as count
FROM analytics_events
GROUP BY event
ORDER BY count DESC;

-- Comparison completion rate
SELECT 
  COUNT(CASE WHEN event = 'comparison_complete' THEN 1 END) as completed,
  COUNT(CASE WHEN event = 'comparison_start' THEN 1 END) as started,
  (COUNT(CASE WHEN event = 'comparison_complete' THEN 1 END)::float / 
   COUNT(CASE WHEN event = 'comparison_start' THEN 1 END)::float * 100) as completion_rate
FROM analytics_events;

-- User activity by day
SELECT 
  DATE(timestamp) as date,
  COUNT(DISTINCT userId) as active_users,
  COUNT(*) as total_events
FROM analytics_events
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## Privacy & Compliance

- Analytics respects user privacy
- No personally identifiable information (PII) is tracked by default
- User IDs are only tracked if the user is authenticated
- All tracking can be disabled via `VITE_ANALYTICS_ENABLED=false`

## Debugging

In development mode, analytics events are logged to the console:

```
[Analytics] comparison_start { retailer_count: 3 }
[Analytics] comparison_complete { retailerCount: 3, country: 'United States', resultCount: 12 }
```

To see these logs, ensure you're running in development mode (`npm run dev`).

## Disabling Analytics

To completely disable analytics:

1. Set `VITE_ANALYTICS_ENABLED=false` in your `.env` file
2. Or remove the analytics initialization from `main.tsx`

