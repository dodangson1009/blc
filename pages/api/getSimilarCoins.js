import { fetchWithRetry, getCoinGeckoUrl } from '../../lib/apiUtils'

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Coin ID is required' })

  try {
    const url = getCoinGeckoUrl(`/coins/${id}/market_chart`, {
      vs_currency: 'usd',
      days: 1,
    })

    const response = await fetchWithRetry(url)
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch similar coins' })
    }

    const data = await response.json()
    res.status(200).json({ data })
  } catch (error) {
    console.error('getSimilarCoins error:', error.message)
    res.status(500).json({ error: error.message })
  }
}
