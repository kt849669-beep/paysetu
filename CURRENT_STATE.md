# PaySetu 1.0 - Current Project State & Memory

This file serves as memory for AI agents. When a new conversation starts, read this to understand the current state.

## Recent Updates (July 21, 2026)
1. **Complete Rebranding:** Project renamed from ShowPay to PaySetu.
   - All ShowPay/app-paysetu.online references removed.
   - New domain placeholder: app-paysetu.online
   - Session keys renamed: paysetu_session, paysetu_admin_token

2. **Login Page Redesign:**
   - Dark blue gradient header with PaySetu branding
   - +91 phone prefix, eye toggle for password
   - Teal LOG IN button
   - "Trusted by 10,000+ users" trust badge

3. **Home Page Redesign (PaySetu style):**
   - INR / USDT currency tabs
   - Task / VIP section tabs
   - Purple gradient balance card with "Active" badge
   - Stats row (Today | Top up Bonus | Team Comm. | Balance)
   - Task cards with Buy buttons
   - Bottom nav: Home | Activity | Link UPI (center) | Team | Me
   - Slider removed from home page entirely

4. **MPIN Popup Redesign:**
   - "Please enter PIN" title
   - Large rounded square PIN boxes (46x56px)
   - "Secured with end-to-end encryption" label
   - Cancel button works same as before (logout)

5. **Admin Panel Rebranding:**
   - PaySetu name everywhere (was ShowPay)
   - P logo (was S)
   - Slider nav link removed from all admin pages

6. **Vite Dev Server Rewrites:**
   - vite.config.ts has custom middleware for /login, /home, /admin routes
   - No vercel.json - removed completely

## Important Notes for Future Agents
- **Environment:** Windows, PowerShell.
- **Build:** Vite 6.x (npm run dev for local, npm run build for prod)
- **Routing:** vite.config.ts has dev rewrites. For production hosting, configure rewrites at server level.
- **Supabase:** Config at user-app/js/config/supabase.js (shared by both apps)
- **Session Keys:** paysetu_session (sessionStorage, user), paysetu_admin_token (localStorage, admin)
- **No Vercel:** vercel.json deleted. No Vercel-specific configs.
- **Scripts:** Always use type="module" for JS scripts in HTML.


