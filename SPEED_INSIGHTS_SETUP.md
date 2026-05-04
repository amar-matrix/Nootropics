# Vercel Speed Insights Setup

This document describes the Vercel Speed Insights configuration for the gutrootz project.

## What is Vercel Speed Insights?

Vercel Speed Insights is a tool that measures and tracks your website's Core Web Vitals and performance metrics. It provides real-time analytics about how users experience your site's performance.

## Implementation

Since this is a vanilla HTML/JavaScript project (not a React, Next.js, or other framework), the Speed Insights integration uses the standard browser script approach.

### Files Modified

1. **index.html** - Added Speed Insights script tags in the `<head>` section
2. **package.json** - Created to manage the `@vercel/speed-insights` dependency
3. **vercel.json** - Added basic Vercel configuration

### Script Integration

The following scripts were added to `index.html` just before the closing `</head>` tag:

```html
<!-- Vercel Speed Insights -->
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

### How It Works

1. The first script initializes the Speed Insights queue (`window.si` and `window.siq`)
2. The second script loads the Vercel Speed Insights tracking script
3. When deployed to Vercel, the `/_vercel/speed-insights/script.js` path will automatically serve the Speed Insights script
4. The script will track Core Web Vitals (LCP, FID, CLS, TTFB, INP) automatically

## Enabling Speed Insights

To see the metrics:

1. Deploy this project to Vercel
2. Go to your project dashboard on Vercel
3. Navigate to the "Speed Insights" tab
4. Enable Speed Insights for your project (if not already enabled)
5. Performance data will start appearing after real user visits

## Development

In development mode (localhost), the Speed Insights script will load a debug version that provides console logging to help verify it's working correctly.

## Package Management

The project uses `pnpm` as its package manager. To update dependencies:

```bash
pnpm install
pnpm update @vercel/speed-insights
```

## Configuration Options

The current setup uses the default configuration. You can customize the behavior by using the queue API:

```javascript
window.si('beforeSend', (event) => {
  // Modify or filter events before sending
  console.log('Speed Insights event:', event);
  return event;
});
```

## Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Core Web Vitals](https://web.dev/vitals/)
- [@vercel/speed-insights Package](https://www.npmjs.com/package/@vercel/speed-insights)
