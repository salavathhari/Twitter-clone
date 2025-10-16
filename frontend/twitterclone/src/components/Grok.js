import React from 'react';
import { LiaBoltSolid } from 'react-icons/lia';
import { LuPaperclip } from 'react-icons/lu';
import { HiOutlineArrowUp } from 'react-icons/hi';
import { PiImagesLight } from 'react-icons/pi';
import { LuPencil } from 'react-icons/lu';
import { RiNewspaperLine } from 'react-icons/ri';

// Simple Grok wordmark with a ring+slash icon approximation
const GrokWordmark = () => (
  <div className="flex items-center gap-3 select-none">
    <svg width="54" height="54" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/90">
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
      <path d="M9 39L39 9" stroke="currentColor" strokeWidth="2" />
    </svg>
    <span className="text-[64px] leading-none font-black tracking-tight">Grok</span>
  </div>
);

const Pill = ({ icon: Icon, children }) => (
  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm">
    <Icon className="text-white/70" size={18} />
    <span>{children}</span>
  </button>
);

const Grok = () => {
  return (
    <div className="relative min-h-[calc(100vh-0px)] text-white">
      {/* starry background */}
      <div className="absolute inset-0 -z-10 bg-black" aria-hidden>
        <div className="w-full h-full opacity-60" style={{
          backgroundImage:
            'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.5) 50%, transparent 50%),'+
            'radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.5) 50%, transparent 50%),'+
            'radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.5) 50%, transparent 50%),'+
            'radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.5) 50%, transparent 50%),'+
            'radial-gradient(2px 2px at 50% 50%, rgba(255,255,255,0.4) 40%, transparent 60%)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
        }} />
      </div>

      {/* top utility bar */}
      <div className="flex items-center justify-between px-6 pt-4">
        <div className="flex items-center gap-2 text-white/70">
          <LiaBoltSolid className="text-white" />
          <span className="text-sm">Fast</span>
          <span className="text-white/40">▼</span>
        </div>
        <div className="flex items-center gap-6 text-white/70">
          <button className="text-sm hover:text-white/90">History</button>
          <button className="text-sm hover:text-white/90">Private</button>
        </div>
      </div>

      {/* center content */}
      <div className="mx-auto max-w-[900px] px-6 pt-24">
        <div className="flex justify-center mb-10">
          <GrokWordmark />
        </div>

        {/* ask input */}
        <div className="flex items-center rounded-full bg-black/40 border border-white/10 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          <div className="pl-5 pr-2 text-white/60">
            <LuPaperclip size={18} />
          </div>
          <input
            type="text"
            placeholder="Ask anything"
            className="flex-1 bg-transparent placeholder-white/40 text-white px-2 py-4 outline-none"
          />
          <div className="pr-3">
            <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10">
              <HiOutlineArrowUp className="text-white" />
            </button>
          </div>
        </div>

        {/* action pills */}
        <div className="flex items-center gap-4 mt-6">
          <Pill icon={PiImagesLight}>Create Images</Pill>
          <Pill icon={LuPencil}>Edit Image</Pill>
          <Pill icon={RiNewspaperLine}>Latest News</Pill>
        </div>
      </div>
    </div>
  );
};

export default Grok;
