const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-[#222531] rounded-lg animate-pulse ${className}`} />
)

export const HeroSkeleton = () => (
  <div className='bg-[#171924] rounded-xl p-6 mb-6'>
    <div className='flex items-center gap-4 mb-6'>
      <SkeletonBlock className='w-16 h-16 rounded-full' />
      <div className='space-y-2'>
        <SkeletonBlock className='w-48 h-8' />
        <SkeletonBlock className='w-24 h-5' />
      </div>
    </div>
    <SkeletonBlock className='w-64 h-12 mb-6' />
    <div className='flex gap-3 mb-6'>
      <SkeletonBlock className='w-20 h-8 rounded-full' />
      <SkeletonBlock className='w-20 h-8 rounded-full' />
      <SkeletonBlock className='w-20 h-8 rounded-full' />
    </div>
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {[...Array(4)].map((_, i) => (
        <SkeletonBlock key={i} className='h-20 rounded-lg' />
      ))}
    </div>
  </div>
)

export const ChartSkeleton = () => (
  <div className='bg-[#171924] rounded-xl p-6 mb-6'>
    <div className='flex items-center justify-between mb-4'>
      <SkeletonBlock className='w-32 h-6' />
      <div className='flex gap-2'>
        {[...Array(5)].map((_, i) => (
          <SkeletonBlock key={i} className='w-12 h-8 rounded-lg' />
        ))}
      </div>
    </div>
    <SkeletonBlock className='w-full h-[400px] rounded-lg' />
  </div>
)

export const StatsSkeleton = () => (
  <div className='bg-[#171924] rounded-xl p-6 mb-6'>
    <SkeletonBlock className='w-40 h-6 mb-4' />
    <div className='space-y-1'>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='flex justify-between py-3 border-b border-gray-800/50'>
          <SkeletonBlock className='w-32 h-4' />
          <SkeletonBlock className='w-24 h-4' />
        </div>
      ))}
    </div>
  </div>
)

export const SidebarSkeleton = () => (
  <div className='space-y-6'>
    <div className='bg-[#171924] rounded-xl p-6'>
      <SkeletonBlock className='w-32 h-6 mb-4' />
      {[...Array(4)].map((_, i) => (
        <div key={i} className='flex items-center gap-3 p-3 mb-2'>
          <SkeletonBlock className='w-8 h-8 rounded-full' />
          <SkeletonBlock className='flex-1 h-4' />
          <SkeletonBlock className='w-16 h-4' />
        </div>
      ))}
    </div>
  </div>
)
