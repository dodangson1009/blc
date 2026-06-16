import '../styles/globals.css'
import { CoinMarketProvider } from '../context/context'
import WalletProvider from '../components/WalletProvider'

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <CoinMarketProvider>
        <Component {...pageProps} />
      </CoinMarketProvider>
    </WalletProvider>
  )
}

export default MyApp
