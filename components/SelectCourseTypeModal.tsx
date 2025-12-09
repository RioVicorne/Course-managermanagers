'use client';

import { X, BookOpen, Beaker, BookCheck } from 'lucide-react';

type SelectCourseTypeModalProps = {
  isOpen: boolean;
  courseName: string;
  hasLyThuyet: boolean;
  hasThucHanh: boolean;
  onClose: () => void;
  onSelect: (type: 'ly_thuyet' | 'thuc_hanh' | 'both') => void;
};

export function SelectCourseTypeModal({
  isOpen,
  courseName,
  hasLyThuyet,
  hasThucHanh,
  onClose,
  onSelect,
}: SelectCourseTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Chọn loại môn học</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-slate-300">
            Môn học <span className="font-semibold text-white">"{courseName}"</span> có nhiều loại. Vui lòng chọn:
          </p>
          
          <div className="space-y-3">
            {hasLyThuyet && (
              <button
                onClick={() => onSelect('ly_thuyet')}
                className="w-full glass-panel rounded-2xl p-4 flex items-center gap-3 transition-transform duration-200 hover:translate-y-[-2px] hover:border-white/20 hover:shadow-2xl"
              >
                <div className="rounded-full bg-blue-500/20 p-3">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white">Lý thuyết</h3>
                  <p className="text-sm text-slate-400">Đăng ký phần lý thuyết</p>
                </div>
              </button>
            )}

            {hasThucHanh && (
              <button
                onClick={() => onSelect('thuc_hanh')}
                className="w-full glass-panel rounded-2xl p-4 flex items-center gap-3 transition-transform duration-200 hover:translate-y-[-2px] hover:border-white/20 hover:shadow-2xl"
              >
                <div className="rounded-full bg-rose-500/20 p-3">
                  <Beaker className="h-5 w-5 text-rose-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white">Thực hành</h3>
                  <p className="text-sm text-slate-400">Đăng ký phần thực hành</p>
                </div>
              </button>
            )}

            {hasLyThuyet && hasThucHanh && (
              <button
                onClick={() => onSelect('both')}
                className="w-full glass-panel rounded-2xl p-4 flex items-center gap-3 transition-transform duration-200 hover:translate-y-[-2px] hover:border-white/20 hover:shadow-2xl border-2 border-indigo-500/50"
              >
                <div className="rounded-full bg-indigo-500/20 p-3">
                  <BookCheck className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white">Cả hai</h3>
                  <p className="text-sm text-slate-400">Đăng ký cả lý thuyết và thực hành</p>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

