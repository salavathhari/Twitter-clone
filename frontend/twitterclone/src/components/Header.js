import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import Avatar from 'react-avatar';
import TweetComposer from './TweetComposer';
import LiveIndicator from './LiveIndicator';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { getUser } from '../redux/userSlice';
import { getIsActive } from '../redux/tweetSlice';
import toast from 'react-hot-toast';

const Header = ({ title }) => {
  const [openComposer, setOpenComposer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { otherUsers } = useSelector(store => store.user);
  const { isActive } = useSelector(store => store.tweet);
  const dispatch = useDispatch();
  const mobileSearchInputRef = useRef(null);

  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(getUser(null));
      toast.success(res?.data?.message || 'Logged out');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Logout failed');
    }
  };

  // Close mobile search on Esc and lock body scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileSearchOpen(false);
    };
    if (mobileSearchOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileSearchOpen]);

  return (
    <>
      <div className='flex flex-col border-b border-white/10 text-white'>
        <div className='flex items-center justify-between py-3 px-4'>
          <div className='flex items-center gap-3'>
            <IoMdArrowBack size={22} className='cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors' />
            <div>
              <h1 className='font-bold text-lg'>{title}</h1>
            </div>
            <LiveIndicator />
          </div>
          <div className='flex items-center space-x-3'>
            {/* Desktop search */}
            <div className='relative'>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSearch(true); }}
                placeholder='Search'
                className='hidden md:block bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-full px-3 py-1 outline-none w-64'
              />
              {showSearch && search && (
                <div className='absolute mt-2 w-64 bg-[#0b0b0b] border border-white/10 rounded-md shadow-lg max-h-64 overflow-auto'>
                  {otherUsers?.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())).slice(0,8).map(u => (
                    <div
                      key={u._id}
                      onClick={() => { window.location.href = `/profile/${u._id}`; setShowSearch(false); }}
                      className='p-2 hover:bg-white/10 cursor-pointer flex items-center'
                    >
                      <Avatar src={u.avatar || null} size={32} round={true} />
                      <div className='ml-2'>
                        <div className='font-bold'>{u.name}</div>
                        <div className='text-sm text-white/60'>@{u.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Mobile search trigger */}
            <button onClick={() => setMobileSearchOpen(true)} className='md:hidden p-2 rounded-full hover:bg-white/10' aria-label='Search'>
              <CiSearch size={22} />
            </button>
            <button onClick={() => setOpenComposer(true)} className='bg-twitter text-white px-3 py-1 rounded-full font-bold'>Post</button>
            <div className='relative'>
              <button className='p-1 rounded-full hover:bg-white/10'>
                <div className='w-6 h-6 bg-white/20 rounded-full' />
              </button>
            </div>
            <div className='relative'>
              <button onClick={() => setMenuOpen(!menuOpen)} className='p-1 rounded-full hover:bg-white/10'>
                <Avatar name="You" size={36} round={true} />
              </button>
              {menuOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-[#0b0b0b] border border-white/10 rounded-md shadow-lg p-2'>
                  <div className='p-2 hover:bg-white/10 rounded cursor-pointer'>Profile</div>
                  <div className='p-2 hover:bg-white/10 rounded cursor-pointer'>Lists</div>
                  <div onClick={logout} className='p-2 hover:bg-white/10 rounded cursor-pointer'>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className='flex text-sm font-semibold border-b border-white/10'>
          <button
            onClick={() => dispatch(getIsActive(true))}
            className={`flex-1 py-3 hover:bg-white/10 transition ${isActive ? 'text-white border-b-2 border-blue-500' : 'text-white/60'}`}
          >
            For you
          </button>
          <button
            onClick={() => dispatch(getIsActive(false))}
            className={`flex-1 py-3 hover:bg-white/10 transition ${!isActive ? 'text-white border-b-2 border-blue-500' : 'text-white/60'}`}
          >
            Following
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className='fixed inset-0 z-50 bg-black/90 backdrop-blur'>
          <div className='max-w-xl mx-auto px-4 pt-6'>
            <div className='flex items-center gap-2'>
              <button onClick={() => setMobileSearchOpen(false)} className='p-2 rounded-full hover:bg-white/10' aria-label='Close search'>
                <IoMdArrowBack size={22} />
              </button>
              <input
                ref={mobileSearchInputRef}
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search'
                className='flex-1 bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-full px-4 py-2 outline-none'
              />
              {!!search && (
                <button
                  onClick={() => { setSearch(''); setTimeout(() => mobileSearchInputRef.current?.focus(), 0); }}
                  className='p-2 rounded-full hover:bg-white/10 text-white/80 text-2xl leading-none'
                  aria-label='Clear search'
                >
                  ×
                </button>
              )}
            </div>
            <div className='mt-4 max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-[#0b0b0b]'>
              {search ? (
                otherUsers?.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())).slice(0,20).map(u => (
                  <div
                    key={u._id}
                    onClick={() => { window.location.href = `/profile/${u._id}`; setMobileSearchOpen(false); }}
                    className='p-3 hover:bg-white/10 cursor-pointer flex items-center'
                  >
                    <Avatar src={u.avatar || null} size={36} round={true} />
                    <div className='ml-2'>
                      <div className='font-bold'>{u.name}</div>
                      <div className='text-sm text-white/60'>@{u.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='p-6 text-white/60'>Start typing to search…</div>
              )}
            </div>
          </div>
          <div className='absolute inset-0 -z-10' onClick={() => setMobileSearchOpen(false)} />
        </div>
      )}
      <TweetComposer open={openComposer} onClose={() => setOpenComposer(false)} />
    </>
  );
}

export default Header;
