# 🚀 Personal Portfolio with Admin Panel

A modern dark-themed portfolio website with a full admin panel, powered by **Supabase** (database, auth, storage).

---

## 📁 Folder Structure

```
portfolio/
├── index.html                ← Main portfolio (Home, About, Skills, Projects, Contact)
├── projects.html             ← All projects with search
├── css/
│   └── style.css             ← Shared stylesheet (dark theme, glassmorphism)
├── js/
│   ├── supabase.js           ← Supabase client + all API helpers
│   └── app.js                ← Shared UI utilities (toast, loading, validation)
├── admin/
│   ├── login.html            ← Admin login (Supabase Auth)
│   ├── dashboard.html        ← Overview + projects table + delete
│   ├── add-project.html      ← Add / Edit project (with image upload)
│   ├── profile.html          ← Edit public profile (name, bio, photo)
│   └── messages.html         ← View contact messages
└── supabase-setup.sql        ← Run once in Supabase SQL Editor
```

---

## ⚡ Quick Start

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **anon/public API key** from:
   `Settings → API → Project URL & Project API keys`

---

### Step 2 — Configure Credentials

Open `js/supabase.js` and replace the placeholders:

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

---

### Step 3 — Run the SQL Setup

1. In your Supabase dashboard, go to **SQL Editor → New Query**.
2. Paste the entire contents of `supabase-setup.sql` and click **Run**.

This will create:
- `profile`, `projects`, `messages` tables with RLS policies
- A `portfolio-images` storage bucket with public read + auth write policies
- Optional seed data (3 sample projects + a default profile)

---

### Step 4 — Create an Admin User

1. In Supabase dashboard, go to **Authentication → Users → Add User**.
2. Enter your admin email and a strong password.
3. Use these credentials to log into `/admin/login.html`.

---

### Step 5 — Serve the Files

Since this is pure HTML/CSS/JS (no build step), you can serve it with:

```bash
# Option A: VS Code Live Server extension (easiest)
# Option B: Python
python -m http.server 8080
# Option C: Node http-server
npx http-server . -p 8080
```

Then open `http://localhost:8080`.

---

## ✨ Features

### Public Portfolio
| Feature | Details |
|---|---|
| Hero section | Animated avatar, stats, live profile name/bio from Supabase |
| About section | Bio + profile photo loaded dynamically |
| Skills section | Static chips (easily editable) |
| Projects section | Loaded from Supabase, skeleton loading state |
| Contact form | Stores messages in Supabase `messages` table |
| All Projects page | Search/filter by title or description |

### Admin Panel
| Feature | Details |
|---|---|
| Login | Supabase email/password auth |
| Route protection | All admin pages redirect to login if no session |
| Dashboard | Stats (projects, messages, profile status) + projects table |
| Add Project | Title, description, image upload (drag & drop or click) |
| Edit Project | Pre-fills form, replaces/removes image in storage |
| Delete Project | Confirmation modal, also deletes image from storage |
| Edit Profile | Name, bio, profile photo with live preview |
| Messages | List + full message modal + mailto reply link |
| Sign Out | Clears Supabase session |

---

## 🎨 Design

- **Theme:** Dark · Glass morphism · Refined premium
- **Fonts:** Syne (headings) + DM Sans (body)
- **Palette:** `#080c10` bg · `#00e5ff` accent · `#7b61ff` purple
- **Responsive:** Mobile, tablet, desktop with hamburger nav + collapsible sidebar
- **Animations:** Scroll-triggered reveals, staggered cards, floating rings, pulse dots

---

## 🗄️ Database Schema

```sql
profile  (id uuid, name text, bio text, image_url text, updated_at)
projects (id bigint, title text, description text, image_url text, created_at)
messages (id bigint, name text, email text, message text, created_at)
```

Storage bucket: `portfolio-images`
- `profile/` folder → profile photos
- `projects/` folder → project screenshots

---

## 🔒 Security Notes

- RLS is enabled on all tables — public users can only read `profile` and `projects`, insert `messages`.
- The admin user is a real Supabase Auth user — never hardcode passwords.
- The anon key is safe to expose in frontend code (it only has the permissions you grant via RLS).
- For production, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` as environment variables if using a bundler.

---

## 🛠️ Customization

| What | Where |
|---|---|
| Skills list | `index.html` → skills section (static chips) |
| Contact info | `index.html` → contact section |
| Nav brand name | `index.html` → `.nav-brand` |
| Colors/fonts | `css/style.css` → `:root` CSS variables |
| Storage bucket name | `js/supabase.js` → `STORAGE_BUCKET` |
