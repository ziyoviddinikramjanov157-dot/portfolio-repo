# Build from the repository root:  docker build -f bosmenti-server/Dockerfile .
# (docker-compose.yml in this folder already does that)

# Build stages run on Debian: Rollup (used by Vite) fails on Alpine with "Code is nested too deeply".

# 1) shop and admin pages
FROM node:22-bookworm-slim AS web
WORKDIR /web
COPY bosmenti-app/package.json bosmenti-app/package-lock.json ./
RUN npm ci
COPY bosmenti-app/ ./
RUN npm run build

# 2) API server
FROM node:22-bookworm-slim AS api
WORKDIR /api
COPY bosmenti-server/package.json bosmenti-server/package-lock.json ./
RUN npm ci
COPY bosmenti-server/tsconfig.json ./
COPY bosmenti-server/src ./src
RUN npm run build && npm prune --omit=dev

# 3) what runs on the server
FROM node:22-alpine
ENV NODE_ENV=production PORT=3000 STATIC_DIR=/app/site UPLOAD_DIR=/app/uploads
WORKDIR /app/server
COPY bosmenti-server/package.json ./
COPY bosmenti-server/migrations ./migrations
COPY --from=api /api/node_modules ./node_modules
COPY --from=api /api/dist ./dist
COPY --from=web /web/dist /app/site
RUN mkdir -p /app/uploads && chown node:node /app/uploads
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "dist/index.js"]
