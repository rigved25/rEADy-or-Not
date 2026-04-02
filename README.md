# rEAD or NOT

Simple static web app to track if the EAD mail was found.

## Features

- Login selector with two options: `Shrirang` or `Lakshita`
- `Lakshita` can submit `Yes` or `No` for mail found
- `Shrirang` sees latest table entries only
- Stores checks in Supabase table with:
  - `checked_at` (timestamp)
  - `found` (boolean)

## Setup

1. Create a Supabase project.
2. Open SQL editor in Supabase and run `supabase/schema.sql`.
3. Copy `config.example.js` to `config.js`.
4. Fill `config.js`:

```js
window.READ_OR_NOT_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
};
```

5. Open `index.html` locally, or serve with any static server.

## Deploy to GitHub Pages

1. Push this project to GitHub.
2. In repo settings, ensure Pages source is `GitHub Actions`.
3. Commit your `config.js` if you want a fully client-side deployment.
   - This app uses Supabase anon key, which is intended for browser use.
   - Keep RLS enabled as defined in `supabase/schema.sql`.

Workflow file is included at `.github/workflows/pages.yml`.

## Notes

- This is a trusted/private MVP with simple user selection (no password).
- For stronger security later, add real authentication and tighten RLS policies.
