# Deployment

GitHub remains the source of truth and Vercel hosts the Next.js app.

## First production launch

1. Import `Shivamgarg581/the-eighth-door` into Vercel.
2. Let Vercel detect Next.js.
3. Keep the build command as `next build` if prompted.
4. Deploy `main`.
5. Verify the homepage, Library, How It Works, About, Privacy and Terms pages.
6. Test at least one question on desktop and mobile.
7. Add a custom domain only after the free Vercel deployment is working.

## Environment

The first release does not require a generative-AI API key for its core response flow.

Set `NEXT_PUBLIC_SITE_URL` to the real production URL when you want the sitemap enabled.

## Launch plan

Release the authored core first. Measure real use and collect feedback. Then add deeper characters, richer scene animation, more shelves, optional analytics, cloud memory and monetization in later releases.

No production secret belongs in the repository.
