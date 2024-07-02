import { v4 as uuidv4 } from "uuid";

const generateMockData = () => {
  const dates = [];
  const teams = [];
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Generate dates
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    dates.push({
      fullDate: date.toISOString().split("T")[0],
      date: date.getDate().toString().padStart(2, "0"),
      weekday: capitalizeFirstLetter(
        date.toLocaleString("ru-RU", { weekday: "short" }).replace(".", ""),
      ),
      month: capitalizeFirstLetter(
        date.toLocaleString("ru-RU", { month: "long" }),
      ),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }

  // Generate teams and members
  for (let i = 0; i < 4; i++) {
    const team = {
      name: `Team ${String.fromCharCode(65 + i)}`,
      members: [],
    };
    for (let j = 0; j < 8; j++) {
      const member = {
        id: uuidv4(),
        name: `Person ${i * 8 + j + 1}`,
        team: team.name,
        records: [],
      };
      dates.forEach((date) => {
        if (Math.random() < 0.3) {
          const numProjects = Math.floor(Math.random() * 4) + 1;
          for (let k = 0; k < numProjects; k++) {
            const project = `Project ${k + 1}`;
            const numTasks = Math.floor(Math.random() * 3) + 1;
            for (let m = 0; m < numTasks; m++) {
              const taskId = uuidv4();
              const taskDescription = `Task ${m + 1}`;
              const taskDurationDays = Math.floor(Math.random() * 5) + 1;
              for (let t = 0; t < taskDurationDays; t++) {
                const taskDate = new Date(date.fullDate);
                taskDate.setDate(taskDate.getDate() + t);
                if (taskDate > endDate) break;
                member.records.push({
                  id: uuidv4(),
                  project: project,
                  description: `${project}: ${taskDescription}`,
                  date: taskDate.toISOString().split("T")[0],
                  time: parseFloat((Math.random() * 4 + 1).toFixed(2)),
                });
              }
            }
          }
        }
      });
      team.members.push(member);
    }
    teams.push(team);
  }

  return { dates, teams };
};

export { generateMockData };
