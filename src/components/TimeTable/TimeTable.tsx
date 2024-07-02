import React, { useState, useMemo } from "react";
import Tooltip from "../Tooltip";
import { generateMockData } from "../../utils/mockData";
import { MonthHeader } from "./Elements/MonthHeader";
import { DateHeader } from "./Elements/DateHeader";
import { DateInfo, TaskRecord, Team, TooltipState } from "./TimeTable.types";
import { TeamTable } from "./Elements/TeamTable";

const { dates, teams }: { dates: DateInfo[]; teams: Team[] } =
  generateMockData();

const prepareAggregatedData = (teams: Team[], dates: DateInfo[]) => {
  const aggregatedData = teams.map((team) => {
    const members = team.members.map((person) => {
      const dailyTotals = dates.map((date) => ({
        date: date.fullDate,
        total: person.records
          .filter((record) => record.date === date.fullDate)
          .reduce((sum, record) => sum + record.time, 0)
          .toFixed(2),
      }));

      const projects = person.records.reduce(
        (acc, record) => {
          if (!acc[record.project]) {
            acc[record.project] = {};
          }
          if (!acc[record.project][record.description]) {
            acc[record.project][record.description] = [];
          }
          acc[record.project][record.description].push(record);
          return acc;
        },
        {} as Record<string, Record<string, TaskRecord[]>>,
      );

      const projectTotals = Object.entries(projects).map(
        ([project, tasks]) => ({
          project,
          tasks,
          dailyTotals: dates.map((date) => ({
            date: date.fullDate,
            total: Object.values(tasks)
              .flat()
              .filter((task) => task.date === date.fullDate)
              .reduce((sum, task) => sum + task.time, 0)
              .toFixed(2),
          })),
        }),
      );

      return { ...person, dailyTotals, projects: projectTotals };
    });

    return { ...team, members };
  });

  return aggregatedData;
};

const TimeTable: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    content: "",
    visible: false,
    position: { top: 0, left: 0 },
  });
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const aggregatedData = useMemo(() => prepareAggregatedData(teams, dates), []);

  const updateTooltip = (
    event: React.MouseEvent<HTMLTableCellElement>,
    teamName: string,
    person: string,
    fullDate: string,
    time: string,
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
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLTableCellElement>,
    teamName: string,
    person: string,
    fullDate: string,
    time: string,
  ) => {
    updateTooltip(event, teamName, person, fullDate, time);
  };

  const handleMouseLeaveTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const toggleExpandedPerson = (personId: string) => {
    setExpandedPerson(expandedPerson === personId ? null : personId);
    setExpandedProject(null); // Collapse all projects when a new person is expanded
  };

  const toggleExpandedProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  return (
    <div className="relative overflow-auto smooth-scroll select-none bg-gray-100">
      <Tooltip
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
      <div className="mb-4 m-4 rounded-lg min-w-max w-full px-4">
        <table className="min-w-max w-full">
          <thead>
            {MonthHeader(dates)}
            {DateHeader(dates)}
          </thead>
        </table>
      </div>
      {aggregatedData.map((team) =>
        TeamTable(
          toggleExpandedPerson,
          handleMouseEnter,
          handleMouseLeaveTooltip,
          expandedPerson,
          expandedProject,
          toggleExpandedProject,
          dates,
          team,
        ),
      )}
    </div>
  );
};

export default TimeTable;
