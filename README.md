# Heng Jing Yu — interactive portfolio

A 2D interactive portfolio built with Vite + React.

Open each card in the carousel to collect five items for the workbench. When all five are
collected, a "Craft the ticket!" button appears. The crafted ticket shows my contact details,
and tearing off the stub sends me a message (email + optional text + rating).

A plain **Quick read** button (top right) shows everything as normal text, so nobody has to
play the game to find the information.

## Run it

```bash
npm install
npm run dev
```

Open the address that Vite prints (usually http://localhost:5173).

## Edit the content

Everything visitors read is in **`src/data/portfolio.js`**: contact details, the five cards,
and the text inside them. You normally never need to touch the components.

Put your CV in `public/` and name it `CV_HENG_JING_YU.pdf` (or change `resume` in the data file).

## Make the ticket really send messages

The torn stub sends its message through [Web3Forms](https://web3forms.com), a free
form-to-email service (no server needed).

1. On web3forms.com enter your email address. They send you an **access key**.
2. Copy `.env.example` to `.env` and paste the key after `VITE_WEB3FORMS_KEY=`.
3. On Vercel: Project, Settings, Environment Variables, add `VITE_WEB3FORMS_KEY`
   with the same key, then redeploy.

Without a key, `npm run dev` runs in demo mode (the animation works, nothing is sent), and
the deployed site shows a friendly error with your email address instead.

The access key is not a secret (it is visible in the browser by design), but the service
lets you restrict it and add spam protection in its dashboard.

## Deploy

Push this folder to GitHub, import the repo in Vercel (framework preset: Vite), add the
environment variable above, and deploy.

## Credits and art

- The pixel icons in `src/components/icons.js` and the favicon are original drawings made
  for this site. No third-party game assets, logos, fonts or sounds are used.
- `TearTicket` and `PeekRating` come from [React Bits](https://reactbits.dev). They live in
  `src/components/reactbits/` and are unchanged. Check the React Bits license before reusing them.
- This is a personal project and is not affiliated with Mojang or Microsoft.
