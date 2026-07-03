# InternIQ

InternIQ is an all-in-one career prep platform built to help students and early-career folks get ready for internships and jobs — from building a solid resume to prepping for interviews to keeping track of applications, all in one place.

The idea came from a pretty common problem: people end up juggling five different tools (a resume builder here, a spreadsheet there, random interview prep videos somewhere else) and none of it talks to each other. InternIQ is meant to fix that by bringing the whole prep process into one app.

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js

Standard MERN setup. Nothing fancy on the infra side yet — keeping it simple while the core features get built out.

## Current Status

Right now I'm building the **resume builder** module. This is the first core feature going in, since it's the thing most people will use first and it lays the groundwork (data models, auth, user profiles) for everything else that comes after.

What the resume builder is covering so far:
- Structured resume sections (education, experience, projects, skills)
- Live preview while editing
- Clean export (working on PDF export)
- Basic templates to start with, more to come later

## What's Next

Once the resume builder is in a solid place, here's the rough order I'm planning to tackle:

1. **Application tracker** — a place to log internships/jobs applied to, their status, deadlines, and notes, so people stop losing track in random spreadsheets.
2. **Interview prep module** — practice questions, maybe mock interview flows, and feedback based on common internship interview patterns.
3. **Dashboard** — a home screen that pulls everything together (resume status, applications in progress, upcoming interview prep) so users get a quick snapshot of where they stand.
4. **Auth and user accounts** — proper sign-up/login, saved profiles, so people can come back and pick up where they left off (this might get pulled earlier depending on how the resume builder shapes up).
5. **Polish and deploy** — once the core loop works end to end, focus shifts to UI polish, performance, and getting it live.

This list will probably shift around as things get built and I learn more about what's actually useful versus what sounded good on paper.

## Running Locally

Instructions will be added here once the project structure is stable enough to document properly (client and server setup, env variables, etc.). For now this is very much a work in progress.

## Notes

This is a solo project I'm building step by step, so the README will keep getting updated as features land. If something in here is outdated, the code is the source of truth for now.
