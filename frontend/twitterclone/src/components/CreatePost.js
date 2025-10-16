import React, { useState } from 'react';
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import TweetComposer from './TweetComposer';
import { useSelector, useDispatch } from "react-redux";
import { getIsActive } from '../redux/tweetSlice';

const CreatePost = () => {
    const [description, setDescription] = useState("");
    const { user } = useSelector(store => store.user);
    const {isActive} = useSelector(store=>store.tweet);
    const dispatch = useDispatch();

    const [composerOpen, setComposerOpen] = useState(false);

    const submitHandler = () => {
        // open composer modal for posting
        setComposerOpen(true);
    }

    const forYouHandler = () => {
         dispatch(getIsActive(true));
    }
    const followingHandler = () => {
        
        dispatch(getIsActive(false));
    }

    return (
        <div className='w-full text-white'>
            <div>
                <div className='flex items-center p-4'>
                    <div>
                        <Avatar src={user?.avatar || null} size="40" round={true} />
                    </div>
                    <div onClick={() => setComposerOpen(true)} className='w-full ml-2 py-2 px-3 rounded-full bg-white/10 cursor-text text-white/80 hover:bg-white/15'>What's happening?</div>
                </div>
                <div className='flex items-center justify-between px-4 pb-3 border-b border-white/10'>
                    <div className='flex items-center gap-4 text-twitter'>
                        <CiImageOn size="22px" />
                        <div className='w-5 h-5 rounded-sm border border-twitter/50' />
                        <div className='w-5 h-5 rounded-full border border-twitter/50' />
                        <div className='w-5 h-5 rounded-full border border-twitter/50' />
                        <div className='w-5 h-5 rounded-full border border-twitter/50' />
                    </div>
                    <button onClick={() => setComposerOpen(true)} className='bg-twitter px-4 py-1 text-lg text-white text-right border-none rounded-full '>Post</button>
                </div>
                <TweetComposer open={composerOpen} onClose={() => setComposerOpen(false)} />
            </div>
        </div>
    )
}

export default CreatePost