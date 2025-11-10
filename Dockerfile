# -----------------------------
# 1️⃣ Etapa de build (TypeScript → JavaScript)
# -----------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas arquivos essenciais para instalar dependências
COPY package.json yarn.lock ./

# Instala dependências (sem devs globais)
RUN yarn install --frozen-lockfile

# Copia o restante do projeto
COPY . .

# Compila o TypeScript
RUN yarn build


# -----------------------------
# 2️⃣ Etapa final (imagem leve para produção)
# -----------------------------
FROM node:18-alpine

WORKDIR /app

# Copia apenas o que é necessário da etapa anterior
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

# Instala apenas dependências de produção
RUN yarn install --production --frozen-lockfile

# Define variáveis padrão (podem ser sobrescritas pelo docker-compose)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Comando padrão — pode ser sobrescrito no docker-compose
CMD ["node", "dist/server.js"]
