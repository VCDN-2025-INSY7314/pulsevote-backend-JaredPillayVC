# PulseVote Backend

A minimal, secure-ready REST API for the PulseVote project.
Stack: Node.js + Express, with Helmet, CORS, and basic rate limiting.
This service exposes a health route (/) and a JSON test route (/test) to support the frontend during setup.

✨ **Features**

- Express app with JSON body parsing
- Security headers via helmet
- CORS enabled (configure per environment)
- Rate limiting (per-IP; tune as needed)
- Ready for MongoDB integration (Mongoose placeholder)
- Simple health & test endpoints

📦 **Prerequisites**

- Node.js 18+ (works on 20/22 as well)
- npm 8+
- (Optional) MongoDB URI when you add persistence

🚀 **Quick Start**

```sh
# clone the repo
git clone https://github.com/<org>/<pulsevote-backend-JaredPillayVC>.git
cd pulsevote-backend-JaredPillayVC/pulsevote-backend

# install dependencies
npm install

# create env file
cp .env.example .env   # if provided; otherwise create manually (see below)

# run in dev (nodemon)
npm run dev
# or run without nodemon
npm start
```

Open:

- http://localhost:5000/
  → PulseVote API running!
- http://localhost:5000/test
  → JSON { message, status, ts }

⚙️ **Environment Variables**

Create a `.env` file in `pulsevote-backend/`:

```
PORT=5000
# MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

Ensure `.env` is not committed (listed in `.gitignore`).

🧭 **Scripts**

`package.json`:

```
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

- `npm run dev` — auto-restarts on file changes
- `npm start` — runs the server once

🔐 **Security Hygiene (baseline)**

- `helmet()` — security headers
- `cors()` — currently permissive; restrict origin to your frontend URL in production
- `express-rate-limit` — basic anti-spam / anti-bot throttle
- `dotenv` — keep secrets out of source control
- (Upcoming) JWT & session hardening, input validation with express-validator, Mongo sanitize, etc.

🧪 **Endpoints**

**GET /**

Health check.

cURL

```sh
curl -i http://localhost:5000/
```

**GET /test**

Simple JSON response for frontend connectivity.

cURL

```sh
curl -s http://localhost:5000/test | jq
```

🧰 **Dependency Audit**

```sh
npm audit
npm audit fix
```

### SSL/TLS Research & Local HTTPS Setup (PulseVote)

SSL/TLS is the cryptographic protocol that secures data in transit between clients and servers, giving us confidentiality, integrity, and server authenticity over HTTPS instead of plaintext HTTP. Modern browsers now call out non-HTTPS sites as “Not secure”, which nudges the whole web to adopt encryption by default and protects users from passive snooping and tampering on open networks.