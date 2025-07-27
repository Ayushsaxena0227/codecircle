# CodeCircle

Welcome to **CodeCircle** – an open-source coding-practice playground something a little more transparent, flexible and community-driven than the usual online judges.

### Why I'm building it

1. **Learn by looking under the hood.**  
   Most big platforms hide their internals; CodeCircle is fully public so you can peek at every React component, every Firestore query and every line of Express code.

2. **Add the features we always wish existed.**  
   Dark-mode toggle, per-language boiler-plate, instant toast feedback – those came from personal itch-scratching. Anything else you’ve always wanted? Fork it and ship it.

3. **Make it feel like a friendly Discord channel, not an exam hall.**  
   We want pair-programming queues, inline discussions, and collaborative problem sets rather than a solitary grind.

## some glimpse of project
<img width="1917" height="823" alt="image" src="https://github.com/user-attachments/assets/78cc3bb8-3203-4bcf-8291-317b9e3eeb53" />
<img width="1919" height="827" alt="Screenshot 2025-07-27 125445" src="https://github.com/user-attachments/assets/64b52eb6-124e-4dbd-8346-157a1b952c52" />



### What already works

Right now you can sign up with email-password or Google, browse a curated problem list, open a Monaco editor pre-filled with boiler-plate (JavaScript, Python or C++), and hit “Run” or “Submit”. Code is compiled and executed by Judge0; results stream back in real time. Your accepted submissions, verdicts and per-test-case details are stored per-user in Firestore. A personal dashboard shows total submissions, accepted count, problems solved, last submission time, and a little donut chart breaking down easy/medium/hard solves. Dark-mode is a single click away.

### What’s coming next

We’re in the middle of wiring up timed contests and global leaderboards.  A one-click “Pair me up” button will drop you into a shared editor with someone who’s working on the same problem.  We’re experimenting with GPT-powered hints that unlock step-by-step explanations only if you want them.  Mobile responsiveness needs love, and we plan to curate company-specific packs (FAANG, fintech, startup grind, etc.).  If there’s a feature you’d kill for, open an issue – road-map is fluid.

### Tech in a sentence

Front-end is React 18 with Vite and Tailwind v4; we use react-router and react-hot-toast for UX goodies.  Firestore stores problems, users and submissions; Firebase Auth handles login.  Judge0 (called via RapidAPI) is our compile-and-run sandbox.  Everything else is plain old Node + Express.

### Spinning it up locally

Clone the repo, copy `.env.example` to `.env` and drop in your Firebase keys plus a Judge0 RapidAPI key.  Run `npm install` in the root, then `npm install` inside `client`.  `npm run start` boots the server on port 5002; `npm run dev` inside `client` starts the Vite dev server on port 5173 with proxying set up, so the front-end can hit the back-end without CORS pain.

### Want to contribute?

Fork, create a small feature branch, make sure `npm run lint` passes and open a PR against `dev`.  Tiny focused PRs merge the fastest.  We love newcomer issues, docs fixes, and bold blue-sky features alike – just say hi in Discussions while the CI runs.

### License

MIT.  Use it, fork it, break it, improve it – just keep a link back so the next person can find the source.

Happy coding, and welcome to the Circle! 
