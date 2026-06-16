// Fallback mock data when API key is missing or API fails
const MOCK_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', cmc_rank: 1, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', circulating_supply: 19600000, total_supply: 21000000, quote: { USD: { price: 105432.12, market_cap: 2066000000000, volume_24h: 28500000000, percent_change_24h: 2.34, percent_change_7d: 5.12 } } },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', cmc_rank: 2, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', circulating_supply: 120200000, total_supply: 120200000, quote: { USD: { price: 3821.45, market_cap: 459000000000, volume_24h: 15200000000, percent_change_24h: -1.12, percent_change_7d: 3.45 } } },
  { id: 'tether', name: 'Tether', symbol: 'USDT', cmc_rank: 3, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', circulating_supply: 112000000000, total_supply: 112000000000, quote: { USD: { price: 1.0, market_cap: 112000000000, volume_24h: 52000000000, percent_change_24h: 0.01, percent_change_7d: 0.02 } } },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', cmc_rank: 4, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', circulating_supply: 145000000, total_supply: 200000000, quote: { USD: { price: 652.3, market_cap: 94600000000, volume_24h: 1800000000, percent_change_24h: 1.87, percent_change_7d: 4.21 } } },
  { id: 'solana', name: 'Solana', symbol: 'SOL', cmc_rank: 5, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', circulating_supply: 440000000, total_supply: 590000000, quote: { USD: { price: 178.92, market_cap: 78700000000, volume_24h: 3200000000, percent_change_24h: -2.45, percent_change_7d: 1.89 } } },
  { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC', cmc_rank: 6, image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', circulating_supply: 34000000000, total_supply: 34000000000, quote: { USD: { price: 1.0, market_cap: 34000000000, volume_24h: 8500000000, percent_change_24h: 0.0, percent_change_7d: 0.01 } } },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', cmc_rank: 7, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', circulating_supply: 57000000000, total_supply: 100000000000, quote: { USD: { price: 2.34, market_cap: 13300000000, volume_24h: 2100000000, percent_change_24h: 3.21, percent_change_7d: 7.65 } } },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', cmc_rank: 8, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', circulating_supply: 144000000000, total_supply: 144000000000, quote: { USD: { price: 0.234, market_cap: 33700000000, volume_24h: 1500000000, percent_change_24h: -0.89, percent_change_7d: 2.34 } } },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', cmc_rank: 9, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', circulating_supply: 36000000000, total_supply: 45000000000, quote: { USD: { price: 0.78, market_cap: 28100000000, volume_24h: 890000000, percent_change_24h: 4.56, percent_change_7d: 8.91 } } },
  { id: 'tron', name: 'TRON', symbol: 'TRX', cmc_rank: 10, image: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png', circulating_supply: 86000000000, total_supply: 86000000000, quote: { USD: { price: 0.278, market_cap: 23900000000, volume_24h: 780000000, percent_change_24h: 1.12, percent_change_7d: 3.78 } } },
]

export default function handler(req, res) {
  const getData = async () => {
    try {
      const apiKey = process.env.NEXT_BACKEND_CMC_API_KEY
      if (!apiKey) {
        console.log('No CMC API key found, using mock data')
        return res.status(200).json({ data: { data: MOCK_COINS }, mock: true })
      }

      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${apiKey}`,
        {
          method: 'GET',
          headers: { Accept: '*/*' },
        },
      )

      const data = await response.json()

      // CoinMarketCap returns HTTP 200 even with invalid keys — check body for errors
      // Raw CMC response: {status: {error_code, error_message}, data: [...]
      if (data?.status?.error_code || !data?.data) {
        console.log('CMC API returned error, using mock data:', data?.status?.error_message || 'No data')
        return res.status(200).json({ data: { data: MOCK_COINS }, mock: true })
      }

      // Wrap in {data: ...} to match expected client format
      res.status(200).json({ data })
    } catch (e) {
      console.log('CMC API error, using mock data:', e.message)
      res.status(200).json({ data: { data: MOCK_COINS }, mock: true })
    }
  }

  getData()
}
