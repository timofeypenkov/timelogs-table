import React from "react";
import { DateInfo, Person } from "../TimeTable";
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
      {expandedProject === project.project && TaskRows(dates, project.tasks)}
    </React.Fragment>
  ));
};
