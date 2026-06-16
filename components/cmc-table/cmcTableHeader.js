import Info from '../../assets/svg/info'

const styles = {
  textIcon: `flex items-center`,
  sortableHeader: `cursor-pointer hover:text-[#6188FF] transition-colors select-none`,
}

const CMCtableHeader = ({ onSort, sortBy, sortDesc }) => {
  const headers = [
    { key: null, label: '' },
    { key: null, label: '#' },
    { key: null, label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'change_24h', label: '24h %' },
    { key: null, label: '7d %' },
    { key: 'market_cap', label: 'Market Cap', info: true },
    { key: 'volume', label: 'Volume(24h)', info: true },
    { key: null, label: 'Circulating Supply', info: true },
    { key: null, label: 'Last 7 days' },
  ]

  return (
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} className={h.key ? styles.sortableHeader : ''} onClick={() => h.key && onSort(h.key)}>
            <div className={styles.textIcon}>
              <p className='mr-2'>{h.label}</p>
              {h.info && <Info size={15} />}
              {h.key && sortBy === h.key && <span className='text-xs text-[#6188FF]'>{sortDesc ? '↓' : '↑'}</span>}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default CMCtableHeader
