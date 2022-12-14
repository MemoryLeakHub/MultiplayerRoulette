import { StrictMode } from "react";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import RouletteWrapper from "./RouletteWrapper";
import "./styles.css";

const rootElement = document.getElementById("app")  as HTMLElement;
const root = createRoot(rootElement);
console.log(555);

function App() {
  return (
      <RouletteWrapper />
  );
}
export default App;
root.render(<App />);
