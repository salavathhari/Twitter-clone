import React from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { CiSearch } from 'react-icons/ci';
import { IoSparklesOutline } from 'react-icons/io5';
import { PiUsersThreeLight } from 'react-icons/pi';
import { AiOutlineHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const IntroModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60">
      <div className="mt-10 w-[680px] max-w-[95vw] bg-black rounded-2xl border border-white/10 overflow-hidden">
        <div className="relative p-6">
          <button onClick={onClose} className="absolute right-3 top-3 text-2xl text-white/80 hover:text-white">×</button>
          <h2 className="text-3xl font-extrabold mb-2">Welcome to Communities</h2>
          <p className="text-white/70 mb-4">Communities are moderated discussion groups where people on X can connect and share.</p>

          <div className="space-y-6 text-[15px]">
            <div className="flex gap-4">
              <IoSparklesOutline className="mt-1.5" size={22} />
              <div>
                <div className="font-bold">Meet others with your interests</div>
                <div className="text-white/70">Join Communities to connect with people who share your interests.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <PiUsersThreeLight className="mt-1.5" size={22} />
              <div>
                <div className="font-bold">Post directly to a Community</div>
                <div className="text-white/70">Your posts are shared with Community members and your followers.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <AiOutlineHeart className="mt-1.5" size={22} />
              <div>
                <div className="font-bold">Get backup when you need it</div>
                <div className="text-white/70">Admins and moderators help manage Communities and keep conversations on track.</div>
              </div>
            </div>
          </div>

          <div className="px-2 py-6">
            <button onClick={onClose} className="mx-auto block w-[70%] max-w-[520px] py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 font-semibold">Check it out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Communities = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  return (
    <div className="text-white">
      {/* page header similar to screenshot */}
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
            <HiOutlineArrowLeft size={22} />
          </button>
          <div className="text-xl font-extrabold">Communities</div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10">
            <CiSearch className="text-white/60" size={18} />
            <input
              placeholder="Search"
              className="w-full bg-transparent outline-none text-white placeholder-white/40"
            />
          </div>
        </div>
      </div>

      {/* Intro modal */}
      <IntroModal open={open} onClose={() => setOpen(false)} />

      {/* Placeholder list content behind modal */}
      <div className="p-6 text-white/60">Sports · Technology · Entertainment</div>
    </div>
  );
};

export default Communities;
