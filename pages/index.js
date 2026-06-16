import CMCtable from '../components/cmc-table/cmcTable'
import Header from '../components/header'

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='mt-10' />
      <CMCtable />
    </div>
  )
}
