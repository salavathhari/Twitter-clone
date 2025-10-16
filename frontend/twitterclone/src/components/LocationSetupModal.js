import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getMyProfile } from '../redux/userSlice';
import { IoMdArrowBack } from 'react-icons/io';

const LocationSetupModal = ({ open, onClose, onBack }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.user);
  const [location, setLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onSave = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/location`, { location }, { withCredentials: true });
      toast.success(res?.data?.message || 'Location updated');
      if (res?.data?.user) {
        dispatch(getUser(res.data.user));
        dispatch(getMyProfile(res.data.user));
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update location');
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
          <h3 className="text-2xl font-extrabold">Where do you live?</h3>
          <p className="mt-1 text-[15px] text-gray-400">Find accounts in the same location as you.</p>
        </div>

        <div className="mt-6">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full rounded-xl bg-transparent border border-white/20 outline-none p-3 text-[15px] placeholder:text-gray-500"
          />
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button onClick={onClose} className="rounded-full px-6 py-3 text-[15px] font-semibold border border-white/20 hover:bg-white/10 transition">Skip for now</button>
          <button onClick={onSave} disabled={loading} className="rounded-full px-6 py-3 text-[15px] font-semibold bg-white text-black hover:opacity-90 disabled:opacity-50">{loading ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default LocationSetupModal;
