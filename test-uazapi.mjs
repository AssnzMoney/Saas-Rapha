import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envVars[match[1].trim()] = match[2].trim()
})

const UAZAPI_URL = (envVars.UAZAPI_URL || envVars.UAZAPI_BASE_URL)?.replace(/\/$/, '')
const UAZAPI_KEY = envVars.UAZAPI_GLOBAL_API_KEY

async function testUazapi() {
  try {
    const instanceName = 'test-instance-123'
    
    console.log('1. Criando instância com admintoken...')
    const createRes = await fetch(`${UAZAPI_URL}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admintoken': UAZAPI_KEY
      },
      body: JSON.stringify({
        instanceName: instanceName,
        Name: instanceName,
        name: instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      })
    })
    console.log('Create Status:', createRes.status)
    const createBody = await createRes.text()
    console.log('Create Body:', createBody)

    // Extrair token
    let instanceToken = UAZAPI_KEY
    try {
      const parsed = JSON.parse(createBody)
      if (parsed.hash?.apikey) instanceToken = parsed.hash.apikey
      if (parsed.token) instanceToken = parsed.token
    } catch(e) {}

    console.log('2. Buscando QR Code com token:', instanceToken)
    const qrRes = await fetch(`${UAZAPI_URL}/instance/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admintoken': UAZAPI_KEY,
        'token': instanceToken
      },
      body: JSON.stringify({})
    })
    console.log('QR Status:', qrRes.status)
    const qrBody = await qrRes.text()
    console.log('QR Body (primeiros 500 chars):', qrBody.substring(0, 500))

  } catch (err) {
    console.error('ERRO na requisição:', err.message)
  }
}

testUazapi()
