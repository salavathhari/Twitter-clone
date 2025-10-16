import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getUser, getMyProfile } from '../redux/userSlice';
import { FiCamera } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';

const ProfileSetupModal = ({ open, onClose, onNext, onBack }) => {
  const dispatch = useDispatch();
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
      toast.error('Pick a profile picture first');
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append('avatar', file);
      const res = await axios.post(`${USER_API_END_POINT}/avatar`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res?.data?.message || 'Profile updated');
      if (res?.data?.user) {
        dispatch(getUser(res.data.user));
        dispatch(getMyProfile(res.data.user));
      }
      // after saving avatar, go to header step if available
      if (onNext) onNext(); else onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f1419] text-white p-6 shadow-2xl border border-white/10">
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
          <h3 className="text-2xl font-extrabold">Pick a profile picture</h3>
          <p className="mt-1 text-[15px] text-gray-400">Have a favorite selfie? Upload it now.</p>
        </div>

        {/* Big circular picker */}
        <div className="mt-8 flex justify-center">
          <label className="relative h-48 w-48 rounded-full ring-2 ring-white/30 grid place-items-center overflow-hidden cursor-pointer bg-gray-700/60">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-gray-300">No image</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20">
                <FiCamera size={20} />
              </span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </label>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
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

export default ProfileSetupModal;
