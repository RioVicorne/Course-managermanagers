'use client';

import { AlertTriangle, X } from 'lucide-react';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  courseName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export function DeleteConfirmModal({
  isOpen,
  courseName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-500/20 p-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Xác nhận xóa</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-slate-300">
            Bạn có chắc chắn muốn xóa học phần
            <span className="font-semibold text-white"> "{courseName}"</span>?
          </p>
          <p className="text-sm text-slate-400">
            Hành động này không thể hoàn tác. Học phần sẽ bị xóa vĩnh viễn.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:from-rose-400 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa học phần'}
          </button>
        </div>
      </div>
    </div>
  );
}

