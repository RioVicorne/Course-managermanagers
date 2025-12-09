"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import CourseList from "../../components/CourseList";
import { AddCourseModal } from "../../components/AddCourseModal";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { UnregisterConfirmModal } from "../../components/UnregisterConfirmModal";
import { SelectCourseTypeModal } from "../../components/SelectCourseTypeModal";
import { Course } from "../../data/mockData";
import { fetchCourses, createCourse, updateCourse, fetchCourseByCode, deleteCourse } from "../../lib/courses";

const STORAGE_KEY = "registeredCourseIds";

type ToastState = {
  message: string;
  tone: "success" | "error";
} | null;

const hasConflict = (incoming: Course, registered: Course[]) => {
  return registered.some((course) => {
    const sameDay = course.schedule.day === incoming.schedule.day;
    const overlaps =
      incoming.schedule.startPeriod <
        course.schedule.startPeriod + course.schedule.countPeriod &&
      incoming.schedule.startPeriod + incoming.schedule.countPeriod >
        course.schedule.startPeriod;
    return sameDay && overlaps;
  });
};

export default function CoursesPage() {
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editFormData, setEditFormData] = useState<{ ten_mon_hoc: string; ten_giao_vien: string; so_phong: string; ca_hoc: number; thu: number; loai_mon: 'ly_thuyet' | 'thuc_hanh' } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnregisterModalOpen, setIsUnregisterModalOpen] = useState(false);
  const [unregisteringCourse, setUnregisteringCourse] = useState<Course | null>(null);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [selectingCourseName, setSelectingCourseName] = useState<string>("");
  const [selectingCourses, setSelectingCourses] = useState<Course[]>([]);

  const registeredIds = useMemo(
    () => new Set(registeredCourses.map((c) => c.id)),
    [registeredCourses]
  );

  // Fetch courses từ Supabase
  const loadCourses = async () => {
    setLoading(true);
    const courses = await fetchCourses();
    setAllCourses(courses);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (allCourses.length === 0) return;
    
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const ids: string[] = JSON.parse(raw);
        const courses = allCourses.filter((c) => ids.includes(c.id));
        setRegisteredCourses(courses);
      } catch {
        /* ignore malformed storage */
      }
    }
  }, [allCourses]);

  useEffect(() => {
    if (allCourses.length === 0) return;
    
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const ids: string[] = JSON.parse(e.newValue);
          const courses = allCourses.filter((c) => ids.includes(c.id));
          setRegisteredCourses(courses);
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [allCourses]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const persistIds = (courses: Course[]) => {
    const ids = courses.map((c) => c.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const handleRegister = (courseName: string, coursesWithSameName: Course[]) => {
    // Lọc các course đã đăng ký
    const registeredSameName = coursesWithSameName.filter((c) => 
      registeredCourses.some((reg) => reg.id === c.id)
    );
    
    // Nếu tất cả đã đăng ký, mở modal hủy đăng ký (lấy course đầu tiên)
    if (registeredSameName.length === coursesWithSameName.length && coursesWithSameName.length > 0) {
      setUnregisteringCourse(coursesWithSameName[0]);
      setIsUnregisterModalOpen(true);
      return;
    }

    // Kiểm tra xem có nhiều loại (lý thuyết và thực hành) không
    const hasLyThuyet = coursesWithSameName.some((c) => !c.isThucHanh);
    const hasThucHanh = coursesWithSameName.some((c) => c.isThucHanh);

    // Nếu có cả lý thuyết và thực hành, hiển thị modal chọn loại
    if (hasLyThuyet && hasThucHanh) {
      setSelectingCourseName(courseName);
      setSelectingCourses(coursesWithSameName);
      setIsSelectTypeModalOpen(true);
      return;
    }

    // Nếu chỉ có 1 loại, đăng ký trực tiếp (lấy course đầu tiên chưa đăng ký)
    const courseToRegister = coursesWithSameName.find((c) => 
      !registeredCourses.some((reg) => reg.id === c.id)
    );

    if (!courseToRegister) return;

    // Kiểm tra trùng lịch
    if (hasConflict(courseToRegister, registeredCourses)) {
      setToast({
        message: "Trùng lịch! Vui lòng chọn học phần khác.",
        tone: "error",
      });
      return;
    }

    // Đăng ký học phần
    setRegisteredCourses((prev) => {
      const next = [...prev, courseToRegister];
      persistIds(next);
      return next;
    });
    setToast({ message: "Đăng ký thành công!", tone: "success" });
  };

  const handleSelectCourseType = (type: 'ly_thuyet' | 'thuc_hanh' | 'both') => {
    const coursesToRegister: Course[] = [];
    
    if (type === 'ly_thuyet' || type === 'both') {
      const lyThuyetCourse = selectingCourses.find((c) => !c.isThucHanh && !registeredCourses.some((reg) => reg.id === c.id));
      if (lyThuyetCourse) coursesToRegister.push(lyThuyetCourse);
    }
    
    if (type === 'thuc_hanh' || type === 'both') {
      const thucHanhCourse = selectingCourses.find((c) => c.isThucHanh && !registeredCourses.some((reg) => reg.id === c.id));
      if (thucHanhCourse) coursesToRegister.push(thucHanhCourse);
    }

    // Kiểm tra trùng lịch cho tất cả các course sẽ đăng ký
    for (const course of coursesToRegister) {
      if (hasConflict(course, registeredCourses)) {
        setToast({
          message: `"${course.name}" trùng lịch! Vui lòng chọn học phần khác.`,
          tone: "error",
        });
        setIsSelectTypeModalOpen(false);
        return;
      }
    }

    // Đăng ký tất cả các course đã chọn
    setRegisteredCourses((prev) => {
      const next = [...prev, ...coursesToRegister];
      persistIds(next);
      return next;
    });
    
    const typeNames = {
      'ly_thuyet': 'Lý thuyết',
      'thuc_hanh': 'Thực hành',
      'both': 'Cả hai'
    };
    
    setToast({ message: `Đăng ký ${typeNames[type]} thành công!`, tone: "success" });
    setIsSelectTypeModalOpen(false);
    setSelectingCourseName("");
    setSelectingCourses([]);
  };

  const handleConfirmUnregister = () => {
    if (!unregisteringCourse) return;

    // Hủy đăng ký tất cả các course cùng tên
    const courseName = unregisteringCourse.name;
    setRegisteredCourses((prev) => {
      const next = prev.filter((c) => c.name !== courseName);
      persistIds(next);
      return next;
    });
    setToast({ message: "Hủy đăng ký thành công!", tone: "success" });
    setIsUnregisterModalOpen(false);
    setUnregisteringCourse(null);
  };

  const handleAddCourse = async (formData: { ten_mon_hoc: string; ten_giao_vien: string; so_phong: string; ca_hoc: number; thu: number; loai_mon: 'ly_thuyet' | 'thuc_hanh' }) => {
    try {
      // Tính toán startPeriod và countPeriod từ ca_hoc (1 ca = 3 tiết)
      const startPeriod = (formData.ca_hoc - 1) * 3 + 1;
      const countPeriod = 3;
      
      // Tạo mã môn học tự động từ tên môn (hoặc có thể để user nhập sau)
      const ma_mh = `MH${Date.now()}`;
      
      // Map sang format DatabaseCourse
      const courseData = {
        ma_mh: ma_mh,
        ten_mon_hoc: formData.ten_mon_hoc,
        so_tin_chi: 3, // Mặc định 3 tín chỉ cho 1 ca
        so_tin_chi_hoc_phi: 3,
        tong_tiet: 45,
        ly_thuyet: 30,
        thuc_hanh: 15,
        mon_bat_buoc: false,
        da_hoc: false,
        hoc_ky: null,
        nam_hoc: null,
        // Lưu thông tin bổ sung vào các trường có sẵn
        chuyen_nganh: formData.ten_giao_vien, // Tạm lưu tên GV vào đây
        mon_hoc_da_hoc_va_dat: JSON.stringify({
          thu: formData.thu,
          startPeriod: startPeriod,
          countPeriod: countPeriod,
          so_phong: formData.so_phong || "Chưa xác định",
          loai_mon: formData.loai_mon, // Lưu loại môn học
        }), // Lưu schedule và phòng vào đây dạng JSON
      };
      
      await createCourse(courseData);
      setToast({ message: "Thêm học phần thành công!", tone: "success" });
      await loadCourses(); // Reload danh sách
    } catch (error: any) {
      setToast({
        message: error.message || "Có lỗi xảy ra khi thêm học phần",
        tone: "error",
      });
      throw error;
    }
  };

  const handleEditCourse = async (course: Course) => {
    setEditingCourse(course);
    // Load form data từ course
    const formData = await courseToFormData(course);
    setEditFormData(formData);
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async (formData: { ten_mon_hoc: string; ten_giao_vien: string; so_phong: string; ca_hoc: number; thu: number; loai_mon: 'ly_thuyet' | 'thuc_hanh' }) => {
    if (!editingCourse) return;
    
    try {
      // Lấy course từ database để có ID
      const dbCourse = await fetchCourseByCode(editingCourse.code);
      if (!dbCourse) {
        throw new Error('Không tìm thấy học phần cần sửa');
      }

      // Tính toán startPeriod và countPeriod từ ca_hoc
      const startPeriod = (formData.ca_hoc - 1) * 3 + 1;
      const countPeriod = 3;
      
      // Map sang format DatabaseCourse
      const courseData = {
        ten_mon_hoc: formData.ten_mon_hoc,
        chuyen_nganh: formData.ten_giao_vien,
        mon_hoc_da_hoc_va_dat: JSON.stringify({
          thu: formData.thu,
          startPeriod: startPeriod,
          countPeriod: countPeriod,
          so_phong: formData.so_phong || "Chưa xác định",
          loai_mon: formData.loai_mon, // Lưu loại môn học
        }),
      };
      
      await updateCourse(editingCourse.code, courseData);
      setToast({ message: "Cập nhật học phần thành công!", tone: "success" });
      await loadCourses(); // Reload danh sách
      setIsEditModalOpen(false);
      setEditingCourse(null);
    } catch (error: any) {
      setToast({
        message: error.message || "Có lỗi xảy ra khi cập nhật học phần",
        tone: "error",
      });
      throw error;
    }
  };

  // Convert Course sang CourseFormData
  const courseToFormData = async (course: Course) => {
    // Tính ca_hoc từ startPeriod (1 ca = 3 tiết)
    const ca_hoc = Math.floor((course.schedule.startPeriod - 1) / 3) + 1;
    
    // Lấy loại môn học từ database
    const dbCourse = await fetchCourseByCode(course.code);
    let loai_mon: 'ly_thuyet' | 'thuc_hanh' = 'ly_thuyet';
    
    if (dbCourse?.mon_hoc_da_hoc_va_dat) {
      try {
        const scheduleData = JSON.parse(dbCourse.mon_hoc_da_hoc_va_dat);
        if (scheduleData.loai_mon === 'thuc_hanh') {
          loai_mon = 'thuc_hanh';
        }
      } catch {
        // Nếu không parse được, kiểm tra isThucHanh từ Course
        if (course.isThucHanh) {
          loai_mon = 'thuc_hanh';
        }
      }
    } else if (course.isThucHanh) {
      loai_mon = 'thuc_hanh';
    }
    
    return {
      ten_mon_hoc: course.name,
      ten_giao_vien: course.lecturer,
      so_phong: course.room !== "Chưa xác định" ? course.room : '',
      ca_hoc: ca_hoc,
      thu: course.schedule.day,
      loai_mon: loai_mon,
    };
  };

  const handleDeleteClick = (course: Course) => {
    setDeletingCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;

    setIsDeleting(true);
    try {
      await deleteCourse(deletingCourse.code);
      setToast({ message: "Xóa học phần thành công!", tone: "success" });
      setIsDeleteModalOpen(false);
      setDeletingCourse(null);
      await loadCourses(); // Reload danh sách
    } catch (error: any) {
      setToast({
        message: error.message || "Có lỗi xảy ra khi xóa học phần",
        tone: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex w-full flex-col gap-6 px-6 py-10 lg:px-12">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/80">
            Course Registration
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Danh sách học phần
          </h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Chọn học phần và đăng ký. Lịch đã đăng ký sẽ hiển thị ở trang Thời khóa biểu.
          </p>
        </div>
        <nav className="flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-1 text-sm font-semibold text-indigo-100 shadow-lg shadow-indigo-500/20 backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-white/20"
          >
            ← Về Thời khóa biểu
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-fuchsia-400"
          >
            Danh sách học phần
          </Link>
        </nav>
      </header>

      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur ${
            toast.tone === "error"
              ? "border border-rose-200/40 bg-rose-500/20 text-rose-50"
              : "border border-emerald-200/40 bg-emerald-500/20 text-emerald-50"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Đang tải danh sách học phần...</div>
        </div>
      ) : (
        <CourseList
          courses={allCourses}
          onRegister={handleRegister}
          onEdit={handleEditCourse}
          onDelete={handleDeleteClick}
          registeredCourseIds={registeredIds}
        />
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-4 text-2xl font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-fuchsia-400 hover:scale-110"
          title="Thêm học phần"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCourse}
        mode="add"
      />

      <AddCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCourse(null);
          setEditFormData(null);
        }}
        onSubmit={handleUpdateCourse}
        initialData={editFormData || undefined}
        mode="edit"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        courseName={deletingCourse?.name || ''}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCourse(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <UnregisterConfirmModal
        isOpen={isUnregisterModalOpen}
        courseName={unregisteringCourse?.name || ''}
        onClose={() => {
          setIsUnregisterModalOpen(false);
          setUnregisteringCourse(null);
        }}
        onConfirm={handleConfirmUnregister}
      />

      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        courseName={selectingCourseName}
        hasLyThuyet={selectingCourses.some((c) => !c.isThucHanh)}
        hasThucHanh={selectingCourses.some((c) => c.isThucHanh)}
        onClose={() => {
          setIsSelectTypeModalOpen(false);
          setSelectingCourseName("");
          setSelectingCourses([]);
        }}
        onSelect={handleSelectCourseType}
      />
    </main>
  );
}

