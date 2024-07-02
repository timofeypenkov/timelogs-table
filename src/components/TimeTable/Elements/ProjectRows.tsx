import React from "react";
import { DateInfo, Person } from "../TimeTable.types";
import { TaskRows } from "./TaskRows";

export const ProjectRows = (
  expandedProject,
  toggleExpandedProject,
  dates: DateInfo[],
  person: Person,
) => {
  return person.projects.map((project) => (
    <React.Fragment key={project.project}>
      <tr
        onClick={() => toggleExpandedProject(project.project)}
        className="cursor-pointer transition-transform duration-300 ease-in-out"
      >
        <td className="sticky left-0 bg-gray-300 text-base p-2 border shadow-md w-40">
          {project.project}
        </td>
        {project.dailyTotals.map((dailyTotal, idx: number) => (
          <td
            key={idx}
            className={`bg-gray-300 text-base p-2 text-center border min-w-20`}
          >
            {dailyTotal.total}
          </td>
        ))}
      </tr>
      {expandedProject === project.project && (
        <tr className="transition-max-height duration-500 ease-in-out max-h-0 overflow-hidden">
          <td colSpan={dates.length + 1} className="p-0">
            {TaskRows(dates, project.tasks)}
          </td>
        </tr>
      )}
    </React.Fragment>
  ));
};
