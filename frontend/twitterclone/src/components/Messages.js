import React from 'react';

const Messages = () => {
  return (
    <div className='text-white flex'>
      {/* Left panel */}
      <div className='flex-1 border-r border-white/10 min-h-[80vh] px-6 pt-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-extrabold'>Messages</h1>
          <div className='flex items-center gap-3 text-white/80'>
            <span className='w-5 h-5 rounded-full border border-white/40 inline-block' />
            <span className='w-5 h-5 rounded-full border border-white/40 inline-block' />
          </div>
        </div>

        <div className='mt-10 max-w-xl'>
          <div className='text-4xl font-extrabold leading-tight'>Welcome to your inbox!</div>
          <p className='text-white/70 mt-3'>Drop a line, share posts and more with private conversations between you and others on X.</p>
          <button className='mt-6 px-6 py-3 rounded-full bg-twitter font-extrabold'>Write a message</button>
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 min-h-[80vh] px-10 pt-14 hidden md:block'>
        <div className='text-4xl font-extrabold'>Select a message</div>
        <p className='text-white/70 mt-3 max-w-md'>Choose from your existing conversations, start a new one, or just keep swimming.</p>
        <button className='mt-6 px-6 py-3 rounded-full bg-twitter font-extrabold'>New message</button>
      </div>
    </div>
  );
}

export default Messages;
