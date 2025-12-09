'use client';

import { AlertTriangle, X } from 'lucide-react';

type UnregisterConfirmModalProps = {
  isOpen: boolean;
  courseName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function UnregisterConfirmModal({
  isOpen,
  courseName,
  onClose,
  onConfirm,
}: UnregisterConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/20 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Xác nhận hủy đăng ký</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-slate-300">
            Bạn có chắc chắn muốn hủy đăng ký học phần
            <span className="font-semibold text-white"> "{courseName}"</span>?
          </p>
          <p className="text-sm text-slate-400">
            Học phần này sẽ được gỡ khỏi thời khóa biểu của bạn.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-orange-400"
          >
            Xác nhận hủy đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}

