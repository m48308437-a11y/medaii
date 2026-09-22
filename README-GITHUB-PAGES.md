# MedAI — GitHub Pages

## Deploy

1. Upload/push the entire project to a GitHub repository.
2. Make sure the default branch is `main`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions**.
5. Push to `main` (or run the workflow manually from **Actions**).
6. Open the Pages URL shown by GitHub.

The workflow builds the Next.js app as a static export into `out/` and deploys it automatically.

## Important

GitHub Pages only hosts the static frontend. Any MedAI API, database, authentication, AI calls, or server-side functionality must run on a separate backend service.
