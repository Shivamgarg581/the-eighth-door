# Deployment

## Recommended production topology

GitHub is the source of truth.

- GitHub: repository, issues, branches and Actions.
- Vercel: Next.js production hosting and preview deployments.
- Supabase: optional persistence/analytics backend when cloud state is enabled.

## First production deploy

1. Import Shivamgarg581/the-eighth-door into Vercel.
2. Set the framework to Next.js if it is not detected automatically.
3. Keep the build command as next build.
4. Add only required environment variables from .env.example.
5. Deploy the main branch.
6. Verify /, /archive, /cases, /about, /privacy, /terms.
7. Run a browser pass on desktop and mobile.
8. Add a custom domain only after the deployed preview is verified.

The repository intentionally does not contain production secrets.
