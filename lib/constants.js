// Contract Addresses from environment variables (Sepolia testnet ONLY)
// Never hardcode addresses — always use env vars
export const dogeAddress = process.env.NEXT_PUBLIC_DOGECOIN_ADDRESS || ''
export const linkAddress = process.env.NEXT_PUBLIC_LINK_ADDRESS || ''
export const daiAddress = process.env.NEXT_PUBLIC_DAI_ADDRESS || ''
export const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS || ''

// Sepolia Testnet Configuration
export const SEPOLIA_CHAIN_ID = 11155111
export const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'

// Supported networks — ONLY Sepolia
export const SUPPORTED_CHAINS = [
  {
    id: SEPOLIA_CHAIN_ID,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [SEPOLIA_RPC_URL] } },
    blockExplorers: { default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' } },
  },
]

// Faucet URLs for testnet ETH
export const SEPOLIA_FAUCETS = [
  { name: 'Alchemy Sepolia Faucet', url: 'https://sepoliafaucet.com' },
  { name: 'Infura Sepolia Faucet', url: 'https://www.infura.io/faucet/sepolia' },
  { name: 'PoW Faucet (Sepolia)', url: 'https://sepolia-faucet.pk910.de' },
]
