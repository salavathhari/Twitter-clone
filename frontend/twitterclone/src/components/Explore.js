import React from 'react';

const Tab = ({ active, children }) => (
  <button className={`px-3 py-3 font-semibold text-sm relative hover:bg-white/10 transition ${active ? 'text-white after:content-["" ] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:bg-twitter after:rounded-full' : 'text-white/60'}`}>
    {children}
  </button>
);

const Explore = () => {
  return (
    <div className='text-white'>
      {/* Search */}
      <div className='px-4 pt-3'>
        <input
          placeholder='Search'
          className='w-full bg-white/10 border border-white/10 rounded-full px-4 py-2 outline-none placeholder-white/60'
        />
      </div>

      {/* Tabs */}
      <div className='flex px-2 mt-2 border-b border-white/10'>
        <Tab active>For You</Tab>
        <Tab>Trending</Tab>
        <Tab>News</Tab>
        <Tab>Sports</Tab>
        <Tab>Entertainment</Tab>
      </div>

      {/* Hero card */}
      <div className='px-4 mt-4'>
        <div className='relative rounded-xl overflow-hidden border border-white/10'>
          <div className='aspect-[16/9] w-full bg-white/10 flex items-center justify-center'>
            <div className='text-white/60'>Hero image</div>
          </div>
          <div className='absolute left-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent w-full'>
            <div className='text-2xl font-extrabold'>Rushmore</div>
            <div className='text-xs text-white/80 mt-1'>LIVE</div>
          </div>
        </div>
      </div>

      {/* Today's News */}
      <div className='px-4 mt-6'>
        <h2 className='text-xl font-extrabold mb-3'>Today&apos;s News</h2>
        <div className='space-y-5'>
          {[1,2,3].map((i) => (
            <div key={i} className='flex gap-3'>
              <div className='flex-1'>
                <div className='font-bold text-[17px] leading-snug'>
                  {i === 1 && 'Modi Visits Andhra Pradesh to Pray at Srisailam Temple and Launch Rs 13,430 Crore Projects'}
                  {i === 2 && 'Prabhas Fans Gear Up for Salaar and Six Films\' Re-Release on 46th Birthday'}
                  {i === 3 && 'Hyderabad Weather Sees Drizzle Ahead of Festival Week'}
                </div>
                <div className='text-white/60 text-xs mt-1'>
                  {i === 1 && '7 hours ago · News · 10K posts'}
                  {i === 2 && '9 hours ago · Entertainment · 1.6K posts'}
                  {i === 3 && '3 hours ago · Local · 2.1K posts'}
                </div>
              </div>
              <div className='w-28 h-20 rounded-xl overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center'>
                <span className='text-white/40 text-xs'>Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
