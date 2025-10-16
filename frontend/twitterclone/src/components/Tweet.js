import React, { useState, useEffect } from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import {timeSince} from "../utils/constant";

const Tweet = ({ tweet }) => {
    const { user } = useSelector(store => store.user); 
    const dispatch = useDispatch();
    
    // Local state for optimistic updates
    const [isLiked, setIsLiked] = useState(tweet?.like?.includes(user?._id));
    const [likeCount, setLikeCount] = useState(tweet?.like?.length || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    // Update local state when tweet prop changes (from live updates)
    useEffect(() => {
        setIsLiked(tweet?.like?.includes(user?._id));
        setLikeCount(tweet?.like?.length || 0);
    }, [tweet, user?._id]);

    const likeOrDislikeHandler = async (id) => {
        if (isUpdating) return; // Prevent double clicks
        
        // Optimistic update
        const wasLiked = isLiked;
        const previousCount = likeCount;
        setIsLiked(!wasLiked);
        setLikeCount(wasLiked ? previousCount - 1 : previousCount + 1);
        setIsUpdating(true);

        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, {
                withCredentials: true
            });
            
            // Refresh data after successful update
            setTimeout(() => {
                dispatch(getRefresh());
            }, 500);

        } catch (error) {
            // Revert optimistic update on error
            setIsLiked(wasLiked);
            setLikeCount(previousCount);
            const message = error?.response?.data?.message || error?.message || 'Action failed';
            toast.error(message);
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    }
    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            console.log(res);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Delete failed';
            toast.error(message);
            console.log(error);
        }
    }
    return (
        <div className='border-b border-gray-200'>
            <div>
                <div className='flex p-4'>
                    <Avatar src={tweet?.userDetails?.[0]?.avatar || null} size="40" round={true} />
                    <div className=' ml-2 w-full'>
                        <div className='flex items-center'>
                            <h1 className='font-bold'>{tweet?.userDetails[0]?.name}</h1>
                            <p className='text-gray-500 text-sm ml-1'>{`@${tweet?.userDetails[0]?.username} . ${timeSince(tweet?.createdAt)}`}</p>
                        </div>
                        <div>
                            <p className='text-lg mt-2'>{tweet?.description}</p>
                            {tweet?.image && (
                                <div className='mt-3'>
                                    <img src={tweet.image.startsWith('http') ? tweet.image : `http://localhost:8080${tweet.image}`} alt="tweet-media" className='max-h-80 rounded-lg w-full object-cover' />
                                </div>
                            )}
                        </div>
                        <div className='flex justify-between mt-3 text-sm text-gray-500'>
                            <div className='flex items-center space-x-2'>
                                <button className='p-2 hover:bg-gray-100 rounded-full cursor-pointer'>
                                    <FaRegComment size="18px" />
                                </button>
                                <span>0</span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <button 
                                    onClick={() => likeOrDislikeHandler(tweet?._id)} 
                                    className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
                                        isLiked 
                                            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                            : 'hover:bg-gray-100 hover:text-red-500'
                                    } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                                    disabled={isUpdating}
                                >
                                    {isLiked ? <AiFillHeart size="20px" className='animate-pulse' /> : <CiHeart size="20px" />}
                                </button>
                                <span className={`${isUpdating ? 'animate-pulse' : ''}`}>{likeCount}</span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <button className='p-2 hover:bg-gray-100 rounded-full cursor-pointer'>
                                    <CiBookmark size="20px" />
                                </button>
                                <span>0</span>
                            </div>
                            {
                                user?._id === tweet?.userId && (
                                    <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center'>
                                        <div className='p-2 hover:bg-red-300 rounded-full cursor-pointer'>
                                            <MdOutlineDeleteOutline size="24px" />
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet