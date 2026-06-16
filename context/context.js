import { createContext, useState, useCallback, useMemo } from 'react'

export const CoinMarketContext = createContext({})

export const CoinMarketProvider = ({ children }) => {
  const [isMockData, setIsMockData] = useState(false)

  const getTopTenCoins = useCallback(async () => {
    try {
      setIsMockData(false)
      const res = await fetch('/api/getTopTen')
      const data = await res.json()
      setIsMockData(!!data?.mock)
      return data?.data?.data || []
    } catch (e) {
      console.log(e.message)
      setIsMockData(true)
      return []
    }
  }, [])

  const value = useMemo(
    () => ({ getTopTenCoins, isMockData }),
    [getTopTenCoins, isMockData]
  )

  return (
    <CoinMarketContext.Provider value={value}>
      {children}
    </CoinMarketContext.Provider>
  )
}
