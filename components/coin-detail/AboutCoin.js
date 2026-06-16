const styles = {
  container: `bg-[#171924] rounded-2xl p-6 md:p-8 mb-6 border border-gray-800/50`,
  title: `text-lg font-bold text-white mb-1`,
  subtitle: `text-gray-500 text-sm mb-6`,
  description: `text-gray-300 text-sm leading-relaxed mb-6`,
  linksGrid: `grid grid-cols-1 md:grid-cols-2 gap-3`,
  linkItem: `flex items-center gap-3 p-3 bg-[#222531]/40 rounded-xl border border-gray-800/30 hover:border-[#6188FF]/30 transition-colors cursor-pointer`,
  linkIcon: `w-8 h-8 rounded-lg bg-[#6188FF]/10 flex items-center justify-center text-[#6188FF] flex-shrink-0`,
  linkText: `flex-1 min-w-0`,
  linkLabel: `text-gray-500 text-xs`,
  linkValue: `text-white text-sm font-medium truncate`,
}

const AboutCoin = ({ coinData }) => {
  if (!coinData) return null

  const { links, description, categories, hashing_algorithm } = coinData
  const homepage = links?.homepage?.filter(Boolean)?.[0]
  const explorer = links?.blockchain_site?.filter(Boolean)?.[0]
  const github = links?.repos_url?.github?.filter(Boolean)?.[0]

  const hasDescription = description?.en && description.en.trim().length > 0
  const hasLinks = homepage || explorer || github || (categories && categories.length > 0)

  if (!hasDescription && !hasLinks && !hashing_algorithm) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>About {coinData.name}</h2>
      <p className={styles.subtitle}>Overview and useful links</p>

      {hashing_algorithm && (
        <div className='mb-4 flex items-center gap-2'>
          <span className='text-gray-500 text-sm'>Consensus:</span>
          <span className='text-white text-sm font-medium px-2 py-0.5 bg-[#222531] rounded-md'>{hashing_algorithm}</span>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {categories.filter(Boolean).slice(0, 4).map((cat, i) => (
            <span key={i} className='text-xs px-3 py-1 rounded-full bg-[#6188FF]/10 text-[#6188FF] border border-[#6188FF]/20'>
              {cat}
            </span>
          ))}
        </div>
      )}

      {hasDescription && (
        <div className={styles.description}>
          {(() => {
            const text = description.en
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
            return text.length > 600 ? text.substring(0, 600) + '...' : text
          })()}
        </div>
      )}

      {hasLinks && (
        <div className={styles.linksGrid}>
          {homepage && (
            <a href={homepage} target='_blank' rel='noopener noreferrer' className={styles.linkItem}>
              <div className={styles.linkIcon}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10' /><line x1='2' y1='12' x2='22' y2='12' /><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' /></svg>
              </div>
              <div className={styles.linkText}>
                <p className={styles.linkLabel}>Website</p>
                <p className={styles.linkValue}>{new URL(homepage).hostname}</p>
              </div>
            </a>
          )}
          {explorer && (
            <a href={explorer} target='_blank' rel='noopener noreferrer' className={styles.linkItem}>
              <div className={styles.linkIcon}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' /></svg>
              </div>
              <div className={styles.linkText}>
                <p className={styles.linkLabel}>Explorer</p>
                <p className={styles.linkValue}>{new URL(explorer).hostname}</p>
              </div>
            </a>
          )}
          {github && (
            <a href={github} target='_blank' rel='noopener noreferrer' className={styles.linkItem}>
              <div className={styles.linkIcon}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' /></svg>
              </div>
              <div className={styles.linkText}>
                <p className={styles.linkLabel}>Source Code</p>
                <p className={styles.linkValue}>{github.replace('https://github.com/', '')}</p>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default AboutCoin
