import { supabase } from './supabase';
import type { Course, CourseSchedule } from '../data/mockData';

// Type cho dữ liệu từ Supabase
export type DatabaseCourse = {
  id: number;
  stt: number | null;
  ma_mh: string;
  ten_mon_hoc: string;
  chuyen_nganh: string | null;
  mon_cot_loi: string | null;
  so_tin_chi: number | null;
  so_tin_chi_hoc_phi: number | null;
  mon_bat_buoc: boolean;
  da_hoc: boolean;
  nhom: string | null;
  nhanh: string | null;
  so_tin_chi_toi_thieu: number | null;
  so_tin_chi_toi_da: number | null;
  mon_hoc_da_hoc_va_dat: string | null;
  tong_tiet: number | null;
  ly_thuyet: number | null;
  thuc_hanh: number | null;
  tiet_thanh_phan: string | null;
  hoc_ky: string | null;
  nam_hoc: string | null;
  created_at: string;
  updated_at: string;
};

// Mảng màu sắc để gán ngẫu nhiên cho các môn học
const colorPalettes = [
  { from: "#6366f1", to: "#a855f7" },
  { from: "#06b6d4", to: "#0ea5e9" },
  { from: "#22c55e", to: "#84cc16" },
  { from: "#f97316", to: "#f59e0b" },
  { from: "#ec4899", to: "#a855f7" },
  { from: "#14b8a6", to: "#22d3ee" },
  { from: "#8b5cf6", to: "#6366f1" },
  { from: "#f472b6", to: "#fb7185" },
  { from: "#38bdf8", to: "#3b82f6" },
  { from: "#fbbf24", to: "#fb923c" },
];

// Transform database course sang UI course
function transformCourse(dbCourse: DatabaseCourse, index: number): Course {
  const colorIndex = index % colorPalettes.length;
  
  // Parse schedule từ JSON nếu có
  let schedule = {
    day: 2 as 2 | 3 | 4 | 5 | 6 | 7 | 8,
    startPeriod: 1,
    countPeriod: 3,
  };
  let room = "Chưa xác định";
  
  let isThucHanh = false;
  
  if (dbCourse.mon_hoc_da_hoc_va_dat) {
    try {
      const scheduleData = JSON.parse(dbCourse.mon_hoc_da_hoc_va_dat);
      if (scheduleData.thu && scheduleData.startPeriod && scheduleData.countPeriod) {
        schedule = {
          day: scheduleData.thu as 2 | 3 | 4 | 5 | 6 | 7 | 8,
          startPeriod: scheduleData.startPeriod,
          countPeriod: scheduleData.countPeriod,
        };
      }
      if (scheduleData.so_phong) {
        room = scheduleData.so_phong;
      }
      // Chỉ đánh dấu là thực hành nếu loai_mon === 'thuc_hanh' trong JSON
      if (scheduleData.loai_mon === 'thuc_hanh') {
        isThucHanh = true;
      }
    } catch {
      // Ignore parse error
    }
  }
  
  // Mặc định là lý thuyết (isThucHanh = false), chỉ khi có loai_mon === 'thuc_hanh' mới là thực hành
  
  return {
    id: dbCourse.ma_mh || `course-${dbCourse.id}`,
    name: dbCourse.ten_mon_hoc,
    code: dbCourse.ma_mh,
    credits: dbCourse.so_tin_chi || 0,
    lecturer: dbCourse.chuyen_nganh || "Chưa có thông tin", // Lưu tạm tên GV vào chuyen_nganh
    room: room,
    schedule: schedule,
    color: colorPalettes[colorIndex],
    isThucHanh: isThucHanh,
  };
}

// Fetch tất cả courses từ Supabase
export async function fetchCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('hoc_ky', { ascending: true })
      .order('stt', { ascending: true });

    if (error) {
      console.error('Lỗi khi fetch courses:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('Không có dữ liệu courses trong database');
      return [];
    }

    return data.map((course, index) => transformCourse(course, index));
  } catch (err) {
    console.error('Lỗi khi fetch courses:', err);
    return [];
  }
}

// Fetch courses theo học kỳ
export async function fetchCoursesBySemester(hocKy: string, namHoc: string): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('hoc_ky', hocKy)
      .eq('nam_hoc', namHoc)
      .order('stt', { ascending: true });

    if (error) {
      console.error('Lỗi khi fetch courses:', error);
      return [];
    }

    if (!data) return [];

    return data.map((course, index) => transformCourse(course, index));
  } catch (err) {
    console.error('Lỗi khi fetch courses:', err);
    return [];
  }
}

// Tạo học phần mới
export async function createCourse(courseData: Partial<DatabaseCourse>): Promise<DatabaseCourse> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi tạo course:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Không nhận được dữ liệu sau khi tạo course');
    }

    return data;
  } catch (err) {
    console.error('Lỗi khi tạo course:', err);
    throw err;
  }
}

// Lấy course theo mã môn học
export async function fetchCourseByCode(ma_mh: string): Promise<DatabaseCourse | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('ma_mh', ma_mh)
      .single();

    if (error) {
      console.error('Lỗi khi fetch course:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Lỗi khi fetch course:', err);
    return null;
  }
}

// Cập nhật học phần
export async function updateCourse(ma_mh: string, courseData: Partial<DatabaseCourse>): Promise<DatabaseCourse> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('ma_mh', ma_mh)
      .select();

    if (error) {
      console.error('Lỗi khi cập nhật course:', error);
      throw new Error(error.message || 'Không thể cập nhật học phần. Vui lòng kiểm tra RLS policies trong Supabase.');
    }

    if (!data || data.length === 0) {
      throw new Error('Không tìm thấy học phần cần cập nhật hoặc không có dữ liệu được trả về');
    }

    return data[0];
  } catch (err: any) {
    console.error('Lỗi khi cập nhật course:', err);
    throw err;
  }
}

// Xóa học phần
export async function deleteCourse(ma_mh: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('ma_mh', ma_mh);

    if (error) {
      console.error('Lỗi khi xóa course:', error);
      throw new Error(error.message || 'Không thể xóa học phần. Vui lòng kiểm tra RLS policies trong Supabase.');
    }
  } catch (err: any) {
    console.error('Lỗi khi xóa course:', err);
    throw err;
  }
}

