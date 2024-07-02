import { DateInfo, TaskRecord } from "../TimeTable.types";

export const TaskRows = (
  dates: DateInfo[],
  tasks: Record<string, TaskRecord[]>,
) => {
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
