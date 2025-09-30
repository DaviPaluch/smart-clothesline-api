export const README_CONTENT = `
# 🏠 Varal Inteligente API

Sistema automatizado para controle de varal que se abre e fecha baseado na umidade do ar.

## ⚡ Funcionalidades

- 🎯 Controle automático baseado na umidade
- 📱 Controle manual via API
- 📊 Histórico de ações detalhado
- 🔍 Sistema de auditoria
- 📈 Estatísticas e relatórios

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js >= 18
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

\`\`\`bash
# Clone o repositório
git clone <repo-url>
cd varal-inteligente-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco
npm run db:migrate

# Gere o cliente Prisma
npm run db:generate
\`\`\`

## 🏃‍♂️ Execução

\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
\`\`\`

## 📡 Endpoints

### Varal
- \`POST /api/clothesline\` - Criar varal
- \`GET /api/clothesline/:id\` - Buscar varal
- \`PUT /api/clothesline/:id\` - Atualizar varal
- \`DELETE /api/clothesline/:id\` - Remover varal
- \`POST /api/clothesline/:id/action\` - Executar ação (abrir/fechar)
- \`GET /api/clothesline/:id/status\` - Status atual

### Logs de Ações
- \`GET /api/actions-log\` - Listar ações (com filtros e paginação)
- \`POST /api/actions-log\` - Registrar ação (Arduino)
- \`GET /api/actions-log/stats\` - Estatísticas

### Auditoria
- \`GET /api/audit-log\` - Logs de auditoria (com filtros e paginação)

## 🔧 Scripts Úteis

\`\`\`bash
# Visualizar banco de dados
npm run db:studio

# Reset do banco
npx prisma migrate reset

# Deploy das migrações
npx prisma migrate deploy
\`\`\`

## 📊 Estrutura do Projeto

\`\`\`
src/
├── controllers/     # Controladores das rotas
├── dtos/           # Data Transfer Objects
├── lib/            # Configurações (Prisma, etc.)
├── middleware/     # Middlewares da aplicação
├── routes/         # Definição das rotas
├── services/       # Lógica de negócio
├── types/          # Tipos TypeScript
├── utils/          # Utilitários
└── server.ts       # Ponto de entrada da aplicação
\`\`\`

## 🤝 Arduino Integration

### Enviar Comando para Arduino
\`\`\`typescript
// POST /api/clothesline/:id/action
{
  "action": "OPEN" | "CLOSE",
  "origin": "USER" | "ARDUINO" | "SYSTEM",
  "humidity": 65.5
}
\`\`\`

### Arduino Reportar Evento
\`\`\`typescript
// POST /api/actions-log
{
  "clotheslineId": "uuid",
  "actionType": "OPEN" | "CLOSE",
  "actionOrigin": "ARDUINO",
  "humidity": 85.2
}
\`\`\`

## 📈 Monitoramento

- Health check: \`GET /health\`
- Logs estruturados com Prisma
- Rate limiting configurado
- Validação robusta com Zod

## 🔒 Segurança

- Helmet.js para headers de segurança
- Rate limiting por IP
- Validação rigorosa de entrada
- CORS configurado
- Compressão gzip

## 🚀 Deploy

### Docker (Recomendado)

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### Variáveis de Ambiente
- \`DATABASE_URL\` - String de conexão PostgreSQL
- \`PORT\` - Porta da aplicação (padrão: 3000)
- \`NODE_ENV\` - Ambiente (development/production)
`;
