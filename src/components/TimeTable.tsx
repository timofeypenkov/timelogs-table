import React, { useState, useMemo } from "react";
import Tooltip from "./Tooltip";
import { generateMockData } from "../utils/mockData";
import { interpolateColor } from "../utils/colorUtils";

interface TooltipState {
  content: string;
  visible: boolean;
  position: { top: number; left: number };
}

interface TaskRecord {
  id: string;
  project: string;
  description: string;
  date: string;
  time: number;
}

interface Person {
  id: string;
  name: string;
  team: string;
  records: TaskRecord[];
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

  const aggregatedData = useMemo(
    () => prepareAggregatedData(teams, dates),
    [teams, dates],
  );

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
      <tr className="sticky top-0 z-20 bg-gray-100">
        <th className="sticky left-0 bg-gray-100 p-2 w-40"></th>
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
    <tr className="sticky top-[2.5rem] z-10  m-4 ">
      <th className="sticky left-0 bg-gray-100 p-2 w-40"></th>
      {dates.map((date, index) => (
        <th key={index} className={`w-20 font-normal`}>
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

  const renderTaskRows = (tasks: Record<string, TaskRecord[]>) => {
    return Object.entries(tasks).map(([taskDescription, taskRecords]) => {
      const aggregatedRecords = dates.map((date) => {
        const sum = taskRecords
          .filter((record) => record.date === date.fullDate)
          .reduce((acc, record) => acc + record.time, 0);
        return sum.toFixed(2) !== "0.00" ? sum.toFixed(2) + " h" : "";
      });

      return (
        <tr key={taskRecords[0].id}>
          <td className="sticky left-0 bg-gray-100 text-sm p-2 border shadow-md w-40">
            {taskDescription}
          </td>
          {aggregatedRecords.map((record, idx) => (
            <td
              key={idx}
              className={`bg-white text-base p-2 text-center border min-w-20`}
            >
              {record}
            </td>
          ))}
        </tr>
      );
    });
  };

  const renderProjectRows = (person: Person) => {
    return person.projects.map((project) => (
      <React.Fragment key={project.project}>
        <tr
          onClick={() => toggleExpandedProject(project.project)}
          className="cursor-pointer"
        >
          <td className="sticky left-0 bg-gray-300 text-base p-2 border shadow-md w-40">
            {project.project}
          </td>
          {project.dailyTotals.map((dailyTotal, idx) => (
            <td
              key={idx}
              className={`bg-gray-300 text-base p-2 text-center border min-w-20`}
            >
              {dailyTotal.total}
            </td>
          ))}
        </tr>
        {expandedProject === project.project && renderTaskRows(project.tasks)}
      </React.Fragment>
    ));
  };

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
          {team.members.map((person) => (
            <React.Fragment key={person.id}>
              <tr
                onClick={() => toggleExpandedPerson(person.id)}
                className="cursor-pointer"
              >
                <td className="sticky left-0 bg-gray-200 text-base p-2 border shadow-md w-40">
                  {person.name}
                </td>
                {person.dailyTotals.map((dailyTotal, idx) => (
                  <td
                    key={idx}
                    className={`bg-white text-base p-2 text-center border min-w-20 ${dailyTotal.total === "" ? "bg-warning" : ""}`}
                    style={{
                      backgroundColor: dailyTotal.total
                        ? interpolateColor(parseFloat(dailyTotal.total))
                        : "",
                    }}
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        e,
                        team.name,
                        person.name,
                        dailyTotal.date,
                        dailyTotal.total,
                      )
                    }
                    onMouseLeave={handleMouseLeaveTooltip}
                  >
                    {dailyTotal.total || <span>!</span>}
                  </td>
                ))}
              </tr>
              {expandedPerson === person.id && renderProjectRows(person)}
            </React.Fragment>
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
      <div className="mb-4 m-4 rounded-lg min-w-max w-full ">
        <table className="min-w-max w-full">
          <thead>
            {renderMonthHeader()}
            {renderDateHeader()}
          </thead>
        </table>
      </div>
      {aggregatedData.map((team) => renderTeamTable(team))}
    </div>
  );
};

export default TimeTable;
