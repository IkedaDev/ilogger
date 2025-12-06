# --- ETAPA 1: Dependencias ---
FROM node:20-alpine AS deps

WORKDIR /app

# 1. Copiamos archivos de dependencias
COPY package.json yarn.lock ./
# 2. Copiamos la carpeta prisma (necesaria para generar el cliente)
COPY prisma ./prisma/

# 3. Instalamos dependencias
RUN yarn install --frozen-lockfile

# 4. Generamos el cliente de Prisma (Vital)
RUN yarn prisma generate

# --- ETAPA 2: Ejecución (Runner) ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copiamos lo preparado en la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el código fuente
COPY . .

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Exponemos el puerto interno de la API
EXPOSE 3000

# Ejecutamos directamente con tsx (sin compilar a JS)
CMD ["npx", "tsx", "src/index.ts"]