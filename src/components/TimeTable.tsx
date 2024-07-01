import React, { useState, useRef } from "react";
import Tooltip from "./Tooltip";
import { generateMockData } from "../mockData";

const { dates, teams } = generateMockData();

const interpolateColor = (value: number): string => {
  const red = [173, 216, 230]; // Light blue
  const white = [255, 255, 255]; // White
  const blue = [255, 182, 193]; // Light pink

  if (value <= 0) return `rgb(${blue.join(",")})`;
  if (value >= 7) return `rgb(${red.join(",")})`;

  const mixColor = (color1: number[], color2: number[], weight: number) => {
    return color1.map((c, i) =>
      Math.round(c * (1 - weight) + color2[i] * weight),
    );
  };

  let color;
  if (value < 5) {
    color = mixColor(blue, white, value / 5);
  } else {
    color = mixColor(white, red, (value - 5) / 2);
  }

  return `rgb(${color.join(",")})`;
};

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

  const handleMouseEnter = (
    event: React.MouseEvent,
    person: string,
    date: string,
    weekday: string,
    time: string,
    index: number,
  ) => {
    const position = { top: event.clientY + 10, left: event.clientX + 10 };
    const content = `Name: ${person}\nDate: ${date}\nWeekday: ${weekday}\nTime: ${time}h`;
    setTooltip({ content, visible: true, position });
    setHighlightColumn(index);
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
      <div className="flex sticky top-0 z-20 bg-white">
        <div className="sticky left-0 w-40 bg-white p-2"></div>
        {Object.entries(monthGroups).map(([month, indices], idx) => (
          <div
            key={idx}
            className={`flex ${idx % 2 === 0 ? "bg-gray-200" : "bg-gray-300"}`}
            style={{ width: `${indices.length * 5}rem` }}
          >
            <div className="w-full text-center p-2 font-bold">{month}</div>
          </div>
        ))}
      </div>
    );
  };

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
      <div className="min-w-max relative">
        {highlightColumn !== null && (
          <div
            className="absolute top-0 bottom-0 bg-blue-200 opacity-50 pointer-events-none"
            style={{
              left: `${highlightColumn * 5 + 10}rem`,
              width: "5rem",
            }}
          ></div>
        )}
        <div className="top-0 z-50">
          {renderMonthHeader()}
          <div className="flex sticky top-[2.5rem] z-10 bg-white">
            <div className="sticky left-0 w-40 bg-gray-200 p-2 font-bold ">
              Name
            </div>
            {dates.map((date, index) => (
              <div key={index} className="flex flex-col w-20 p-2 bg-gray-100">
                <div>{date.date}</div>
                <div className="text-xs">{date.weekday}</div>
              </div>
            ))}
          </div>
        </div>
        {teams.map((team, teamIdx) => (
          <div key={teamIdx} className="mb-4 mt-2 rounded shadow-lg bg-white">
            <div className="flex w-full">
              <div className="sticky left-0 w-40  p-2 font-bold">
                {team.name}
              </div>
              <div className=""></div>
            </div>
            {team.members.map((person, index) => (
              <div key={index} className="flex">
                <div className="sticky left-0 w-40 bg-gray-200 p-2 shadow-md">
                  {person.name}
                </div>
                {person.times.map((time, idx) => (
                  <div
                    key={idx}
                    className="w-20 bg-white p-2 border"
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
                    {time}h
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTable;
