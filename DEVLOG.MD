# REMINDERS

- restore sd-saas project database in supabase, it gets paused from time to time.
- make sure to login before trying this feature.

- make working login to generate images.

# 16-02-2023

- figuring out where i left off last time.
- lets do a `npm run dev`
- yes, i was trying to save predictions id to user database records.
- image prediction requests are sent from client side, i was trying to see how can i handle it in server side.
  - relevant endpoints are predictions [id].js

# 24-02-2023

- finally setup stripe with the site
- i had to modify code in billing.js file
  - passing context from getServerSideProps code to billing.js functions to get user session properly
  ```js
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  ```
  - i'm using an old version of next-auth that doesn't use getServerSession. in new next-auth 15 version, unstable_getServerSession() is deprecated, so passing context won't be necessary.
  - the project was built with next.js 12 and it requires using next-auth 14 for compatibility.
- next steps can be porting the code to latest next 13/14 and next-auth.
- OR just build upon this and add landing pages and other UI components
- I have to update the product_id in billing.ts when i make the actual product in stripe dashboard.
- i also want to implement a token system for image generations later.
-
