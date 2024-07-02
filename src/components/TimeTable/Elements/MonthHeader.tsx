import { FaUser } from "react-icons/fa";
import { DateInfo } from "../TimeTable.types";

export const MonthHeader = (
  showDisabled: boolean,
  setShowDisabled: any,
  dates: DateInfo[],
) => {
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
      <th className="sticky left-0 bg-gray-100 p-2 w-40 justify-items-start">
        <div className="flex justify-start">
          <button
            onClick={() => setShowDisabled(!showDisabled)}
            className="bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <FaUser className="text-xl" />
          </button>
        </div>
      </th>
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
