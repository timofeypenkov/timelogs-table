import { DateInfo } from "../TimeTable.types";

export const DateHeader = (dates: DateInfo[]) => (
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
