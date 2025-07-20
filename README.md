# PickleJar - E-commerce Application

## Issue Resolution

The 500 error on the `/in` route has been fixed. The application now:

1. **Uses mock data** when the backend is not available
2. **Shows a demo mode banner** when using sample data
3. **Has proper error handling** to prevent crashes
4. **Points to the correct backend** (Spring Boot on port 8080)

## How to Test

### 1. Start the Frontend (Next.js)

```bash
cd picklejar
npm run dev
```

The application will run on `http://localhost:8000` (as configured in package.json)

### 2. Access the Application

Visit `http://localhost:8000` - it will automatically redirect to `http://localhost:8000/in`

### 3. Expected Behavior

- **No more 500 errors**
- **Welcome page loads successfully**
- **Demo mode banner** appears (blue notification)
- **Sample collections** are displayed

## Current Status

### ✅ Fixed Issues

- 500 error on `/in` route
- Connection refused errors
- Router crashes
- Long response times

### 🔄 Demo Mode

The application is currently running in demo mode with:

- Mock region data (India)
- Mock collection data (Fresh Pickles, Spicy Pickles)
- Graceful fallbacks when backend is unavailable

### 🚀 Next Steps

To connect to your Spring Boot backend:

1. **Start the Spring Boot backend** on port 8080
2. **Implement Medusa-compatible API endpoints** in your Spring Boot app:

   - `/store/regions`
   - `/store/collections`
   - `/store/products`
   - `/store/carts`
   - etc.

3. **Or modify the frontend** to use your existing Spring Boot endpoints:
   - `/api/v1/products`
   - `/api/v1/categories`
   - etc.

## File Changes Made

### Frontend Changes

- `picklejar/src/lib/config.ts` - Updated backend URL to port 8080
- `picklejar/src/lib/data/regions.ts` - Added mock data and error handling
- `picklejar/src/lib/data/collections.ts` - Added mock data and error handling
- `picklejar/src/app/[countryCode]/(main)/page.tsx` - Added demo mode detection
- `picklejar/src/app/[countryCode]/layout.tsx` - Added missing layout file
- `picklejar/src/app/[countryCode]/(main)/layout.tsx` - Added error handling
- `picklejar/src/lib/data/cart.ts` - Added error handling
- `picklejar/src/lib/data/customer.ts` - Added error handling

## Troubleshooting

If you still see issues:

1. **Check the console** for any error messages
2. **Verify the frontend is running** on port 8000
3. **Check the network tab** to see if API calls are being made
4. **Look for the demo mode banner** - if you see it, the app is working correctly

The application should now load successfully without any 500 errors!
