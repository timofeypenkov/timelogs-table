import React, { useState, useRef } from "react";
import Tooltip from "./Tooltip";
import { generateMockData } from "../utils/mockData";
import { interpolateColor } from "../utils/colorUtils";

interface TooltipState {
  content: string;
  visible: boolean;
  position: { top: number; left: number };
}

interface Person {
  name: string;
  times: string[];
}

interface Team {
  name: string;
  members: Person[];
}

interface DateInfo {
  fullDate: string;
  date: string;
  weekday: string;
  month: string;
  isWeekend: boolean;
}

const { dates, teams }: { dates: DateInfo[]; teams: Team[] } =
  generateMockData();

const TimeTable: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    content: "",
    visible: false,
    position: { top: 0, left: 0 },
  });
  const [highlightColumn, setHighlightColumn] = useState<number | null>(null);

  const rafRef = useRef<number | null>(null);

  const updateTooltipAndHighlight = (
    event: React.MouseEvent<HTMLTableCellElement>,
    teamName: string,
    person: string,
    fullDate: string,
    time: string,
    index: number,
  ) => {
    const position = { top: event.clientY + 10, left: event.clientX + 10 };
    const dateObj = new Date(fullDate);
    const formattedDate = dateObj.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const content = `${teamName}\n${person}\n${formattedDate}\n${time} ч`;
    setTooltip({ content, visible: true, position });
    setHighlightColumn(index);
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLTableCellElement>,
    teamName: string,
    person: string,
    fullDate: string,
    time: string,
    index: number,
  ) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      updateTooltipAndHighlight(event, teamName, person, fullDate, time, index);
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
    <tr className="sticky top-[2.5rem] z-10 bg-white m-4 ">
      <th className="sticky left-0 bg-white p-2 min-w-40"></th>
      {dates.map((date, index) => (
        <th key={index} className={`w-20 font-normal `}>
          <div className="flex items-center justify-center">
            <div
              className={`text-sm mt-4 w-8 h-8 rounded-full p-2 flex items-center justify-center ${date.isWeekend ? "bg-gray-300" : "bg-gray-100"}`}
            >
              {date.date}
            </div>
          </div>
          <div className={`text-sm text-gray-400 p-2`}>{date.weekday}</div>
        </th>
      ))}
    </tr>
  );

  const renderTeamTable = (team: Team) => (
    <div
      key={team.name}
      className="mb-4 m-4 rounded-lg min-w-max w-full shadow-lg bg-white p-4"
    >
      <table className="min-w-max w-full">
        <thead>
          <tr>
            <th className="sticky left-0 pb-2 font-bold text-xl text-left w-40 bg-white">
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
                      team.name,
                      person.name,
                      dates[idx].fullDate,
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
    </div>
  );

  return (
    <div className="relative overflow-auto smooth-scroll select-none bg-gray-100">
      <Tooltip
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
      <div className="mb-4 m-4 rounded-lg min-w-max w-full shadow-lg bg-white p-4">
        <table className="min-w-max w-full">
          <thead>
            {renderMonthHeader()}
            {renderDateHeader()}
          </thead>
        </table>
      </div>
      {teams.map((team) => renderTeamTable(team))}
    </div>
  );
};

export default TimeTable;
