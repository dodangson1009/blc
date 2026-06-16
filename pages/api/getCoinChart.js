import { fetchWithRetry, getCoinGeckoUrl } from '../../lib/apiUtils'

// Base prices for mock chart generation (only used when CoinGecko API is unavailable)
const MOCK_BASE_PRICES = {
  bitcoin: 105432, ethereum: 3821, tether: 1.0,
  binancecoin: 652, solana: 179, 'usd-coin': 1.0,
  ripple: 2.34, dogecoin: 0.234, cardano: 0.78, tron: 0.278,
}

// Generate mock price chart data on demand (not at module load)
const generateMockChart = (id, days = 7) => {
  const basePrice = MOCK_BASE_PRICES[id] || 100
  const prices = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  let price = basePrice * 0.95
  for (let i = days; i >= 0; i--) {
    price = price + (Math.random() - 0.45) * (basePrice * 0.02)
    prices.push([now - i * dayMs, Math.round(price * 100) / 100])
  }
  return { prices }
}

export default async function handler(req, res) {
  const { id, days = 7 } = req.query
  if (!id) return res.status(400).json({ error: 'Coin ID is required' })

  try {
    const url = getCoinGeckoUrl(`/coins/${id}/market_chart`, {
      vs_currency: 'usd',
      days,
      interval: days <= 1 ? 'hourly' : 'daily',
    })

    const response = await fetchWithRetry(url)
    const data = await response.json()

    // Check for CoinGecko API errors
    if (data.error || !data.prices) {
      console.log(`CoinGecko chart API unavailable for ${id}, using mock data`)
      if (MOCK_BASE_PRICES[id]) {
        return res.status(200).json({ data: generateMockChart(id, Number(days)), mock: true })
      }
      return res.status(404).json({ error: 'Chart data not found' })
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('getCoinChart error, using mock data:', error.message)
    if (MOCK_BASE_PRICES[id]) {
      return res.status(200).json({ data: generateMockChart(id, Number(days)), mock: true })
    }
    res.status(500).json({ error: 'Failed to load chart data' })
  }
}
