'use client';

import { useMemo, useState } from "react";
import { Check, Clock3, Pencil, Plus, Search, Trash2, UserRound } from "lucide-react";
import type { Course } from "../data/mockData";

type CourseListProps = {
  courses: Course[];
  onRegister: (courseName: string, coursesWithSameName: Course[]) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  registeredCourseIds: Set<string>;
};


export function CourseList({
  courses,
  onRegister,
  onEdit,
  onDelete,
  registeredCourseIds,
}: CourseListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase()) ||
        course.lecturer.toLowerCase().includes(query.toLowerCase())
    );
  }, [courses, query]);

  // Nhóm các course theo tên, chỉ lấy course đầu tiên của mỗi nhóm để hiển thị
  const uniqueCourses = useMemo(() => {
    const seen = new Set<string>();
    const unique: Course[] = [];
    const courseGroups: { [key: string]: Course[] } = {};

    filtered.forEach((course) => {
      if (!courseGroups[course.name]) {
        courseGroups[course.name] = [];
      }
      courseGroups[course.name].push(course);

      if (!seen.has(course.name)) {
        seen.add(course.name);
        unique.push(course);
      }
    });

    return { unique, groups: courseGroups };
  }, [filtered]);

  return (
    <div className="card-surface p-5 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Course Registration
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Danh sách học phần
          </h2>
        </div>
      </div>

      <label className="group relative w-full">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm tên môn, mã HP, giảng viên..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3 text-sm text-slate-50 placeholder:text-slate-400 shadow-inner shadow-slate-950/60 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        />
      </label>

      <div className="flex-1 space-y-3 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {uniqueCourses.unique.map((course) => {
            const coursesWithSameName = uniqueCourses.groups[course.name] || [];
            const isAnyRegistered = coursesWithSameName.some((c) => registeredCourseIds.has(c.id));
            
            // Kiểm tra xem có môn trùng nhau không (có cả lý thuyết và thực hành)
            const hasLyThuyet = coursesWithSameName.some((c) => !c.isThucHanh);
            const hasThucHanh = coursesWithSameName.some((c) => c.isThucHanh);
            const hasDuplicateTypes = hasLyThuyet && hasThucHanh;
            
            // Chỉ hiển thị "Đã đăng ký" khi có môn trùng nhau VÀ đã đăng ký
            const showRegistered = hasDuplicateTypes && isAnyRegistered;
            
            return (
              <div
                key={course.name}
                className="glass-panel rounded-2xl p-4 transition-transform duration-200 hover:translate-y-[-2px] hover:border-white/20 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {course.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200">
                      <span className="inline-flex items-center gap-1">
                        <UserRound className="h-4 w-4 text-indigo-200" />
                        {course.lecturer}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4 text-indigo-200" />
                        Thứ {course.schedule.day} • Tiết {course.schedule.startPeriod}-
                        {course.schedule.startPeriod + course.schedule.countPeriod - 1}
                      </span>
                      <span className="pill">Phòng {course.room}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(course)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        title="Sửa học phần"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(course)}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                        title="Xóa học phần"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onRegister(course.name, coursesWithSameName)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-lg transition ${
                        showRegistered
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400'
                          : 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-indigo-500/25 hover:from-indigo-400 hover:to-fuchsia-400'
                      }`}
                    >
                      {showRegistered ? (
                        <>
                          <Check className="h-4 w-4" /> Đã đăng ký
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Đăng ký
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="glass-panel rounded-2xl p-4 text-sm text-slate-300">
              Không tìm thấy học phần phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseList;

