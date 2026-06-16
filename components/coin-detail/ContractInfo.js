import { useState } from 'react'

const styles = {
  container: `bg-[#171924] rounded-2xl p-6 md:p-8 mb-6 border border-gray-800/50`,
  title: `text-lg font-bold text-white mb-4`,
  contractRow: `flex items-center justify-between p-4 bg-[#222531]/40 rounded-xl border border-gray-800/30`,
  contractAddress: `font-mono text-sm text-gray-300 max-w-[200px] md:max-w-[300px] truncate`,
  actions: `flex items-center gap-2`,
  iconBtn: `p-2 rounded-lg bg-[#222531] text-gray-400 hover:text-[#6188FF] hover:bg-[#2a2d3a] transition-all cursor-pointer`,
  copied: `text-[#16c784] text-xs font-medium`,
}

const ContractInfo = ({ coinData }) => {
  const [copied, setCopied] = useState(false)

  if (!coinData?.contract_address) return null

  const { contract_address, links, categories, hashing_algorithm } = coinData
  const explorerUrl = links?.blockchain_site?.filter(Boolean)?.[0]

  const copyAddress = () => {
    navigator.clipboard.writeText(contract_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contract Information</h2>
      <div className={styles.contractRow}>
        <div className='min-w-0 flex-1'>
          <p className='text-gray-500 text-xs mb-1'>Contract Address</p>
          <p className={styles.contractAddress}>{contract_address}</p>
          {hashing_algorithm && (
            <p className='text-gray-500 text-xs mt-1'>Standard: {hashing_algorithm}</p>
          )}
        </div>
        <div className={styles.actions}>
          {copied && <span className={styles.copied}>Copied!</span>}
          <button className={styles.iconBtn} onClick={copyAddress} title='Copy address'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='9' y='9' width='13' height='13' rx='2' ry='2' /><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' /></svg>
          </button>
          {explorerUrl && (
            <a href={explorerUrl} target='_blank' rel='noopener noreferrer' className={styles.iconBtn} title='View on explorer'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' /><polyline points='15 3 21 3 21 9' /><line x1='10' y1='14' x2='21' y2='3' /></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContractInfo
