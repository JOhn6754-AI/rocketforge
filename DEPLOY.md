# Deploying RocketForge to Cloudflare Pages

## Option 1: Deploy with Wrangler (Local)

1. Make sure you're logged into Cloudflare:
   ```bash
   wrangler login
   ```

2. First time only — create the Pages project:
   ```bash
   wrangler pages project create rocketforge --production-branch=main
   ```

3. Build and deploy:
   ```bash
   npm run deploy
   ```

4. For preview deployments:
   ```bash
   npm run deploy:preview
   ```

## Option 2: Deploy via Git + Cloudflare Dashboard (Recommended)

This is often more reliable:

1. Push this project to a GitHub repository.

2. Go to https://dash.cloudflare.com → Pages → Create a project → Connect to Git.

3. Select your repository.

4. Use these settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variables**: (none needed)

5. Click Save and Deploy.

---

**Note**: This project uses Next.js static export (`output: "export"`), so it deploys as a fully static site. All simulation logic runs in the browser.

After deployment, your site will be available at:
`https://rocketforge.pages.dev` (or your custom domain)