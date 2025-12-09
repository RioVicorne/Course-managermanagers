import { supabase } from '../lib/supabase';
import { courses } from './parse-courses';

async function importCourses() {
  console.log('Bắt đầu import dữ liệu...');
  console.log(`Tổng số môn học: ${courses.length}`);

  try {
    // Xóa dữ liệu cũ nếu có
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .neq('id', 0); // Xóa tất cả

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.log('Lưu ý: Có thể bảng chưa tồn tại, sẽ tiếp tục tạo mới');
    }

    // Import dữ liệu mới
    const { data, error } = await supabase
      .from('courses')
      .insert(courses)
      .select();

    if (error) {
      console.error('❌ Lỗi khi import:', error);
      throw error;
    }

    console.log(`✅ Import thành công ${data?.length || 0} môn học!`);
    return data;
  } catch (err) {
    console.error('❌ Lỗi:', err);
    throw err;
  }
}

// Chạy import nếu được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  importCourses()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default importCourses;

