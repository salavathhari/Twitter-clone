import React, { useMemo, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { FiCalendar } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import ProfileSetupModal from './ProfileSetupModal';
import HeaderSetupModal from './HeaderSetupModal';
import BioSetupModal from './BioSetupModal';
import LocationSetupModal from './LocationSetupModal';
import FinalizeSetupModal from './FinalizeSetupModal';
import { useSelector,useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { tweets } = useSelector(store => store.tweet);
    const { id } = useParams();
    useGetProfile(id);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('Posts');
    const [setupOpen, setSetupOpen] = useState(false);
    const [headerOpen, setHeaderOpen] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [finalizeOpen, setFinalizeOpen] = useState(false);

    const isMe = profile?._id === user?._id;
    const followingCount = profile?.following?.length || 0;
    const followersCount = profile?.followers?.length || 0;
    const postsCount = useMemo(() => {
        if (!tweets || !profile?._id) return 0;
        try {
            return tweets.filter(t => (t?.user?._id || t?.user) === profile._id).length;
        } catch {
            return 0;
        }
    }, [tweets, profile?._id]);
    const joinedText = useMemo(() => {
        if (!profile?.createdAt) return '';
        const d = new Date(profile.createdAt);
        return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    }, [profile?.createdAt]);

    const followAndUnfollowHandler = async () => {
    if(user?.following?.includes(id)){
            // unfollow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to unfollow');
                console.log(error);
            }
            
        }else{
            // follow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to follow');
                console.log(error);
            }
        }
    }

    return (
    <div className='w-full max-w-none border-l border-r border-white/10 min-h-screen text-white'>
            {/* Top bar */}
            <div className='sticky top-0 z-10 backdrop-blur bg-black/50'>
                <div className='flex items-center justify-between py-2 px-3'>
                    <div className='flex items-center gap-3'>
                        <Link to="/" className='p-2 rounded-full hover:bg-white/10 transition'>
                            <IoMdArrowBack size="22px" />
                        </Link>
                        <div className='leading-tight'>
                            <h1 className='font-bold text-lg'>{profile?.name || 'Profile'}</h1>
                            <p className='text-white/60 text-sm'>{postsCount} posts</p>
                        </div>
                    </div>
                    <button className='p-2 rounded-full hover:bg-white/10'>
                        <CiSearch size={20} />
                    </button>
                </div>
            </div>

            {/* Banner + Avatar */}
            <div className='relative'>
                {profile?.banner ? (
                    <img src={profile.banner} alt="banner" className='h-44 w-full object-cover bg-gray-100' />
                ) : (
                    <div className='h-44 w-full bg-white/10' />
                )}
                <div className='absolute -bottom-14 left-4 border-4 border-black rounded-full shadow'>
                    <Avatar src={profile?.avatar || "/logo192.png"} size={120} round={true} />
                </div>
            </div>

            {/* Action button */}
            <div className='flex justify-end px-4 pt-4'>
                {isMe ? (
                    <button
                        onClick={() => setSetupOpen(true)}
                        className='px-4 py-1.5 rounded-full text-sm font-semibold transition border border-white/30 text-white hover:bg-white/10'
                    >
                        Set up profile
                    </button>
                ) : (
                    <button
                        onClick={followAndUnfollowHandler}
                        className='px-4 py-1.5 rounded-full text-sm font-semibold transition border border-white/30 text-white hover:bg-white/10'
                    >
                        {user?.following?.includes(id) ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>

            {/* Name, handle, bio */}
            <div className='px-4 pt-4'>
                <h2 className='text-xl font-bold'>{profile?.name || 'Unknown User'}</h2>
                <p className='text-white/60'>@{profile?.username || 'username'}</p>
                {profile?.bio ? (
                    <p className='mt-2 text-[15px]'>{profile.bio}</p>
                ) : (
                    <p className='mt-2 text-[15px] text-white/60'>No bio yet.</p>
                )}

                {/* Meta */}
                <div className='flex items-center gap-4 text-white/60 text-sm mt-2'>
                    {joinedText && (
                        <div className='flex items-center gap-1'>
                            <FiCalendar />
                            <span>Joined {joinedText}</span>
                        </div>
                    )}
                </div>

                {/* Counts */}
                <div className='flex items-center gap-4 mt-3 text-sm'>
                    <button className='hover:underline'><span className='font-semibold text-white'>{followingCount}</span> <span className='text-white/60'>Following</span></button>
                    <button className='hover:underline'><span className='font-semibold text-white'>{followersCount}</span> <span className='text-white/60'>Followers</span></button>
                </div>
            </div>

            {/* Verification prompt card */}
            <div className='mx-4 mt-4 bg-emerald-700/90 text-white rounded-2xl p-4 border border-emerald-600'>
                <div className='flex items-center gap-2 text-lg font-extrabold'>
                    You aren’t verified yet <AiOutlineCheckCircle className='text-white' />
                </div>
                <p className='text-white/90 text-sm mt-1'>Get verified for boosted replies, analytics, ad-free browsing, and more. Upgrade your profile now.</p>
                <button className='mt-3 px-4 py-2 rounded-full bg-white text-black font-bold'>Get verified</button>
            </div>

            {/* Tabs */}
            <div className='mt-4 border-b border-white/10 flex text-sm font-semibold'>
                {['Posts', 'Replies', 'Highlights', 'Articles', 'Media', 'Likes'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 hover:bg-white/10 transition ${activeTab === tab ? 'text-white relative after:content-["\"] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-14 after:bg-blue-500 after:rounded-full' : 'text-white/60'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className='px-0 py-0 text-center text-white/60'>
                {activeTab === 'Posts' && (
                    <div>
                        {/* Render user's posts if available */}
                        {tweets?.filter(t => (t?.user?._id || t?.user) === profile?._id).map(t => (
                            <div key={t._id} className='border-b border-white/10'>
                                {/* Lazy import to avoid circular deps; Tweet component is used in Feed normally */}
                                {/* We’ll show a minimal row if Tweet component is not available */}
                                <div className='p-4 text-left'>
                                    <div className='text-white font-bold'>{profile?.name} <span className='text-white/60'>@{profile?.username}</span></div>
                                    <div className='mt-1 text-white'>{t.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab !== 'Posts' && (
                    <div className='px-4 py-8'>Content will appear here.</div>
                )}
            </div>

                        <ProfileSetupModal
                            open={setupOpen}
                            onClose={() => setSetupOpen(false)}
                            onBack={() => setSetupOpen(false)}
                            onNext={() => { setSetupOpen(false); setHeaderOpen(true); }}
                        />
                        <HeaderSetupModal
                            open={headerOpen}
                            onClose={() => setHeaderOpen(false)}
                                        onBack={() => { setHeaderOpen(false); setSetupOpen(true); }}
                                        onNext={() => { setHeaderOpen(false); setBioOpen(true); }}
                        />
                        <BioSetupModal
                            open={bioOpen}
                                        onClose={() => { setBioOpen(false); setLocationOpen(true); }}
                            onBack={() => { setBioOpen(false); setHeaderOpen(true); }}
                        />
                                    <LocationSetupModal
                                        open={locationOpen}
                                                    onClose={() => { setLocationOpen(false); setFinalizeOpen(true); }}
                                        onBack={() => { setLocationOpen(false); setBioOpen(true); }}
                                    />
                                                <FinalizeSetupModal
                                                    open={finalizeOpen}
                                                    onClose={() => setFinalizeOpen(false)}
                                                    onBack={() => { setFinalizeOpen(false); setLocationOpen(true); }}
                                                />
        </div>
    )
}

export default Profile