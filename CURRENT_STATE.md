# ShowPay 3.0 - Current Project State & Memory

This file serves as memory for AI agents. When a new conversation starts, read this to understand the current state.

## Recent Updates (July 16, 2026)
1. **SEO Optimization:** Updated meta tags and Open Graph data in `index.html` and other pages with exact casing for keywords ("Showpay", "Showpay login", "Showpay app", "Showpay apk"). GoDaddy `app-atgpay.in` domain was instructed to be unlinked to prioritize `app-showpay.in`.
2. **Admin Panel Mobile Responsiveness:**
   - The admin login page (`admin-app/pages/login.html`) was updated via `admin-app/css/responsive.css` to fit mobile screens perfectly without touching the edges.
   - Fixed an issue where the sidebar hamburger menu was not working on mobile because Vercel/Vite dropped `sidebar.js`. Fixed by adding `type="module"` to all `sidebar.js` script tags in admin HTML pages.
3. **Admin Session Tracking (Multi-Device Logout):**
   - Added logic in `login.js` and `auth.js` to track `admin_sessions` in Supabase.
   - When an admin changes their password in `profile.js`, all other active sessions are logged out (tokens deleted), except for their current device.
   - Note for DB: The SQL query for the `admin_sessions` table has been provided to the user. `auth.js` gracefully handles missing table errors without causing infinite logout loops.
4. **Users Page Bulk Actions:**
   - Added "Select All" functionality in `users.html` and `users.js`.
   - Added bulk PDF download using `jspdf` and `jspdf-autotable`.
   - Added bulk delete for users (moves them to `trash` table in Supabase).
5. **Deployment:** The project is deployed using Vercel. Output directory is `dist`. Build uses Vite.

## Important Notes for Future Agents
- **Environment:** Windows, PowerShell.
- **Tools:** Use `vite build` (no `vite.config.js` needed by default, but there is a `vite.config.ts` mapping HTML files).
- **Supabase:** The project uses Supabase for database operations. Ensure RLS policies or correct tokens are used.
- **Vercel:** Vercel rewrites are configured in `vercel.json`. The admin login is accessed via `/admin` which rewrites to `admin-app/pages/login.html`.
- **Scripts:** Always use `type="module"` for JS scripts in HTML if they need to be bundled by Vite in production.
