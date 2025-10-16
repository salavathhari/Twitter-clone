import React from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const Bookmarks = () => {
  const navigate = useNavigate();
  return (
    <div className="text-white">
      {/* custom header */}
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
            <HiOutlineArrowLeft size={22} />
          </button>
          <div>
            <div className="text-xl font-extrabold leading-tight">Bookmarks</div>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10">
            <CiSearch className="text-white/60" size={18} />
            <input
              placeholder="Search Bookmarks"
              className="w-full bg-transparent outline-none text-white placeholder-white/40"
            />
          </div>
        </div>
      </div>

      {/* empty state */}
      <div className="flex flex-col items-start mx-auto max-w-[680px] px-6 pt-16">
        <h1 className="text-4xl font-extrabold mb-2">Save posts for later</h1>
        <p className="text-white/60 text-[15px] max-w-[560px]">
          Bookmark posts to easily find them again in the future.
        </p>
      </div>
    </div>
  );
};

export default Bookmarks;
