import React from "react";
import { DateInfo, Team } from "../TimeTable.types";
import { interpolateColor } from "../../../utils/colorUtils";
import { ProjectRows } from "./ProjectRows";
import { FaTimesCircle } from "react-icons/fa";

export const TeamTable = (
  toggleExpandedPerson: (id: string) => void,
  handleMouseEnter: any,
  handleMouseLeaveTooltip: any,
  expandedPerson: string | null,
  expandedProject: string | null,
  toggleExpandedProject: (id: string) => void,
  dates: DateInfo[],
  team: Team,
) => (
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
              className="cursor-pointer transition-transform duration-300 ease-in-out"
            >
              <td className="sticky left-0 bg-gray-200 text-base p-2 border shadow-md w-40 flex items-center justify-between">
                {person.name}
                {person.status === "disabled" && (
                  <FaTimesCircle className="text-red-500 ml-2" />
                )}
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
            {expandedPerson === person.id && (
              <tr className="transition-max-height duration-500 ease-in-out max-h-0 overflow-hidden">
                <td colSpan={dates.length + 1} className="p-0">
                  {ProjectRows(
                    expandedProject,
                    toggleExpandedProject,
                    dates,
                    person,
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);
