import dotenv from 'dotenv'
import mqtt, {MqttClient} from 'mqtt'

dotenv.config()

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883'
const client:MqttClient = mqtt.connect(brokerUrl)

client.on('connect', () => {
  console.log('✅ Conectado ao broker MQTT:', brokerUrl)

  // Se inscreve em um ou mais tópicos
  const topics = ['clothesline']
  client.subscribe(topics, (err) => {
    if (err) {
      console.error('❌ Erro ao se inscrever nos tópicos:', err)
    } else {
      console.log('📡 Inscrito nos tópicos:', topics.join(', '))
    }
  })
})

// Escuta mensagens recebidas
client.on('message', (topic, message) => {
  const payload = message.toString()
  console.log(`📥 Mensagem recebida em "${topic}": ${payload}`)

  // Exemplo: processar conforme o tópico
  if (topic === 'test_sensor_data') {
    // Aqui você poderia salvar no banco, emitir via socket etc.
    console.log('💾 Salvando no banco simulado:', payload)
  }
})

client.on('error', (err) => {
  console.error('❌ Erro na conexão MQTT:', err)
})

export default client
