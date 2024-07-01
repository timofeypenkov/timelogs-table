import React, { useState, useRef } from "react";
import Tooltip from "./Tooltip";
import { generateMockData } from "../utils/mockData";
import { interpolateColor } from "../utils/colorUtils";

const { dates, teams } = generateMockData();

const TimeTable: React.FC = () => {
  const [tooltip, setTooltip] = useState({
    content: "",
    visible: false,
    position: { top: 0, left: 0 },
  });
  const [isDragging, setIsDragging] = useState(false);
  const [highlightColumn, setHighlightColumn] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const scrollPosition = useRef({ x: 0, y: 0 });

  const rafRef = useRef<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    startPosition.current = { x: event.clientX, y: event.clientY };
    if (scrollContainerRef.current) {
      scrollPosition.current = {
        x: scrollContainerRef.current.scrollLeft,
        y: scrollContainerRef.current.scrollTop,
      };
    }
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const dx = event.clientX - startPosition.current.x;
    const dy = event.clientY - startPosition.current.y;
    scrollContainerRef.current.scrollLeft = scrollPosition.current.x - dx;
    scrollContainerRef.current.scrollTop = scrollPosition.current.y - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const updateTooltipAndHighlight = (
    event,
    person,
    date,
    weekday,
    time,
    index,
  ) => {
    const position = { top: event.clientY + 10, left: event.clientX + 10 };
    const fullDate = new Date(`2024-${date.slice(3, 5)}-${date.slice(0, 2)}`);
    const formattedDate = fullDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const content = `${person}\n${formattedDate}\n${time} ч`;
    setTooltip({ content, visible: true, position });
    setHighlightColumn(index);
  };

  const handleMouseEnter = (
    event: React.MouseEvent,
    person: string,
    date: string,
    weekday: string,
    time: string,
    index: number,
  ) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      updateTooltipAndHighlight(event, person, date, weekday, time, index);
    });
  };

  const handleMouseLeaveTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
    setHighlightColumn(null);
  };

  const renderMonthHeader = () => {
    const monthGroups = dates.reduce(
      (acc, date, index) => {
        if (!acc[date.month]) {
          acc[date.month] = [];
        }
        acc[date.month].push(index);
        return acc;
      },
      {} as Record<string, number[]>,
    );

    return (
      <tr className="sticky top-0 z-20 bg-white">
        <th className="sticky left-0 bg-white p-2"></th>
        {Object.entries(monthGroups).map(([month, indices], idx) => (
          <th
            key={idx}
            className={`${idx % 2 === 0 ? "bg-gray-200" : "bg-gray-300"}`}
            colSpan={indices.length}
          >
            <div className="w-full text-center p-2 font-normal">{month}</div>
          </th>
        ))}
      </tr>
    );
  };

  const renderDateHeader = () => (
    <tr className="sticky top-[2.5rem] z-10 bg-white">
      <th className="sticky left-0 bg-gray-200 p-2 min-w-40">Name</th>
      {dates.map((date, index) => (
        <th
          key={index}
          className={`p-2 w-20  font-normal ${date.isWeekend ? "bg-gray-300" : "bg-gray-100"}`}
        >
          <div className="text-base">{date.date}</div>
          <div className="text-sm">{date.weekday}</div>
        </th>
      ))}
    </tr>
  );

  const renderTeamTable = (team) => (
    <table key={team.name} className="mb-4 mt-2 rounded shadow-lg bg-white ">
      <thead>
        <tr>
          <th className="sticky left-0 p-2 font-bold text-xl text-left w-40 ">
            {team.name}
          </th>
        </tr>
      </thead>
      <tbody>
        {team.members.map((person, index) => (
          <tr key={index}>
            <td className="sticky left-0 bg-gray-200 text-base p-2 border shadow-md min-w-40">
              {person.name}
            </td>
            {person.times.map((time, idx) => (
              <td
                key={idx}
                className="bg-white text-base p-2 text-center border min-w-20"
                style={{
                  backgroundColor: interpolateColor(parseFloat(time)),
                }}
                onMouseEnter={(e) =>
                  handleMouseEnter(
                    e,
                    person.name,
                    dates[idx].date,
                    dates[idx].weekday,
                    time,
                    idx,
                  )
                }
                onMouseLeave={handleMouseLeaveTooltip}
              >
                {time} h
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div
      className={`relative overflow-auto smooth-scroll select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Tooltip
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
      <table className="min-w-max relative">
        <thead>
          {renderMonthHeader()}
          {renderDateHeader()}
        </thead>
      </table>
      {teams.map((team) => renderTeamTable(team))}
    </div>
  );
};

export default TimeTable;
