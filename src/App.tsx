// src/App.tsx
import React from "react";
import TimeTable from "./components/TimeTable";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl font-bold mb-4">Time Tracking Table</h1>
        <TimeTable />
      </header>
    </div>
  );
};

export default App;
