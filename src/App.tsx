// src/App.tsx
import React from "react";
import TimeTable from "./components/TimeTable/TimeTable";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <TimeTable />
      </header>
    </div>
  );
};

export default App;
