# Deployment

This app is already configured as a static Vite site and can be deployed to platforms such as Vercel or Netlify.

## Build locally

```powershell
$env:Path = "C:\Users\hp\OneDrive\Documents\docs\Tech\Blue Carbon WebApp\.tools\node-v24.13.1-win-x64;" + $env:Path
.\.tools\node-v24.13.1-win-x64\npm.cmd install
.\.tools\node-v24.13.1-win-x64\npm.cmd run build
```

The production-ready files are generated in `dist/`.

## Vercel

1. Create or sign in to a Vercel account.
2. Import this project.
3. Vercel should detect Vite automatically.
4. Build command: `npm run build`
5. Output directory: `dist`

This repo includes `vercel.json`.

## Netlify

1. Create or sign in to a Netlify account.
2. Add a new site from your project files or repo.
3. Build command: `npm run build`
4. Publish directory: `dist`

This repo includes `netlify.toml`.

## What is needed to finish deployment

To publish the app live from this machine, a hosting provider account and deployment authentication are required.
