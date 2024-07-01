// src/utils/mockData.ts
export const generateMockData = () => {
  const teams = ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"];
  const names = Array.from({ length: 32 }, (_, i) => `Person ${i + 1}`);
  const startDate = new Date(2024, 0, 1); // 1 января 2024 года
  const endDate = new Date(2024, 11, 31); // 31 декабря 2024 года
  const dates = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const day = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      // month: "2-digit",
    });
    const month =
      date
        .toLocaleDateString("ru-RU", { month: "long" })
        .charAt(0)
        .toUpperCase() +
      date.toLocaleDateString("ru-RU", { month: "long" }).slice(1);
    const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    dates.push({
      date: day,
      month,
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      isWeekend,
    });
  }

  const teamData = teams.map((team, idx) => ({
    name: team,
    members: names.slice(idx * 8, (idx + 1) * 8).map((name) => ({
      name,
      times: dates.map(() => (Math.random() * 8).toFixed(2)),
    })),
  }));

  return { dates, teams: teamData };
};
