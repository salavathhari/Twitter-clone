import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Card = ({ title, children, dismissable, showLiveIndicator }) => (
  <div className='p-4 bg-[#0b0b0b] border border-white/10 rounded-2xl my-4'>
    <div className='flex items-center justify-between mb-3'>
      <div className='flex items-center gap-2'>
        <h2 className='font-extrabold text-lg'>{title}</h2>
        {showLiveIndicator && (
          <span className='flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
          </span>
        )}
      </div>
      {dismissable && <button className='text-white/60 hover:text-white text-xl' aria-label='Dismiss'>×</button>}
    </div>
    <div>{children}</div>
  </div>
);

const RightSidebar = () => {
  const location = useLocation();
  const onProfile = location.pathname.startsWith('/profile/');
  const { otherUsers } = useSelector(s => s.user);
  return (
    <div className='w-full sticky top-0 text-white'>
      <div className='flex items-center p-2 bg-white/10 rounded-full outline-none w-full mt-2'>
        <CiSearch size="20px" />
        <input type="text" className='bg-transparent outline-none px-2 placeholder-white/60' placeholder='Search' />
      </div>

      {onProfile ? (
        <>
          <Card title="You might like" showLiveIndicator={true}>
            <div className='space-y-4'>
              {otherUsers?.slice(0,3).map(u => (
                <div key={u._id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <img src={u.avatar || '/logo192.png'} className='w-10 h-10 rounded-full object-cover' alt={u.name} />
                    <div>
                      <div className='font-bold flex items-center gap-1'>
                        {u.name}
                        <span className='text-twitter'>✓</span>
                      </div>
                      <div className='text-white/60 text-sm'>@{u.username}</div>
                    </div>
                  </div>
                  <Link to={`/profile/${u._id}`} className='px-3 py-1 rounded-full bg-white text-black font-bold'>Follow</Link>
                </div>
              ))}
              <button className='text-twitter hover:underline text-sm mt-1'>Show more</button>
            </div>
          </Card>

          <Card title="What’s happening">
            <div className='space-y-3 text-sm'>
              <div className='hover:bg-white/5 p-2 rounded-lg cursor-pointer'>
                <div className='font-bold'>Rushmore</div>
                <div className='text-white/60 text-xs'>LIVE</div>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card title='Subscribe to Premium'>
            <p className='text-white/70 text-sm'>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
            <button className='mt-3 px-4 py-2 bg-twitter rounded-full font-bold'>Subscribe</button>
          </Card>
          <Card title='Today’s News' dismissable>
            <ul className='space-y-4 text-sm'>
              <li className='hover:bg-white/5 p-2 rounded-lg cursor-pointer'>
                <div className='font-bold'>Indian Cricket Team Departs for Australia ODI Series with Rohit Sharma and Virat ...</div>
                <div className='text-white/60 text-xs mt-1'>14 hours ago · Sports · 20.7K posts</div>
              </li>
              <li className='hover:bg-white/5 p-2 rounded-lg cursor-pointer'>
                <div className='font-bold'>Pakistan-Taliban Clashes Kill Dozens Along Durand Line, Yield 48-Hour Ceasefire</div>
                <div className='text-white/60 text-xs mt-1'>2 days ago · News · 66.8K posts</div>
              </li>
              <li className='hover:bg-white/5 p-2 rounded-lg cursor-pointer'>
                <div className='font-bold'>Ahmedabad Recommended to Host 2030 Commonwealth Games Over Nigeria</div>
                <div className='text-white/60 text-xs mt-1'>5 hours ago · Sports · 7,559 posts</div>
              </li>
            </ul>
          </Card>
          <Card title='What’s happening'>
            <div className='space-y-3 text-sm'>
              <div className='hover:bg-white/5 p-2 rounded-lg cursor-pointer'>
                <div className='font-bold'>Rushmore</div>
                <div className='text-white/60 text-xs'>LIVE</div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default RightSidebar