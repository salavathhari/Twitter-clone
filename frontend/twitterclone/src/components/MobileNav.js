import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CiHome, CiHashtag, CiUser } from 'react-icons/ci';
import { RiMessage2Line } from 'react-icons/ri';
import { PiRocketLaunchLight } from 'react-icons/pi';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useSelector((s) => s.user);
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-md md:hidden">
      <div className="flex h-14">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('/') && !isActive('/profile') && !isActive('/explore') && !isActive('/grok') && !isActive('/messages')
              ? 'text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
          aria-label="Home"
        >
          <CiHome size={26} />
        </Link>
        <Link
          to="/explore"
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('/explore') ? 'text-white' : 'text-white/60 hover:text-white/80'
          }`}
          aria-label="Explore"
        >
          <CiHashtag size={26} />
        </Link>
        <Link
          to="/grok"
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('/grok') ? 'text-white' : 'text-white/60 hover:text-white/80'
          }`}
          aria-label="Grok"
        >
          <PiRocketLaunchLight size={26} />
        </Link>
        <Link
          to="/messages"
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('/messages') ? 'text-white' : 'text-white/60 hover:text-white/80'
          }`}
          aria-label="Messages"
        >
          <RiMessage2Line size={26} />
        </Link>
        <Link
          to={user ? `/profile/${user._id}` : '/profile'}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            isActive('/profile') ? 'text-white' : 'text-white/60 hover:text-white/80'
          }`}
          aria-label="Profile"
        >
          <CiUser size={26} />
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
