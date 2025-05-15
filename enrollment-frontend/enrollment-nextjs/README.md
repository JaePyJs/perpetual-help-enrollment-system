# Enrollment Frontend (Next.js)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Testing
- Uses Jest and React Testing Library for unit/integration tests
- Run tests with `npm test` or `npx jest`
- Sample test: `src/app/components/Button.test.tsx`

## Accessibility
- Uses eslint-plugin-jsx-a11y for accessibility linting
- Run `npx eslint .` to check for accessibility issues
- Manual audit recommended for keyboard navigation, color contrast, ARIA labels

## Analytics
- To add Plausible Analytics, insert the following in `src/app/layout.tsx`:

```tsx
// In layout.tsx (inside <head>)
<script async defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script>
```
- Replace `yourdomain.com` with your actual domain

## Deployment
- Recommended: Vercel or Netlify for seamless Next.js deployment
- Connect your GitHub repo and follow platform instructions
- For CI/CD, add a `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - run: npm test
```
