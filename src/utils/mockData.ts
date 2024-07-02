// mockData.ts

export const generateMockData = () => {
  const teams = [];
  const dates = [];

  // Генерация списка дат с полной датой и дополнительной информацией
  const startDate = new Date(2024, 0, 1); // Начинаем с 1 января 2024 года
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dateString = currentDate.toISOString().split("T")[0]; // Формат YYYY-MM-DD
    const dateObj = {
      fullDate: dateString,
      date: dateString.slice(8, 10), // Дата дня
      weekday: currentDate.toLocaleDateString("ru-RU", { weekday: "short" }),
      month: currentDate.toLocaleDateString("ru-RU", { month: "long" }),
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    };
    dates.push(dateObj);
  }

  // Генерация списка команд и участников
  const teamNames = ["Alpha", "Beta", "Gamma", "Delta"];
  for (const teamName of teamNames) {
    const members = [];
    for (let i = 0; i < 8; i++) {
      const person = {
        name: `Person ${i + 1}`,
        times: dates.map(() => (Math.random() * 8).toFixed(2)),
      };
      members.push(person);
    }
    teams.push({ name: `Team ${teamName}`, members });
  }

  return { dates, teams };
};
