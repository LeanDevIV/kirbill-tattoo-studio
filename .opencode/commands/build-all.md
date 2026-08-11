---
description: Build all 12 roadmap phases autonomously
model: opencode/qwen3.7-plus
subtask: false
---

You are autonomously building the entire Kirbill Tattoo Studio project. Work through ALL phases from ROADMAP.md in order (0 through 11), completing every bullet point. Do not skip phases.

## Initial Setup (do this first)

1. Read SPECS.md fully to understand the architecture, data models, API endpoints, and design system.
2. Read CODESTYLE.md fully to understand naming, file structure, React patterns, backend patterns, and git conventions.
3. Read ROADMAP.md and use it as your task checklist.

## Phase Execution Rules

For each phase, in order from 0 to 11:

- Read the phase description and bullet points in ROADMAP.md.
- Implement EVERY bullet point in that phase. Do not skip anything.
- Use the tech stack specified in SPECS.md: ElysiaJS + Bun (backend), Vite + React + Tailwind CSS v4 (frontend), MongoDB + Mongoose, beautiful-ui components, reactbits drift-wall.
- Follow CODESTYLE.md conventions: kebab-case files, PascalCase components, thin route handlers, services for business logic, no inline functions in JSX, Tailwind only, cn() utility.
- Commit on EVERY significant checkpoint within the phase using conventional commits (e.g. `feat: add MongoDB connection and user model`).
- After completing a phase, edit ROADMAP.md and change `- [ ]` to `- [x]` for every bullet point you completed in that phase.
- Then move to the next phase.

## What to build (summary reference from ROADMAP.md)

Phase 0: Monorepo scaffolding — workspaces, turbo.json, tsconfigs, ESLint, Tailwind CSS v4 with DESIGN.md tokens, Space Grotesk font, .gitignore, .env.example.

Phase 1: Backend skeleton — MongoDB connection, ALL 7 Mongoose models (User, HeroImage, GalleryImage, Appointment, Payment, Conversation, Message), seed script for admin user, POST /api/auth/login, logout, me, auth middleware, CORS, health check.

Phase 2: Frontend skeleton — Tailwind tokens from DESIGN.md, Space Grotesk, PublicLayout (Navbar + Outlet + Footer), AdminLayout (AdminSidebar + Outlet), SiteNavbar (pill floating, glass on scroll, smooth scroll links), Footer (Instagram, Facebook, WhatsApp SVG icons), routes in App.tsx, useAuth hook, placeholder pages.

Phase 3: Admin login — LoginPage form (username + password), useAuth hook (login, logout, me), route guards (redirect to /admin/login if no session, redirect to /admin/home if authenticated), logout button in sidebar.

Phase 4: Hero section — GrainientHero component with animated Grainient background, HeroCarousel with smooth transitions, placeholder images, GET /api/hero-images (public), POST/PUT/DELETE /api/hero-images (admin, Vercel Blob upload), HomeAdminPage with ImageUploader, drag-and-drop reorder, active/inactive toggle.

Phase 5: Gallery section — DriftGallery using reactbits drift-wall, images from /api/gallery, title/category on hover, GET /api/gallery (public), POST/PUT/DELETE /api/gallery (admin), admin management in HomeAdminPage or separate.

Phase 6: Contact section + public chat — ContactSection (1/4 social links left, 3/4 chat trigger right), ChatPanel popup overlay with glassmorphism, email+name input before chat, WebSocket /ws/chat handler (init creates conversation, message saves to DB + broadcasts), useWebSocket hook, message bubbles (client right, admin left), image attachment button, camera button, rise-in animation on sent messages, appointment notification listener.

Phase 7: Admin chat — ChatPage with 2-panel layout (conversation list left, chat right), WebSocket admin-side auth, real-time messaging, mark conversation as read, typing indicator, scroll-to-bottom, create appointment button from chat.

Phase 8: Appointments — SchedulePage with table/calendar, filters by date/status, create/edit modal (client, date, time, amount, description), status actions (confirm, cancel, complete), GET/POST/PUT/DELETE /api/appointments, create from chat button.

Phase 9: Notifications — Email service with Resend, HTML templates for appointment created/modified/cancelled, trigger email on appointment CRUD, WebSocket messages for appointment_created, appointment_updated, appointment_cancelled.

Phase 10: Payments — PaymentsPage with beautiful-ui FilterTable, columns (client, amount, status chip, date, appointment), filter by status, inline status editing, create payment modal, status colors (pending=yellow, paid=green, cancelled=gray, refunded=red), GET/POST/PUT/DELETE /api/payments.

Phase 11: Polish — responsive review all breakpoints, final animations and transitions, loading states, SEO meta tags and Open Graph, favicon, Vercel deploy config, end-to-end flow testing.

## Important Reminders

- Follow CODESTYLE.md EXACTLY: no any types, no inline functions in JSX, no console.log, no hardcoded values, no enums (use as const), kebab-case files, thin routes, services for logic.
- Use the DESIGN.md visual tokens: glass class, glow-cardinal, text-gradient, animate-float-slow, animate-rise, OKLCH color tokens, Space Grotesk font.
- For any npm packages needed, use bun as the package manager (bun add, bun install).
- The project root is a monorepo with workspaces. Run installs at root level.
- Chinese, Spanish, and other UI-facing text is fine — but code, variables, functions, commits must be in English.
- Never commit .env files. Use .env.example as reference.
- Do not abuse comments. Only comment on non-obvious decisions.
- Format all code before committing (bun run format if configured, or manual formatting).
