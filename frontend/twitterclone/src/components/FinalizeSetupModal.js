import React from 'react';
import { IoMdArrowBack } from 'react-icons/io';

const FinalizeSetupModal = ({ open, onClose, onBack }) => {
  if (!open) return null;

  const saveAndClose = () => {
    // All individual steps already saved to backend; this just completes the flow
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f1419] text-white p-8 shadow-2xl border border-white/10 text-center">
        {/* Back */}
        <button aria-label="Back" onClick={onBack || onClose} className="absolute left-4 top-4 p-2 rounded-full hover:bg-white/10">
          <IoMdArrowBack size={20} />
        </button>
        {/* Center glyph (generic) */}
        <div className="text-2xl text-white/80 select-none">×</div>
        <h3 className="mt-6 text-2xl font-extrabold">Click to save updates</h3>

        <div className="mt-8">
          <button
            onClick={saveAndClose}
            className="mx-auto block w-40 rounded-full bg-white text-black font-semibold py-3 hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizeSetupModal;
