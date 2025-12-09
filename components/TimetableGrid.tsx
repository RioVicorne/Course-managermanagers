'use client';

import { Clock3 } from "lucide-react";
import { Course } from "../data/mockData";

type TimetableGridProps = {
  registeredCourses: Course[];
};

const days = [
  { label: "Thứ 2", value: 2 },
  { label: "Thứ 3", value: 3 },
  { label: "Thứ 4", value: 4 },
  { label: "Thứ 5", value: 5 },
  { label: "Thứ 6", value: 6 },
  { label: "Thứ 7", value: 7 },
  { label: "CN", value: 8 },
];

const periods = Array.from({ length: 16 }, (_, i) => i + 1);
const ROW_HEIGHT = 44;

const periodTimeline = [
  { period: 1, time: "07:00" },
  { period: 2, time: "07:50" },
  { period: 3, time: "08:40" },
  { period: 4, time: "09:30" },
  { period: 5, time: "10:20" },
  { period: 6, time: "11:10" },
  { period: 7, time: "12:30" },
  { period: 8, time: "13:20" },
  { period: 9, time: "14:10" },
  { period: 10, time: "15:00" },
  { period: 11, time: "15:50" },
  { period: 12, time: "16:40" },
  { period: 13, time: "17:30" },
  { period: 14, time: "18:20" },
  { period: 15, time: "19:10" },
  { period: 16, time: "20:00" },
];

const periodGroups = (() => {
  const groups: { start: number; length: number }[] = [];
  const chunkSize = 3;
  for (let i = 0; i < periodTimeline.length; i += chunkSize) {
    const slice = periodTimeline.slice(i, i + chunkSize);
    if (slice.length === 0) continue;
    groups.push({ start: slice[0].period, length: slice.length });
  }
  return groups;
})();

export function TimetableGrid({ registeredCourses }: TimetableGridProps) {
  return (
    <div className="card-surface p-5 h-full w-full space-y-4">
      <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="grid w-full grid-cols-[110px_repeat(7,minmax(0,1fr))_110px] items-center gap-[1px] border-b border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
          <div className="text-xs text-slate-400">Timeline</div>
          {days.map((day) => (
            <div
              key={day.value}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center shadow-inner shadow-slate-950/30"
            >
              {day.label}
            </div>
          ))}
          <div className="text-right text-xs text-slate-400">Time</div>
        </div>

        <div
          className="relative grid w-full grid-cols-[110px_repeat(7,minmax(0,1fr))_110px] gap-[1px] bg-white/5 px-4 pb-4"
          style={{ gridTemplateRows: `repeat(16, ${ROW_HEIGHT}px)` }}
        >
          {/* Timeline sidebar (per period) */}
          <div
            className="grid gap-0 rounded-md border border-white/10 bg-white/5 text-left text-sm font-semibold text-slate-100 shadow-inner shadow-slate-950/30 overflow-hidden"
            style={{
              gridRow: "1 / span 16",
              gridColumn: 1,
              gridTemplateRows: `repeat(16, ${ROW_HEIGHT}px)`,
            }}
          >
            {periodGroups.map((group) => (
              <div
                key={`timeline-left-group-${group.start}`}
                className="grid border border-white/10"
                style={{
                  gridRow: `${group.start} / span ${group.length}`,
                  gridTemplateRows: `repeat(${group.length}, ${ROW_HEIGHT}px)`,
                }}
              >
                {Array.from({ length: group.length }).map((_, i) => {
                  const period = group.start + i;
                  return (
                    <span
                      key={`timeline-left-${period}`}
                      className="grid h-full w-full place-items-center bg-white/10 text-center text-[13px] font-semibold text-slate-100"
                      style={{ gridRow: `${i + 1} / span 1` }}
                    >
                      Tiết {period}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Empty grid cells grouped by 3-period blocks */}
          {periodGroups.map((group) =>
            days.map((day, dayIndex) => (
              <div
                key={`${day.value}-group-${group.start}`}
                className="relative h-full w-full overflow-hidden border border-white/10 bg-white/5"
                style={{
                  gridRow: `${group.start} / span ${group.length}`,
                  gridColumn: dayIndex + 2,
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent ${ROW_HEIGHT - 1}px, rgba(255,255,255,0.07) ${ROW_HEIGHT - 1}px, rgba(255,255,255,0.07) ${ROW_HEIGHT}px)`,
                }}
              />
            ))
          )}

          {/* Right-side time rail */}
          <div
            className="grid gap-0 rounded-md border border-white/10 bg-white/5 text-right text-sm font-semibold text-slate-100 shadow-inner shadow-slate-950/30 overflow-hidden"
            style={{
              gridRow: "1 / span 16",
              gridColumn: 9,
              gridTemplateRows: `repeat(16, ${ROW_HEIGHT}px)`,
            }}
          >
            {periodGroups.map((group) => (
              <div
                key={`timeline-right-group-${group.start}`}
                className="grid border border-white/10"
                style={{
                  gridRow: `${group.start} / span ${group.length}`,
                  gridTemplateRows: `repeat(${group.length}, ${ROW_HEIGHT}px)`,
                }}
              >
                {Array.from({ length: group.length }).map((_, i) => {
                  const period = group.start + i;
                  const slot = periodTimeline.find((p) => p.period === period);
                  if (!slot) return null;
                  return (
                    <span
                      key={`timeline-right-${period}`}
                      className="grid h-full w-full place-items-center bg-white/10 whitespace-nowrap text-[11px] font-semibold text-slate-100 text-center"
                      style={{ gridRow: `${i + 1} / span 1` }}
                    >
                      {slot.time}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          {registeredCourses.map((course) => {
            const colIndex = days.findIndex((d) => d.value === course.schedule.day);
            if (colIndex === -1) return null;

            const gridColumn = colIndex + 2; // offset by label column
            const gridRowStart = course.schedule.startPeriod;
            const gridRowEnd = course.schedule.startPeriod + course.schedule.countPeriod;

            // Tính thời gian từ tiết
            const startSlot = periodTimeline.find((p) => p.period === course.schedule.startPeriod);
            const endPeriod = course.schedule.startPeriod + course.schedule.countPeriod - 1;
            const endSlot = periodTimeline.find((p) => p.period === endPeriod);
            
            // Tính thời gian kết thúc: mỗi tiết 50 phút
            let startTime = startSlot?.time || '';
            let endTime = '';
            if (startSlot) {
              const [hours, minutes] = startSlot.time.split(':').map(Number);
              const totalMinutes = hours * 60 + minutes + (course.schedule.countPeriod * 50);
              const endHours = Math.floor(totalMinutes / 60);
              const endMins = totalMinutes % 60;
              endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
            }

            // Kiểm tra nếu là thực hành thì đổi background và viền đỏ
            const isThucHanh = course.isThucHanh || false;
            const backgroundColor = isThucHanh ? '#fee2e2' : '#e0f2fe'; // Red background nếu thực hành, light blue nếu lý thuyết
            const borderLeftColor = isThucHanh ? '#ef4444' : '#22c55e'; // Red border nếu thực hành, green nếu lý thuyết

            return (
              <div
                key={course.id}
                className="relative h-full w-full overflow-hidden rounded-lg border-l-4 shadow-md"
                style={{
                  gridColumnStart: gridColumn,
                  gridColumnEnd: gridColumn + 1,
                  gridRowStart,
                  gridRowEnd,
                  backgroundColor: backgroundColor,
                  borderLeftColor: borderLeftColor,
                  borderTopColor: 'rgba(148, 163, 184, 0.3)',
                  borderRightColor: 'rgba(148, 163, 184, 0.3)',
                  borderBottomColor: 'rgba(148, 163, 184, 0.3)',
                }}
              >
                <div className="relative flex h-full w-full flex-col gap-1 p-2.5 text-slate-800 overflow-hidden">
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <h3 className="text-xs font-bold leading-tight break-words line-clamp-2">
                      {course.name}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[10px] text-slate-700">
                    {course.room !== "Chưa xác định" && (
                      <div className="flex items-center">
                        <span className="font-medium">Phòng: </span>
                        <span className="truncate">{course.room}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="font-medium">GV: </span>
                      <span className="truncate">{course.lecturer}</span>
                    </div>
                    {startTime && endTime && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock3 className="h-3 w-3 text-slate-600 flex-shrink-0" />
                        <span className="text-[10px] font-medium">{startTime} - {endTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimetableGrid;

