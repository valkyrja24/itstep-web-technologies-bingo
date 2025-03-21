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

const shareForm = document.querySelector("form[action='#share']");
const shareButton = document.querySelector("form[action='#share'] input");

document.querySelector("#authorMode").addEventListener("change", (e) => {
  shareForm.hidden = !e.target.checked;
});

shareForm.hidden = !document.querySelector("#authorMode").checked;

shareButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  const url = window.location.href;
  
  navigator.clipboard.writeText(url).then(() => {
    const originalValue = shareButton.value;
    shareButton.value = "Copied!";
    setTimeout(() => {
      shareButton.value = originalValue;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert("Failed to copy URL. Please copy it manually.");
  });
});

window.addEventListener("beforeunload", (event) => {
  const authorMode = document.querySelector("#authorMode").checked;
  const editing = document.querySelector("textarea");
  if (authorMode && editing) {
    event.preventDefault();
    event.returnValue = "You have unsaved changes!";
  }
});