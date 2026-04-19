# --- ETAPA 1: Dependencias y Build ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile
RUN yarn prisma generate
COPY . .
RUN yarn build

# --- ETAPA 2: Ejecución (Runner) ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copiamos solo lo necesario para correr
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Corremos la versión compilada (más ligera)
CMD ["node", "dist/index.js"]
