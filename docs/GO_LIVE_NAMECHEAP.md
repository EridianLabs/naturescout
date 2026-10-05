# Go live: NatureScout.co.uk on Namecheap

Your domain: **naturescout.co.uk**  
Recommended host for this Vite app: **Vercel** (free hobby tier works)

---

## A. Deploy the site (Vercel) — do this first

1. Push this repo to GitHub (or deploy from CLI).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework: Vite (auto-detected). Build command: `npm run build`. Output: `dist`.
4. **Environment variables** → add:
   - `VITE_MAPTILER_KEY` = your MapTiler key
5. Deploy. You’ll get a URL like `https://naturescout-xxxx.vercel.app`.
6. Confirm it loads, especially `/map`, `/privacy`, `/terms`.

CLI alternative:

```bash
npm i -g vercel
vercel login
vercel
# add VITE_MAPTILER_KEY when prompted / in dashboard
vercel --prod
```

---

## B. Point Namecheap at Vercel

### 1. In Vercel

Project → **Settings** → **Domains** → add:

- `naturescout.co.uk`
- `www.naturescout.co.uk`

Vercel will show the DNS records it needs (usually):

| Type | Host | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

(Use the exact values Vercel shows — they can change.)

### 2. In Namecheap

1. Log in → **Domain List** → **naturescout.co.uk** → **Manage**
2. **Nameservers** = **Namecheap BasicDNS** (default) unless you moved DNS elsewhere
3. **Advanced DNS** → remove conflicting old **A / CNAME / URL Redirect** records for `@` and `www`
4. Add the Vercel records above
5. Save

### 3. Wait for DNS

- Often 5–30 minutes; can take up to 48 hours
- Check: https://dnschecker.org/#A/naturescout.co.uk

### 4. HTTPS

Vercel issues a free SSL certificate automatically once DNS is correct.  
Open https://naturescout.co.uk — you should see NatureScout.

---

## C. Lock MapTiler to your domain

MapTiler dashboard → API key → **Allowed HTTP origins**:

- `https://naturescout.co.uk`
- `https://www.naturescout.co.uk`
- `http://localhost:5173` (local dev)

---

## D. Optional: Netlify instead of Vercel

Same idea: deploy `dist`, then in Namecheap:

| Type | Host | Value |
|------|------|--------|
| **A** | `@` | Netlify load balancer IP (from Netlify DNS docs) |
| **CNAME** | `www` | `your-site.netlify.app` |

Or switch Namecheap nameservers to Netlify DNS and manage records there.

---

## E. After the domain is live

1. Update MapTiler origins (section C)
2. iOS TestFlight privacy URL = `https://naturescout.co.uk/privacy`
3. Confirm Profile legal links open the live site
4. Optional: set up email `hello@naturescout.co.uk` in Namecheap Private Email / Google Workspace / ImprovMX

---

## Quick checklist

- [ ] Vercel project deployed with `VITE_MAPTILER_KEY`
- [ ] Domain added in Vercel
- [ ] Namecheap A + CNAME set
- [ ] https://naturescout.co.uk loads
- [ ] Map tiles work
- [ ] /privacy and /terms work
- [ ] MapTiler origins restricted

Stuck? Most failures are: old URL redirect still on `@`, wrong A record, or MapTiler blocking the new origin.
