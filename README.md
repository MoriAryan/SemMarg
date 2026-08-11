# 📚 SemMarg 

Once upon a time in a bustling engineering college, students were drowning in a sea of overlapping assignments, forgotten labs, and tutorials that seemed to appear out of thin air. There was chaos. Missed deadlines roamed the halls like ghosts, and the dreaded 75% attendance criteria hung over their heads like a storm cloud.

Enter **SemMarg** — The Minimal Academic Utility.

Built for the modern student, SemMarg isn't just another overly-complicated planner that requires a Ph.D. to figure out. It's designed to be effortlessly simple, wickedly fast, and incredibly beautiful. 

## 🌟 The Features That Save Degrees

- **The Void (Tasks):** Dump your impending doom (assignments, labs, files) into the void. If it's due today, you'll know. If it's overdue, the bright red tags will scream at you.
- **The Archives (Completed):** Nothing feels better than crossing things off. They slide beautifully into the completed section, grouped by subject with a satisfying strikethrough.
- **The Core (Subjects):** Define the building blocks of your semester. Labs and Tutorials, automatically assigned a gorgeous accent color.
- **The Lifeline (Attendance):** Because we all know exactly why you're here. Track that magical 75% benchmark. A single click to mark present or absent. It even supports those brutal double-lab days where you can mark multiple attendances for a single date.

## 🛠️ The Magic Under the Hood

SemMarg is built using a modern, unapologetically fast tech stack:

- **Frontend:** React + Vite + TailwindCSS. Strict dark mode. Glassmorphism that actually looks good.
- **Backend:** Express + Prisma + PostgreSQL (Supabase).
- **Auth:** Clerk. Because nobody has time to build login flows from scratch when assignments are due.
- **Deployment:** Vercel (Frontend & Serverless Backend).

## 🚀 How to Run the Magic Locally

Got the codebase? Let's get it running before your next tutorial starts.

### 1. The Environment Variables
You'll need a `.env` in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=http://localhost:5000/api
```

And a `.env` in the `server` directory:
```env
DATABASE_URI=your_postgresql_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=http://localhost:5173
```

### 2. The Setup
Install the dependencies for both client and server:
```bash
cd client && npm install
cd ../server && npm install
```

Push the database schema (make sure Postgres is running):
```bash
cd server
npx prisma db push
```

### 3. Ignition
Fire them both up:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit `http://localhost:5173` and breathe a sigh of relief. Your semester is officially under control.

---
*Built with ❤️ (and probably too much caffeine).*
