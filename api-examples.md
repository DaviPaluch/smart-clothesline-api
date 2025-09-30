
# 🔌 Exemplos de Uso da API - Varal Inteligente

## 📋 Configuração Inicial

### 1. Criar Varal
```bash
curl -X POST http://localhost:3000/api/clothesline \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Varal da Área de Serviço"
  }'
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Varal da Área de Serviço",
  "status": "CLOSED",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🎮 Controle Manual

### 2. Abrir Varal (Controle Manual)
```bash
curl -X POST http://localhost:3000/api/clothesline/550e8400-e29b-41d4-a716-446655440000/action \
  -H "Content-Type: application/json" \
  -d '{
    "action": "OPEN",
    "origin": "USER",
    "humidity": 45.5
  }'
```

**Resposta:**
```json
{
  "clothesline": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Varal da Área de Serviço",
    "status": "OPEN",
    "updatedAt": "2024-01-15T14:25:30.000Z"
  },
  "message": "Clothesline opened successfully"
}
```

### 3. Fechar Varal (Controle Manual)
```bash
curl -X POST http://localhost:3000/api/clothesline/550e8400-e29b-41d4-a716-446655440000/action \
  -H "Content-Type: application/json" \
  -d '{
    "action": "CLOSE",
    "origin": "USER"
  }'
```

## 🤖 Integração Arduino

### 4. Arduino Reportando Fechamento por Chuva
```bash
curl -X POST http://localhost:3000/api/actions-log \
  -H "Content-Type: application/json" \
  -d '{
    "clotheslineId": "550e8400-e29b-41d4-a716-446655440000",
    "actionType": "CLOSE",
    "actionOrigin": "ARDUINO",
    "humidity": 85.2
  }'
```

**Resposta:**
```json
{
  "id": "660f9500-f3ac-42e5-b827-556766550000",
  "actionType": "CLOSE",
  "actionOrigin": "ARDUINO",
  "humidity": 85.2,
  "createdAt": "2024-01-15T16:45:20.000Z",
  "clothesline": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Varal da Área de Serviço",
    "status": "CLOSED"
  }
}
```

### 5. Arduino Reportando Abertura Automática
```bash
curl -X POST http://localhost:3000/api/actions-log \
  -H "Content-Type: application/json" \
  -d '{
    "clotheslineId": "550e8400-e29b-41d4-a716-446655440000",
    "actionType": "OPEN",
    "actionOrigin": "ARDUINO",
    "humidity": 35.8
  }'
```

## 📊 Consultas e Monitoramento

### 6. Verificar Status Atual
```bash
curl http://localhost:3000/api/clothesline/550e8400-e29b-41d4-a716-446655440000/status
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Varal da Área de Serviço",
  "status": "OPEN",
  "lastActions": [
    {
      "id": "770fa600-g4bd-43f6-c938-667877660000",
      "actionType": "OPEN",
      "actionOrigin": "ARDUINO",
      "humidity": 35.8,
      "createdAt": "2024-01-15T18:20:15.000Z"
    },
    {
      "id": "660f9500-f3ac-42e5-b827-556766550000",
      "actionType": "CLOSE",
      "actionOrigin": "ARDUINO",
      "humidity": 85.2,
      "createdAt": "2024-01-15T16:45:20.000Z"
    }
  ]
}
```

### 7. Histórico de Ações (com Paginação)
```bash
curl "http://localhost:3000/api/actions-log?page=1&limit=5&clotheslineId=550e8400-e29b-41d4-a716-446655440000"
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "770fa600-g4bd-43f6-c938-667877660000",
      "actionType": "OPEN",
      "actionOrigin": "ARDUINO",
      "humidity": 35.8,
      "createdAt": "2024-01-15T18:20:15.000Z",
      "clothesline": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Varal da Área de Serviço",
        "status": "OPEN"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 15,
    "totalPages": 3
  }
}
```

### 8. Filtrar Ações por Data
```bash
curl "http://localhost:3000/api/actions-log?startDate=2024-01-15T00:00:00.000Z&endDate=2024-01-15T23:59:59.999Z&actionOrigin=ARDUINO"
```

### 9. Estatísticas de Uso
```bash
curl "http://localhost:3000/api/actions-log/stats?clotheslineId=550e8400-e29b-41d4-a716-446655440000"
```

**Resposta:**
```json
{
  "total": 42,
  "byAction": {
    "open": 21,
    "close": 21
  },
  "byOrigin": {
    "user": 8,
    "arduino": 32,
    "system": 2
  }
}
```

## 🔧 Administração

### 10. Atualizar Nome do Varal
```bash
curl -X PUT http://localhost:3000/api/clothesline/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Varal Principal - Área Externa"
  }'
```

### 11. Logs de Auditoria
```bash
curl "http://localhost:3000/api/audit-log?tableName=Clothesline&action=UPDATE"
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "880gb700-h5ce-44g7-d049-778988770000",
      "tableName": "Clothesline",
      "recordId": "550e8400-e29b-41d4-a716-446655440000",
      "action": "UPDATE",
      "oldData": {
        "name": "Varal da Área de Serviço"
      },
      "newData": {
        "name": "Varal Principal - Área externa"
      },
      "createdAt": "2024-01-15T20:15:30.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## 🏥 Health Check
```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T21:30:45.123Z"
}
```

## 🚨 Códigos de Erro Comuns

### 400 - Validação
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_enum_value",
      "expected": ["OPEN", "CLOSE"],
      "received": "TOGGLE",
      "path": ["action"]
    }
  ]
}
```

### 404 - Recurso Não Encontrado
```json
{
  "error": "Clothesline not found"
}
```

### 409 - Conflito (Ex: nome duplicado)
```json
{
  "error": "Unique constraint violation",
  "details": {
    "target": ["name"]
  }
}
```

## 📱 Simulação de Cenários

### Cenário 1: Dia Ensolarado → Chuva → Sol
```bash
# 1. Arduino detecta baixa umidade (sol) - abre
curl -X POST http://localhost:3000/api/actions-log \
  -H "Content-Type: application/json" \
  -d '{"clotheslineId": "550e8400-e29b-41d4-a716-446655440000", "actionType": "OPEN", "actionOrigin": "ARDUINO", "humidity": 30.5}'

# 2. Arduino detecta alta umidade (chuva) - fecha
curl -X POST http://localhost:3000/api/actions-log \
  -H "Content-Type: application/json" \
  -d '{"clotheslineId": "550e8400-e29b-41d4-a716-446655440000", "actionType": "CLOSE", "actionOrigin": "ARDUINO", "humidity": 90.2}'

# 3. Arduino detecta baixa umidade novamente (sol voltou) - abre
curl -X POST http://localhost:3000/api/actions-log \
  -H "Content-Type: application/json" \
  -d '{"clotheslineId": "550e8400-e29b-41d4-a716-446655440000", "actionType": "OPEN", "actionOrigin": "ARDUINO", "humidity": 28.7}'
```

### Cenário 2: Usuário Force Override
```bash
# 1. Usuário força fechamento mesmo com baixa umidade
curl -X POST http://localhost:3000/api/clothesline/550e8400-e29b-41d4-a716-446655440000/action \
  -H "Content-Type: application/json" \
  -d '{"action": "CLOSE", "origin": "USER", "humidity": 25.0}'

# 2. Verificar status
curl http://localhost:3000/api/clothesline/550e8400-e29b-41d4-a716-446655440000/status
```

## 📊 Queries Úteis para Análise

### Ações das Últimas 24h
```bash
START_DATE=$(date -u -d '1 day ago' +%Y-%m-%dT%H:%M:%S.000Z)
END_DATE=$(date -u +%Y-%m-%dT%H:%M:%S.999Z)

curl "http://localhost:3000/api/actions-log?startDate=${START_DATE}&endDate=${END_DATE}"
```

### Apenas Ações Automáticas do Arduino
```bash
curl "http://localhost:3000/api/actions-log?actionOrigin=ARDUINO&limit=20"
```

### Todas as Vezes que Fechou por Chuva (umidade > 80)
```bash
curl "http://localhost:3000/api/actions-log?actionType=CLOSE&actionOrigin=ARDUINO" | jq '.data[] | select(.humidity > 80)'
```

Este conjunto de exemplos mostra como integrar completamente o Arduino com a API e como monitorar o sistema em tempo real!