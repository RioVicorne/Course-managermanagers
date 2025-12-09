"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TimetableGrid from "../components/TimetableGrid";
import { Course } from "../data/mockData";
import { fetchCourses } from "../lib/courses";

type ToastState = {
  message: string;
  tone: "success" | "error";
} | null;

const STORAGE_KEY = "registeredCourseIds";

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

export default function HomePage() {
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const registeredIds = useMemo(
    () => new Set(registeredCourses.map((c) => c.id)),
    [registeredCourses]
  );

  const handleRegister = (course: Course) => {
    if (hasConflict(course, registeredCourses)) {
      setToast({
        message: "Trùng lịch! Vui lòng chọn học phần khác.",
        tone: "error",
      });
      return;
    }
    setRegisteredCourses((prev) => [...prev, course]);
    setToast({ message: "Đăng ký thành công!", tone: "success" });
  };

  // Fetch courses từ Supabase
  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      const courses = await fetchCourses();
      setAllCourses(courses);
      setLoading(false);
    }
    loadCourses();
  }, []);

  // Hydrate from storage (data written by /courses page)
  useEffect(() => {
    if (allCourses.length === 0) return;

    const raw =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const ids: string[] = JSON.parse(raw);
        const courses = allCourses.filter((c) => ids.includes(c.id));
        setRegisteredCourses(courses);
      } catch {
        // ignore malformed storage
      }
    }
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

  return (
    <main className="flex w-full flex-col gap-6 px-5 py-10 lg:px-10">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Đăng ký học phần NLU
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <nav className="relative inline-flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-1 text-sm font-semibold text-indigo-100 shadow-lg shadow-indigo-500/20 backdrop-blur">
            {(() => {
              const tabs = [
                { href: "/", label: "Thời khóa biểu" },
                { href: "/courses", label: "Danh sách học phần" },
              ];
              const activeIndex = Math.max(
                0,
                tabs.findIndex((tab) => pathname === tab.href)
              );
              return (
                <>
                  <span
                    className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-90 transition duration-300 ease-out"
                    style={{ transform: `translateX(${activeIndex * 100}%)` }}
                  />
                  {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        className={`relative z-10 rounded-xl px-4 py-2 transition duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-indigo-100/70 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
                </>
              );
            })()}
          </nav>
        </div>
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

      <TimetableGrid registeredCourses={registeredCourses} />
    </main>
  );
}
