import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import Avatar from 'react-avatar';
import { IoMdArrowBack } from 'react-icons/io';
import { getUser, getMyProfile } from '../redux/userSlice';

const BioSetupModal = ({ open, onClose, onBack }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.user);
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onSave = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/bio`, { bio }, { withCredentials: true });
      toast.success(res?.data?.message || 'Bio updated');
      if (res?.data?.user) {
        dispatch(getUser(res.data.user));
        dispatch(getMyProfile(res.data.user));
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update bio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1419] text-white p-6 shadow-2xl border border-white/10">
        {/* Back */}
        <button aria-label="Back" onClick={onBack || onClose} className="absolute left-4 top-4 p-2 rounded-full hover:bg-white/10">
          <IoMdArrowBack size={20} />
        </button>
        {/* Title */}
        <div className="text-center">
          <h3 className="text-2xl font-extrabold">Describe yourself</h3>
          <p className="mt-1 text-[15px] text-gray-400">What makes you special? Don't think too hard, just have fun with it.</p>
        </div>

        {/* Show uploaded images if available */}
        <div className="mt-6">
          {user?.banner && (
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 mb-4">
              <img src={user.banner} alt="header" className="w-full aspect-[3/1] object-cover" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar || undefined} size={56} round={true} />
            <div>
              <div className="font-bold text-lg">{user?.name || 'Your name'}</div>
              <div className="text-gray-400 text-sm">@{user?.username || 'username'}</div>
            </div>
          </div>
        </div>

        {/* Bio input */}
        <div className="mt-6">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your bio"
            className="w-full min-h-[120px] resize-none rounded-xl bg-transparent border border-white/20 outline-none p-3 text-[15px] placeholder:text-gray-500"
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button onClick={onClose} className="rounded-full px-6 py-3 text-[15px] font-semibold border border-white/20 hover:bg-white/10 transition">Skip for now</button>
          <button onClick={onSave} disabled={loading} className="rounded-full px-6 py-3 text-[15px] font-semibold bg-white text-black hover:opacity-90 disabled:opacity-50">{loading ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default BioSetupModal;
