import { generateTable, resetTable, saveTableState } from "./table.js";
import "./style.css";

const tableContainer = document.querySelector("#table");
const table = generateTable(5);
tableContainer.appendChild(table);

const resetButton = document.querySelector(".bingo form input");

resetButton.addEventListener("click", (e) => {
  e.preventDefault();  
  resetTable(table);
  saveTableState(); 
});

window.addEventListener("beforeunload", (event) => {
  const authorMode = document.querySelector("#authorMode").checked;
  const editing = document.querySelector("textarea");
  if (authorMode && editing) {
    event.preventDefault();
    event.returnValue = "You have unsaved changes!";
  }
});