import React, { useState, useEffect, useRef } from 'react'
import CreatePost from './CreatePost.js'
import Tweet from './Tweet.js'
import {useSelector, useDispatch} from "react-redux";
import { getRefresh } from '../redux/tweetSlice.js';

const Feed = () => {
  const {tweets} = useSelector(store=>store.tweet);
  const dispatch = useDispatch();
  const [hasNewTweets, setHasNewTweets] = useState(false);
  const [newTweetCount, setNewTweetCount] = useState(0);
  const previousTweetCountRef = useRef(tweets?.length || 0);

  // Check for new tweets when tweets array changes
  useEffect(() => {
    const currentCount = tweets?.length || 0;
    const previousCount = previousTweetCountRef.current;
    
    if (currentCount > previousCount && previousCount > 0) {
      const difference = currentCount - previousCount;
      setNewTweetCount(difference);
      setHasNewTweets(true);
    }
    
    previousTweetCountRef.current = currentCount;
  }, [tweets]);

  const handleShowNewTweets = () => {
    setHasNewTweets(false);
    setNewTweetCount(0);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Trigger refresh to ensure we have latest data
    dispatch(getRefresh());
  };

  return (
    <div className='relative'>
      {/* New Tweets Notification Banner */}
      {hasNewTweets && (
        <div className='sticky top-0 z-10 flex justify-center pt-2 pb-2 animate-fadeIn'>
          <button
            onClick={handleShowNewTweets}
            className='bg-twitter hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z' clipRule='evenodd' />
            </svg>
            <span>See {newTweetCount} new {newTweetCount === 1 ? 'tweet' : 'tweets'}</span>
          </button>
        </div>
      )}
      
      <CreatePost/>
      {tweets?.map((tweet)=> <Tweet key={tweet?._id} tweet={tweet}/>)}
    </div>
  )
}

export default Feed