# Deploying RocketForge

This project is set up for easy deployment to **Cloudflare Pages** using GitHub.

## Step-by-step Deployment (GitHub + Cloudflare)

### 1. Create a GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `rocketforge` (recommended)
3. Make it **Public** (easier for Cloudflare)
4. **Do NOT** initialize with README, .gitignore, or license (we already have those)
5. Click **Create repository**

### 2. Push Your Code

After creating the repo, run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/rocketforge.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Cloudflare Pages

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project** → **Connect to Git**
3. Select your `rocketforge` repository
4. Use these settings:

   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: (leave empty)

5. Click **Save and Deploy**

Cloudflare will automatically build and deploy your site. This usually takes 1–3 minutes.

Your site will be live at:
`https://rocketforge.pages.dev`

---

## Alternative: Manual Deploy with Wrangler

If you prefer command line:

```bash
# Login
wrangler login

# Deploy (build happens on Cloudflare, but this pushes the static files)
npm run deploy
```

**Note**: Because of a local build issue on this machine, the GitHub + Cloudflare dashboard method is strongly recommended.

---

Once deployed, you can connect a custom domain in the Cloudflare Pages dashboard if desired.