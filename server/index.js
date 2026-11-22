import { createServer } from 'node:http'

const port = Number(process.env.API_PORT || 3000)
const apiKey = process.env.METALS_DEV_API_KEY?.trim()
const spotCacheDuration = 8 * 60 * 60 * 1000
const historyCacheDuration = 7 * 24 * 60 * 60 * 1000
const troyOunceInGrams = 31.1034768

let spotCache = null
let historyCache = null

function sendJson(response, statusCode, body, origin) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(body))
}

function getAllowedOrigin(requestOrigin) {
  const configuredOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
  if (!requestOrigin) return configuredOrigin
  if (requestOrigin === configuredOrigin) return requestOrigin
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(requestOrigin)) return requestOrigin
  return configuredOrigin
}

function calculateKaratPrices(price24) {
  return [24, 22, 21, 18].map(karat => ({
    karat,
    price: Number((price24 * (karat / 24)).toFixed(3)),
  }))
}

async function fetchGoldPrices() {
  if (!apiKey) {
    const error = new Error('أضف METALS_DEV_API_KEY إلى ملف .env لتفعيل الأسعار المباشرة.')
    error.code = 'MISSING_API_KEY'
    throw error
  }

  if (spotCache && Date.now() - spotCache.savedAt < spotCacheDuration) return spotCache.data

  const endpoint = new URL('https://api.metals.dev/v1/metal/spot')
  endpoint.searchParams.set('api_key', apiKey)
  endpoint.searchParams.set('metal', 'gold')
  endpoint.searchParams.set('currency', 'JOD')

  const upstream = await fetch(endpoint, { headers: { Accept: 'application/json' } })
  const payload = await upstream.json()

  if (!upstream.ok || payload.status !== 'success' || !payload.rate?.price) {
    const error = new Error(payload.error_message || 'تعذر جلب سعر الذهب من مزود البيانات.')
    error.code = 'UPSTREAM_ERROR'
    throw error
  }

  const price24 = payload.rate.price / troyOunceInGrams
  const data = {
    currency: 'JOD',
    unit: 'g',
    timestamp: payload.timestamp,
    source: 'Metals.Dev',
    change: Number(payload.rate.change || 0),
    changePercent: Number(payload.rate.change_percent || 0),
    prices: calculateKaratPrices(price24),
  }

  spotCache = { data, savedAt: Date.now() }
  return data
}

function toDateString(date) {
  return date.toISOString().slice(0, 10)
}

async function fetchGoldHistory() {
  if (!apiKey) {
    const error = new Error('أضف METALS_DEV_API_KEY إلى ملف .env لتفعيل المخطط.')
    error.code = 'MISSING_API_KEY'
    throw error
  }

  if (historyCache && Date.now() - historyCache.savedAt < historyCacheDuration) return historyCache.data

  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setUTCDate(endDate.getUTCDate() - 29)

  const historyEndpoint = new URL('https://api.metals.dev/v1/timeseries')
  historyEndpoint.searchParams.set('api_key', apiKey)
  historyEndpoint.searchParams.set('start_date', toDateString(startDate))
  historyEndpoint.searchParams.set('end_date', toDateString(endDate))

  const currencyEndpoint = new URL('https://api.metals.dev/v1/currencies')
  currencyEndpoint.searchParams.set('api_key', apiKey)
  currencyEndpoint.searchParams.set('base', 'USD')

  const [historyResponse, currencyResponse] = await Promise.all([
    fetch(historyEndpoint, { headers: { Accept: 'application/json' } }),
    fetch(currencyEndpoint, { headers: { Accept: 'application/json' } }),
  ])
  const [historyPayload, currencyPayload] = await Promise.all([
    historyResponse.json(),
    currencyResponse.json(),
  ])

  if (!historyResponse.ok || historyPayload.status !== 'success' || !historyPayload.rates) {
    const error = new Error(historyPayload.error_message || 'تعذر جلب حركة الذهب التاريخية.')
    error.code = 'UPSTREAM_ERROR'
    throw error
  }

  const jodInUsd = Number(currencyPayload.currencies?.JOD)
  if (!currencyResponse.ok || currencyPayload.status !== 'success' || !jodInUsd) {
    const error = new Error(currencyPayload.error_message || 'تعذر تحويل الأسعار إلى الدينار الأردني.')
    error.code = 'UPSTREAM_ERROR'
    throw error
  }

  const usdToJod = 1 / jodInUsd
  const points = Object.entries(historyPayload.rates)
    .map(([date, rate]) => ({
      date,
      price24: Number(((rate.metals.gold / troyOunceInGrams) * usdToJod).toFixed(3)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const data = {
    currency: 'JOD',
    unit: 'g',
    source: 'Metals.Dev',
    generatedAt: new Date().toISOString(),
    points,
  }

  historyCache = { data, savedAt: Date.now() }
  return data
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`)
  const origin = getAllowedOrigin(request.headers.origin)

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {}, origin)
    return
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok' }, origin)
    return
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/gold-prices') {
    try {
      sendJson(response, 200, await fetchGoldPrices(), origin)
    } catch (error) {
      if (spotCache) {
        sendJson(response, 200, { ...spotCache.data, stale: true }, origin)
        return
      }
      sendJson(response, error.code === 'MISSING_API_KEY' ? 503 : 502, {
        error: error.code || 'GOLD_PRICE_ERROR',
        message: error.message,
      }, origin)
    }
    return
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/gold-history') {
    try {
      sendJson(response, 200, await fetchGoldHistory(), origin)
    } catch (error) {
      if (historyCache) {
        sendJson(response, 200, { ...historyCache.data, stale: true }, origin)
        return
      }
      sendJson(response, error.code === 'MISSING_API_KEY' ? 503 : 502, {
        error: error.code || 'GOLD_HISTORY_ERROR',
        message: error.message,
      }, origin)
    }
    return
  }

  sendJson(response, 404, { error: 'NOT_FOUND', message: 'المسار غير موجود.' }, origin)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`GOLDEN API ready at http://127.0.0.1:${port}`)
})
