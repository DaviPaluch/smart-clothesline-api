# 🧺 Varal Automático com Controle via MQTT

Este projeto implementa um **sistema de varal automático** controlado por um **Arduino** conectado a um **servidor Node.js**, utilizando o protocolo **MQTT** para comunicação.  
O objetivo é permitir que o varal **abra ou feche automaticamente**, conforme comandos enviados pelo backend, podendo futuramente ser integrado a sensores de chuva ou aplicativos web.

---

## 🧩 Arquitetura do Sistema

```

[ Node.js API ]  ⇄  [ Broker MQTT (Mosquitto) ]  ⇄  [ Arduino ]
↑
└── rotas REST (abrir/fechar)

```

- **Node.js (API Backend):** publica comandos MQTT (“abrir” ou “fechar”) no tópico `varal/acao`.
- **Broker MQTT (Mosquitto):** atua como intermediário entre o backend e o Arduino.
- **Arduino (ESP8266 / ESP32):** assina o tópico e executa a ação recebida, acionando o motor do varal.

---

## ⚙️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)
- [Mosquitto MQTT Broker](https://mosquitto.org/)
- [Arduino IDE](https://www.arduino.cc/en/software)
- [ESP8266 ou ESP32](https://www.espressif.com/)

---

## 🚀 Funcionalidades

- Controlar remotamente a abertura e fechamento do varal.
- Comunicação leve e rápida via MQTT.
- Código modular e escalável.
- Pronto para futura integração com sensores (chuva, luminosidade, etc.).

---

## 📂 Estrutura do Projeto

```

project/
├─ src/
│  └─ server.ts          # API principal em TypeScript
├─ dist/                 # Código compilado (gerado pelo TypeScript)
├─ arduino/
│  └─ varal.ino          # Código do Arduino (escuta o tópico MQTT)
├─ package.json
├─ tsconfig.json
└─ README.md

````

---

## 🔧 Instalação e Execução

### 1️⃣ Instalar dependências

```bash
yarn
````

### 2️⃣ Compilar o projeto

```bash
yarn build
```

### 3️⃣ Iniciar o servidor

```bash
yarn start
```

Ou em modo de desenvolvimento:

```bash
yarn dev
```

---

## 📡 Endpoints da API

| Método | Rota      | Descrição                      |
| :----- | :-------- | :----------------------------- |
| POST   | `/api/clothesline/:id/action/open`  | Envia comando MQTT para abrir  |
| POST   | `/api/clothesline/:id/action/close` | Envia comando MQTT para fechar |

### Exemplo de uso via cURL:

```bash
curl -X POST http://localhost:3000/api/clothesline/:id/action/open
curl -X POST http://localhost:3000/api/clothesline/:id/action/close
```

---

## 🤖 Código do Arduino (Exemplo)

O Arduino escuta o tópico `varal/acao` e executa uma ação simples:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "SEU_WIFI";
const char* password = "SENHA_WIFI";
const char* mqtt_server = "192.168.0.10"; // IP do servidor Node

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  String mensagem;
  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }

  Serial.print("Mensagem recebida: ");
  Serial.println(mensagem);

  if (mensagem == "OPEN") {
    Serial.println("🔓 Varal abrindo...");
    // lógica para acionar motor
  } else if (mensagem == "CLOSE") {
    Serial.println("🔒 Varal fechando...");
    // lógica para acionar motor
  }
}

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("VaralClient")) {
      client.subscribe("clothesline");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
}
```

---

## 🧠 Futuras Implementações

* Integração com **sensor de chuva** (abrir/fechar automaticamente).
* Interface Web para controle remoto.
* Histórico de acionamentos.
* Controle via assistente de voz (Google Home / Alexa).

---

## 🛠️ Requisitos

* Node.js ≥ 18
* Mosquitto instalado localmente
* Arduino com suporte a Wi-Fi (ESP8266 / ESP32)

---

## 📜 Licença

Este projeto é distribuído sob a licença MIT.
Sinta-se livre para usar, modificar e compartilhar.

---

## 👨‍💻 Autor

**Davi Paluch**
Desenvolvedor do projeto de automação residencial “Varal Inteligente”.

---

### 💡 Dica

Para testar rapidamente o fluxo:

1. Inicie o Mosquitto com `mosquitto -v`
2. Rode o servidor Node.js (`npm run dev`)
3. Abra o Serial Monitor do Arduino
4. Envie `POST /abrir` e `POST /fechar`
   → o Arduino exibirá os comandos recebidos

---
