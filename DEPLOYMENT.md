# 🚀 AgentProof — Deployment & Production Guide

This guide explains how to deploy **AgentProof** to **Vercel**, **Netlify**, **Render**, **Railway**, or any standard **Docker / Node.js** environment.

---

## 🔑 Key Deployment Feature: Zero External Dependencies

AgentProof requires **NO external API keys** (OpenAI, Anthropic, etc.) and **NO external cloud databases** (Firebase, Supabase, PostgreSQL).

- All cryptographic operations (ML-DSA-65 post-quantum + Ed25519 signatures, RFC 6962 transparency log, SHA-256 multihashes) run **locally on Node.js WebCrypto**.
- The project is 100% self-contained and ready for 1-click deployment.

---

## ⚡ Option 1: Deploying to Vercel (Recommended)

1. Push your code to your GitHub / GitLab repository.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Repository**.
3. Select the **AgentProof** repo.
4. Keep the default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **Deploy**. Vercel will automatically run `postinstall` to compile the local CooL SDK and build Next.js.

---

## 🌐 Option 2: Deploying to Netlify / Render / Railway

### Netlify
1. Connect your repository to Netlify.
2. Set **Build command**: `npm run build`
3. Set **Publish directory**: `.next`

### Render / Railway / Node.js Server
1. Clone the repository on your server.
2. Run:
   ```bash
   npm install
   npm run build
   npm run start
   ```
3. Your application will run live on `http://localhost:3000`.

---

## 🐳 Option 3: Docker Deployment

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY cool-sdk-repo ./cool-sdk-repo
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run the container:
```bash
docker build -t agentproof .
docker run -p 3000:3000 agentproof
```

---

## 🧪 Local Verification Before Deployment

To verify that your deployment build is clean before pushing:

```bash
# 1. Run local production build
npm run build

# 2. Start production server locally
npm run start
```

Visit `http://localhost:3000` to interact with the full live application.
