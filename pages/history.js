import Header from '../components/header'
import TransactionHistory from '../components/TransactionHistory'

const styles = {
  page: `min-h-screen bg-[#17171A]`,
  container: `max-w-4xl mx-auto px-4 py-8`,
}

const HistoryPage = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <TransactionHistory />
      </div>
    </div>
  )
}

export default HistoryPage
