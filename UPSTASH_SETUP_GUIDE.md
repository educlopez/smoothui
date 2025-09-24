# Upstash Redis Setup Guide for SmoothUI

This guide shows you how to set up Upstash Redis for your SmoothUI project instead of Vercel KV.

## 🚀 Why Upstash Redis?

- **Cost-effective**: Often cheaper than Vercel KV
- **Better performance**: Redis is optimized for high-performance caching
- **More features**: Full Redis feature set including pub/sub, streams, etc.
- **Global edge network**: Fast access from anywhere in the world
- **Free tier**: Generous free tier for development and small projects

## 📋 Setup Steps

### 1. Create Upstash Account

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Redis Database

1. Click "Create Database"
2. Choose a name (e.g., `smoothui-analytics`)
3. Select a region close to your users
4. Choose the **Free** plan for development
5. Click "Create"

### 3. Get Credentials

After creating the database, you'll see:

- **REST URL**: `https://your-database-name.upstash.io`
- **REST Token**: A long token string

### 4. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_rest_token_here

# Optional: Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### 5. Install Dependencies

```bash
pnpm install @upstash/redis
```

### 6. Test the Connection

You can test your Redis connection by running:

```bash
pnpm run setup:optimization
```

This will check if your environment variables are properly configured.

## 🔧 Implementation Details

### Redis Client Configuration

The Redis client is configured in `src/lib/kv.ts`:

```typescript
import { Redis } from "@upstash/redis"

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
```

### Data Structure

Your analytics data is stored with these keys:

- `analytics:${pageId}` - Page analytics (views, copies)
- `component:${componentId}` - Component-specific stats
- `global:stats` - Global statistics

### Example Data

```json
// analytics:components/button
{
  "pageViews": 1250,
  "copyCount": 89,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}

// component:button
{
  "views": 1250,
  "copies": 89,
  "likes": 12
}
```

## 🚀 Deployment

### 1. Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
UPSTASH_REDIS_REST_URL = https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN = your_rest_token_here
```

### 2. Deploy

```bash
pnpm run build
vercel deploy --prod
```

## 📊 Monitoring

### Upstash Console

Monitor your Redis usage in the Upstash console:

- **Requests**: Number of API calls
- **Data Transfer**: Amount of data transferred
- **Memory Usage**: Redis memory consumption
- **Commands**: Most used Redis commands

### Vercel Analytics

Your Vercel analytics will show:

- **ISR Reads**: Should be near 0
- **Fast Origin Transfer**: Minimal (only Redis operations)
- **Edge Requests**: Optimized

## 💰 Cost Comparison

### Upstash Redis (Free Tier)

- **10,000 requests/day**
- **256MB storage**
- **Perfect for development and small projects**

### Upstash Redis (Pay-as-you-go)

- **$0.2 per 100K requests**
- **$0.1 per GB storage per month**
- **Much cheaper than Vercel KV for high traffic**

### Vercel KV

- **Limited free tier**
- **More expensive for high usage**
- **Tied to Vercel ecosystem**

## 🔍 Troubleshooting

### Common Issues

1. **Connection Error**

   ```
   Error: Invalid URL
   ```

   - Check your `UPSTASH_REDIS_REST_URL` format
   - Ensure it starts with `https://`

2. **Authentication Error**

   ```
   Error: Unauthorized
   ```

   - Verify your `UPSTASH_REDIS_REST_TOKEN`
   - Check if the token is correctly copied

3. **Rate Limit**
   ```
   Error: Rate limit exceeded
   ```
   - You've exceeded the free tier limits
   - Consider upgrading to a paid plan

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
UPSTASH_REDIS_DEBUG=true
```

## 🎯 Performance Benefits

### Before (ISR)

- **1.1M+ ISR reads**
- **10.76GB+ origin transfer**
- **808K+ edge requests**

### After (Upstash Redis)

- **~0 ISR reads**
- **Minimal origin transfer**
- **Optimized edge requests**
- **Faster response times**
- **Lower costs**

## 🔄 Migration from Vercel KV

If you were previously using Vercel KV, the migration is simple:

1. **Replace dependency**:

   ```bash
   pnpm remove @vercel/kv
   pnpm add @upstash/redis
   ```

2. **Update environment variables**:

   ```env
   # Remove these
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...

   # Add these
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

3. **Code changes**: Already done in the updated files!

## 📚 Additional Resources

- [Upstash Documentation](https://docs.upstash.com/)
- [Redis Commands Reference](https://redis.io/commands/)
- [Upstash Pricing](https://upstash.com/pricing)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎉 Success!

Once set up, your SmoothUI project will:

- ✅ Use Redis for all dynamic data
- ✅ Eliminate ISR usage
- ✅ Reduce Vercel costs significantly
- ✅ Improve performance
- ✅ Scale better under high traffic

Your analytics will be stored in Redis and served via edge functions, giving you the best of both worlds: static performance with dynamic capabilities!
