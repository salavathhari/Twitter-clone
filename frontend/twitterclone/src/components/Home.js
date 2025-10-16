import React,{useEffect} from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import Header from './Header'
import MobileNav from './MobileNav'
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useOtherUsers from '../hooks/useOtherUsers';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { getUser } from '../redux/userSlice';
import useGetMyTweets from '../hooks/useGetMyTweets';


const Home = () => {
  const { user, otherUsers } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const rehydrated = useSelector(store => store._persist?.rehydrated);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileRoute = location.pathname.startsWith('/profile/');
  const isMessagesRoute = location.pathname.startsWith('/messages');
  const isGrokRoute = location.pathname.startsWith('/grok');
  const isBookmarksRoute = location.pathname.startsWith('/bookmarks');
  const isCommunitiesRoute = location.pathname.startsWith('/communities');

  useEffect(()=>{
    // wait for redux-persist rehydration before deciding
    if (!rehydrated) return;
    if (!user) {
      // attempt to restore from server cookie
      (async () => {
        try {
          const res = await axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true });
          if (res?.data?.user) {
            dispatch(getUser(res.data.user));
            document.body.classList.add('theme-dark');
            return;
          }
          navigate('/login');
          document.body.classList.remove('theme-dark');
        } catch {
          navigate('/login');
          document.body.classList.remove('theme-dark');
        }
      })();
      return;
    }
    document.body.classList.add('theme-dark');
    return () => {
      document.body.classList.remove('theme-dark');
    }
  },[user, navigate, rehydrated, dispatch]);
  // custom Hook
  useOtherUsers(user?._id);
  useGetMyTweets(user?._id);

  // Close modal on Escape and lock body scroll when modal is open
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isProfileRoute) {
        navigate('/');
      }
    };
    window.addEventListener('keydown', onKey);
    if (isProfileRoute) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isProfileRoute, navigate]);

  return (
    <div className='flex flex-col md:flex-row md:justify-between'>
      {/* Left sidebar: visible from md breakpoint */}
      <aside className='w-[280px] hidden md:block md:shrink-0'>
        <LeftSidebar />
      </aside>

      {/* Main content column */}
      <main className='main-column relative flex-1 min-w-0 pb-14 md:pb-0'>
        {!isMessagesRoute && !isGrokRoute && !isBookmarksRoute && !isCommunitiesRoute && <Header title="Home" />}
        {!isProfileRoute && <Outlet />}
        {isProfileRoute && (
          <div className='fixed inset-0 z-40 flex items-start justify-center bg-black/60 backdrop-blur-sm' onClick={() => navigate('/') }>
            <div className='mt-6 mb-6 bg-black rounded-2xl border border-white/10 max-h-[90vh] w-[95vw] max-w-[960px] overflow-hidden overflow-y-auto shadow-2xl' onClick={(e) => e.stopPropagation()}>
              <Outlet context={{ modal: true }} />
            </div>
          </div>
        )}
      </main>

      {/* Right sidebar: on large screens as rail */}
      <aside className='w-[320px] hidden lg:block lg:shrink-0'>
        <RightSidebar />
      </aside>

      {/* Right sidebar: on tablets below feed; hidden on mobile */}
      <aside className='hidden md:block lg:hidden px-4 md:px-6 pb-6'>
        <RightSidebar />
      </aside>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}

export default Home