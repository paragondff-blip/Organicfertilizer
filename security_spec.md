# Security Specification for Organic Biscuits

## Data Invariants
1. A user can only access their own profile data, except for admins who can see all user info (excluding PII if strictly separated, but for this app admins manage users).
2. Only admins can create, update, or delete products, categories, coupons, blogs, and banners.
3. Users can only see their own orders. Admins can see all orders.
4. Users can only create reviews for products.
5. All writes must be validated against a schema helper.
6. Identity fields (uid, userId) must match the authenticated user's UID.
7. Timestamps must be server-generated.

## The "Dirty Dozen" Payloads (to be rejected)
1. Update user role to 'admin' from client side.
2. Create a product with a negative price.
3. Delete an order belonging to another user.
4. Inject a huge string (>1KB) into a category name.
5. Create a review with a rating of 10 (max is 5).
6. Update the 'createdAt' field of a product.
7. Create an order with 'status': 'delivered' directly.
8. Update another user's address.
9. Create a coupon with an expiry date in the past.
10. Read the private user list without being an admin.
11. Update product stock to a negative value.
12. Create a blog post as a regular user.

## Admin Policy
- User `nahid.mfal.mis@gmail.com` is a bootstrapped admin.
- Users with `role == 'admin'` in the `/users/{uid}` document are admins.
