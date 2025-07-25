# Database Migration Guide

## Overview

The database structure has been completely refactored to improve data normalization and relationships. This document outlines the changes and provides migration instructions.

## New Database Structure

### Tables

1. **`clients`** - User/client information
2. **`addresses`** - Client addresses (separated from clients)
3. **`products`** - Product catalog
4. **`orders`** - Order headers
5. **`order_items`** - Order line items (separated from orders)
6. **`deliveries`** - Delivery information (linked to orders and addresses)

### Key Changes

#### 1. **Normalized Data Structure**
- **Before**: Addresses stored directly in `clients` table
- **After**: Separate `addresses` table with `client_id` foreign key

- **Before**: Order items stored as JSON in `orders` table
- **After**: Separate `order_items` table with `order_id` foreign key

#### 2. **Improved Relationships**
- Orders now link to clients via `client_id`
- Deliveries link to orders via `order_id` and addresses via `address_id`
- Products have a unique `key` field for easy identification

#### 3. **Better Data Integrity**
- Foreign key constraints ensure referential integrity
- Proper indexing for performance
- Row Level Security (RLS) enabled on all tables

## Migration Steps

### 1. Database Schema

The new schema has been provided in the SQL script. Run it in your Supabase database:

```sql
-- Run the complete SQL script provided in the user query
-- This will drop old tables and create new ones with proper structure
```

### 2. Code Updates

The following files have been updated to work with the new structure:

#### Updated Files:
- `app/api/webhooks/stripe/route.ts` - Updated order processing
- `app/api/auth/[...nextauth]/route.ts` - Updated client creation
- `app/api/client/[email]/route.ts` - Updated client API
- `components/AddressForm.tsx` - Updated delivery creation
- `lib/delivery/supabase.ts` - Updated delivery functions
- `lib/delivery/types.ts` - Updated type definitions
- `lib/clients.ts` - Updated client functions
- `lib/orders.ts` - Updated order functions

#### New Files:
- `lib/types.ts` - New type definitions
- `lib/products.ts` - Product management functions
- `lib/addresses.ts` - Address management functions

### 3. Data Migration

#### Products Migration
The products table has been populated with the data from `products.json`. The migration function in `lib/products.ts` can be used to migrate additional products:

```typescript
import { migrateLegacyProducts } from '@/lib/products'
import productsData from '@/products.json'

// Run this once to migrate products
await migrateLegacyProducts(productsData)
```

#### Client Data Migration
Existing client data will need to be migrated if you have any. The new structure separates addresses from client information.

## Breaking Changes

### 1. **API Changes**
- Client API now returns addresses as a separate array
- Order creation requires separate client and address creation
- Delivery creation requires client and address IDs

### 2. **Type Changes**
- `DeliveryRecord` interface has been completely restructured
- `Order` interface now uses database types instead of localStorage types
- New interfaces for `Address`, `Product`, `OrderItem`

### 3. **Function Signatures**
- `createDelivery()` now requires `CreateDeliveryRequest` object
- `getClientDeliveries()` now takes `clientId` instead of `email`
- Order functions now work with database instead of localStorage

## Testing

### 1. **Test Order Flow**
1. Create a client
2. Create an address for the client
3. Create a delivery
4. Process payment through Stripe
5. Verify order and order_items are created correctly

### 2. **Test Authentication**
1. Sign in with Google
2. Verify client is created/updated in database
3. Check that all required fields are populated

### 3. **Test Address Management**
1. Create multiple addresses for a client
2. Set primary address
3. Update address information
4. Delete addresses

## Rollback Plan

If issues arise, you can:

1. **Database**: Restore from backup before running the migration
2. **Code**: Revert to previous git commit
3. **Data**: Use the migration functions to recreate data in old format

## Performance Considerations

### 1. **Indexes**
The new schema includes proper indexes for:
- Client email lookups
- Order session ID lookups
- Delivery date/slot queries
- Address primary key constraints

### 2. **Queries**
- Use joins to fetch related data efficiently
- Consider pagination for large datasets
- Use RLS policies for security

## Security

### 1. **Row Level Security**
All tables have RLS enabled with policies that allow all operations (for now). In production, you should implement proper security policies.

### 2. **Data Validation**
- Foreign key constraints prevent orphaned records
- Check constraints ensure valid data (e.g., delivery slots 1-4)
- Unique constraints prevent duplicates

## Next Steps

1. **Deploy the new schema** to your Supabase database
2. **Update your application code** with the new files
3. **Test thoroughly** in a staging environment
4. **Migrate any existing data** if needed
5. **Deploy to production**

## Support

If you encounter issues during migration:

1. Check the Supabase logs for database errors
2. Verify all foreign key relationships are correct
3. Ensure all required fields are being provided
4. Test with a small dataset first

## Future Improvements

1. **Product Management**: Add admin interface for managing products
2. **Order Management**: Add admin interface for managing orders
3. **Analytics**: Add reporting functions for business insights
4. **Notifications**: Add email/SMS notifications for order updates 