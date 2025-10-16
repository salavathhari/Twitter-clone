import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getMyProfile } from '../redux/userSlice';
import Avatar from 'react-avatar';
import { FiCamera } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';

const HeaderSetupModal = ({ open, onClose, onBack, onNext }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onUpload = async () => {
    if (!file) {
      // It's okay to skip without a file; but if pressing Save with no file, warn
      toast.error('Pick a header image first');
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append('banner', file);
      const res = await axios.post(`${USER_API_END_POINT}/banner`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res?.data?.message || 'Header updated');
      if (res?.data?.user) {
        dispatch(getUser(res.data.user));
        dispatch(getMyProfile(res.data.user));
      }
  if (onNext) onNext(); else onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1419] text-white p-6 shadow-2xl border border-white/10">
        {/* Back arrow */}
        <button
          aria-label="Back"
          onClick={onBack || onClose}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-white/10"
        >
          <IoMdArrowBack size={20} />
        </button>
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-extrabold">Pick a header</h3>
          <p className="mt-1 text-[15px] text-gray-400">People who visit your profile will see it. Show your style.</p>
        </div>

        {/* Header picker area */}
        <div className="mt-6">
          <label className="relative block w-full overflow-hidden rounded-2xl bg-gray-800/60 aspect-[3/1] cursor-pointer ring-1 ring-white/10">
            {preview ? (
              <img src={preview} alt="header" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-300">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20">
                  <FiCamera size={22} />
                </span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </label>
        </div>

        {/* Preview of name/handle */}
        <div className="mt-6 flex items-center gap-3">
          <Avatar src={user?.avatar || undefined} size={56} round={true} />
          <div>
            <div className="font-bold text-lg">{user?.name || 'Your name'}</div>
            <div className="text-gray-400 text-sm">@{user?.username || 'username'}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button onClick={onNext || onClose} className="rounded-full px-6 py-3 text-[15px] font-semibold border border-white/20 hover:bg-white/10 transition">
            Skip for now
          </button>
          <button onClick={onUpload} disabled={loading} className="rounded-full px-6 py-3 text-[15px] font-semibold bg-white text-black hover:opacity-90 disabled:opacity-50">
            {loading ? 'Uploading…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSetupModal;
