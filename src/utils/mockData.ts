// src/utils/mockData.ts
export const generateMockData = () => {
  const teams = ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"];
  const names = Array.from({ length: 32 }, (_, i) => `Person ${i + 1}`);
  const today = new Date();
  const dates = Array.from({ length: 60 }, (_, i) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() + Math.floor(i / 20),
      (i % 20) + 1,
    );
    const day = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
    const month = date.toLocaleDateString("ru-RU", { month: "long" });
    const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return {
      date: day,
      month,
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      isWeekend,
    };
  });

  const teamData = teams.map((team, idx) => ({
    name: team,
    members: names.slice(idx * 8, (idx + 1) * 8).map((name) => ({
      name,
      times: dates.map(() => (Math.random() * 8).toFixed(2)),
    })),
  }));

  return { dates, teams: teamData };
};
