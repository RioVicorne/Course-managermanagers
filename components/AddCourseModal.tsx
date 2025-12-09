'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

type CourseFormData = {
  ten_mon_hoc: string;
  ten_giao_vien: string;
  so_phong: string;
  ca_hoc: number; // 1 ca = tiết 1,2,3
  thu: number; // 2-8 (Thứ 2 đến CN)
  loai_mon: 'ly_thuyet' | 'thuc_hanh'; // Lý thuyết hoặc Thực hành
};

type AddCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: CourseFormData) => Promise<void>;
  initialData?: CourseFormData;
  mode?: 'add' | 'edit';
};

export function AddCourseModal({ isOpen, onClose, onSubmit, initialData, mode = 'add' }: AddCourseModalProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    ten_mon_hoc: '',
    ten_giao_vien: '',
    so_phong: '',
    ca_hoc: 1,
    thu: 2,
    loai_mon: 'ly_thuyet',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data khi modal mở
  React.useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    } else if (isOpen && !initialData) {
      // Reset form khi mở modal add mới
      setFormData({
        ten_mon_hoc: '',
        ten_giao_vien: '',
        so_phong: '',
        ca_hoc: 1,
        thu: 2,
        loai_mon: 'ly_thuyet',
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        ten_mon_hoc: '',
        ten_giao_vien: '',
        so_phong: '',
        ca_hoc: 1,
        thu: 2,
        loai_mon: 'ly_thuyet',
      });
      onClose();
    } catch (error) {
      console.error('Lỗi khi submit học phần:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'edit' ? 'Sửa học phần' : 'Thêm học phần mới'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Tên môn học <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.ten_mon_hoc}
              onChange={(e) => setFormData({ ...formData, ten_mon_hoc: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              placeholder="VD: Lập trình cơ bản"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Tên giáo viên <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.ten_giao_vien}
              onChange={(e) => setFormData({ ...formData, ten_giao_vien: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              placeholder="VD: TS. Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Số Phòng
            </label>
            <input
              type="text"
              value={formData.so_phong}
              onChange={(e) => setFormData({ ...formData, so_phong: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              placeholder="VD: A1-302"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Ca học <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={formData.ca_hoc}
              onChange={(e) => setFormData({ ...formData, ca_hoc: parseInt(e.target.value) })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value={1} className="bg-slate-800">Ca 1 (Tiết 1, 2, 3)</option>
              <option value={2} className="bg-slate-800">Ca 2 (Tiết 4, 5, 6)</option>
              <option value={3} className="bg-slate-800">Ca 3 (Tiết 7, 8, 9)</option>
              <option value={4} className="bg-slate-800">Ca 4 (Tiết 10, 11, 12)</option>
              <option value={5} className="bg-slate-800">Ca 5 (Tiết 13, 14, 15)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Thứ <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={formData.thu}
              onChange={(e) => setFormData({ ...formData, thu: parseInt(e.target.value) })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            >
              <option value={2} className="bg-slate-800">Thứ 2</option>
              <option value={3} className="bg-slate-800">Thứ 3</option>
              <option value={4} className="bg-slate-800">Thứ 4</option>
              <option value={5} className="bg-slate-800">Thứ 5</option>
              <option value={6} className="bg-slate-800">Thứ 6</option>
              <option value={7} className="bg-slate-800">Thứ 7</option>
              <option value={8} className="bg-slate-800">Chủ nhật</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.loai_mon === 'thuc_hanh'}
                onChange={(e) => setFormData({ ...formData, loai_mon: e.target.checked ? 'thuc_hanh' : 'ly_thuyet' })}
                className="w-4 h-4 text-indigo-600 bg-white/5 border-white/20 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <span className="text-sm font-semibold text-slate-300">Thực hành</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting 
                ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang thêm...') 
                : (mode === 'edit' ? 'Cập nhật học phần' : 'Thêm học phần')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
