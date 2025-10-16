import React from 'react';
import { CiHome, CiHashtag, CiUser, CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { RiMessage2Line } from "react-icons/ri";
import { PiRocketLaunchLight } from "react-icons/pi";
import { PiUsersThreeLight } from "react-icons/pi";
import { TbBrandAppleArcade } from "react-icons/tb";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight, HiOutlineCog6Tooth } from "react-icons/hi2";
import { TbListDetails } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineCampaign } from "react-icons/md";
import { RiMic2Line } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { Link,useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';
 

const LeftSidebar = () => {

    const {user} = useSelector(store=>store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getMyProfile(null));
            navigate('/login');
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    // More menu state and refs
    const [moreOpen, setMoreOpen] = React.useState(false);
    const moreBtnRef = React.useRef(null);
    const menuRef = React.useRef(null);

    // Close on outside click / Esc
    React.useEffect(() => {
        const onDown = (e) => {
            if (!moreOpen) return;
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                moreBtnRef.current && !moreBtnRef.current.contains(e.target)) {
                setMoreOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setMoreOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        window.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            window.removeEventListener('keydown', onKey);
        };
    }, [moreOpen]);

    return (
    <div className='p-2 sticky top-0 h-screen flex flex-col text-white'>
            <div className='mb-4 px-2'>
                <img className='ml-1' width={"28px"} src="/twitter-logo.png" alt="twitter-logo" />
            </div>
            <div className='space-y-1 flex-1'>
                <Link to="/" className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                    <div>
                        <CiHome size="28px" />
                    </div>
                    <h1 className='font-bold text-[18px] ml-3'>Home</h1>
                </Link>
                    <Link to="/explore" className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <CiHashtag size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Explore</h1>
                    </Link>
                    <div className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div className='relative'>
                            <IoIosNotificationsOutline size="24px" />
                            <span className='absolute -top-1 -right-1 bg-twitter text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full'>3</span>
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Notifications</h1>
                    </div>
                    <Link to="/messages" className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <RiMessage2Line size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Messages</h1>
                    </Link>
                    <Link to="/grok" className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <PiRocketLaunchLight size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Grok</h1>
                    </Link>
                    <Link to="/bookmarks" className='flex items-center my-1 px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <CiBookmark size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Bookmarks</h1>
                    </Link>
                    <Link to="/communities" className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <PiUsersThreeLight size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Communities</h1>
                    </Link>
                    <div className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <TbBrandAppleArcade size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Premium</h1>
                    </div>
                    <Link to={`/profile/${user?._id}`} className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full'>
                        <div>
                            <CiUser size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Profile</h1>
                    </Link>
                    <button
                        ref={moreBtnRef}
                        onClick={() => setMoreOpen((v) => !v)}
                        aria-expanded={moreOpen}
                        className='flex w-full items-center px-4 py-2 hover:bg-white/10 rounded-full text-left'
                    >
                        <div>
                            <HiOutlineDotsCircleHorizontal size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>More</h1>
                    </button>
                    {moreOpen && (
                        <div
                            ref={menuRef}
                            className='absolute left-[140px] bottom-[110px] w-[360px] bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50'
                            role='menu'
                        >
                            <div className='py-2'>
                                <button className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left'>
                                    <HiOutlineChatBubbleLeftRight size={20} />
                                    <span className='flex-1'>Chat</span>
                                    <span className='text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold'>Beta</span>
                                </button>
                                <button className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left'>
                                    <TbListDetails size={20} />
                                    <span>Lists</span>
                                </button>
                                <button className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left'>
                                    <RiMoneyDollarCircleLine size={20} />
                                    <span>Monetization</span>
                                </button>
                                <button className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left'>
                                    <MdOutlineCampaign size={20} />
                                    <span>Ads</span>
                                </button>
                                <button className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left'>
                                    <RiMic2Line size={20} />
                                    <span>Create your Space</span>
                                </button>
                            </div>
                            <div className='border-t border-white/10'></div>
                            <button className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left'>
                                <HiOutlineCog6Tooth size={20} />
                                <span>Settings and privacy</span>
                            </button>
                        </div>
                    )}
                    <div onClick={logoutHandler} className='flex items-center px-4 py-2 hover:bg-white/10 rounded-full cursor-pointer'>
                        <div>
                            <AiOutlineLogout size="24px" />
                        </div>
                        <h1 className='font-bold text-[16px] ml-2'>Logout</h1>
                    </div>
                     <button className='mt-2 px-4 py-3 border-none text-md bg-white text-black w-full rounded-full font-bold'>Post</button>
                </div>
            {/* Bottom mini-profile */}
            <div className='px-3 py-2 mt-2 rounded-2xl hover:bg-white/10 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <img src={user?.avatar || '/logo192.png'} alt='me' className='w-9 h-9 rounded-full object-cover'/>
                <div className='text-sm'>
                  <div className='font-bold leading-tight'>{user?.name || 'User'}</div>
                  <div className='text-white/60 leading-tight'>@{user?.username || 'handle'}</div>
                </div>
              </div>
              <span className='text-white/60 text-xl'>…</span>
            </div>
        </div>
    )
}

export default LeftSidebar