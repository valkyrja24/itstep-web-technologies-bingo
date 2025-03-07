export function saveTableState() {
  const tableData = [];
  const selectedCells = [];

  document.querySelectorAll("tr").forEach((tr) => {
    const rowData = [];
    tr.querySelectorAll("td").forEach((td, index) => {
      rowData.push(td.textContent); 
      if (td.classList.contains("selected")) {
        selectedCells.push(index); 
      }
    });
    tableData.push(rowData);
  });

  localStorage.setItem("bingoTable", JSON.stringify(tableData));
  localStorage.setItem("selectedCells", JSON.stringify(selectedCells));
}

export function loadTableState() {
  const tableData = JSON.parse(localStorage.getItem("bingoTable"));
  if (tableData) {
    document.querySelectorAll("tr").forEach((tr, rowIndex) => {
      tr.querySelectorAll("td").forEach((td, colIndex) => {
        td.textContent = tableData[rowIndex][colIndex]; 
      });
    });
  }

  const selectedCells = JSON.parse(localStorage.getItem("selectedCells"));
  if (selectedCells) {
    document.querySelectorAll("td").forEach((td, index) => {
      if (selectedCells.includes(index)) {
        td.classList.add("selected");
      }
    });
  }
}

function checkWin(table) {
  const rows = table.querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
    let win = true;
    const cells = rows[i].querySelectorAll("td");
    for (let j = 0; j < cells.length; j++) {
      if (!cells[j].classList.contains("selected")) {
        win = false;
        break;
      }
    }
    if (win) {
      displayBingoMessage();
      return;
    }
  }

  const num = rows.length;
  for (let i = 0; i < num; i++) {
    let win = true;
    for (let j = 0; j < num; j++) {
      const cell = rows[j].querySelectorAll("td")[i];
      if (!cell.classList.contains("selected")) {
        win = false;
        break;
      }
    }
    if (win) {
      displayBingoMessage();
      return;
    }
  }

  let win = true;
  for (let i = 0; i < num; i++) {
    const cell = rows[i].querySelectorAll("td")[i];
    if (!cell.classList.contains("selected")) {
      win = false;
      break;
    }
  }
  if (win) {
    displayBingoMessage();
    return;
  }

  win = true;
  for (let i = 0; i < num; i++) {
    const cell = rows[i].querySelectorAll("td")[num - 1 - i];
    if (!cell.classList.contains("selected")) {
      win = false;
      break;
    }
  }
  if (win) {
    displayBingoMessage();
    return;
  }
}

function displayBingoMessage() {
  const bingoMessage = document.querySelector(".bingo");
  bingoMessage.hidden = false;
}

function enableEditing(td) {
  const text = td.textContent;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  td.textContent = "";
  td.appendChild(textarea);
  textarea.focus();

  textarea.addEventListener("blur", () => {
    td.textContent = textarea.value;
    saveTableState(); 
    checkDuplicates(); 
  });
}

function checkDuplicates() {
  const cells = document.querySelectorAll("td");
  const textMap = new Map();

  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    if (text) {
      if (textMap.has(text)) {
        textMap.get(text).classList.add("error");
        cell.classList.add("error");
      } else {
        textMap.set(text, cell);
        cell.classList.remove("error");
      }
    }
  });
}

export function resetTable(table) {
  table.querySelectorAll("td").forEach((td) => {
    td.classList.remove("selected");
    td.textContent = ''; 
  });

  localStorage.removeItem("bingoTable");
  localStorage.removeItem("selectedCells");

  document.querySelector(".bingo").hidden = true;

  generateTable(5);
}

export function generateTable(num) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  const tableData = JSON.parse(localStorage.getItem("bingoTable"));

  if (!tableData) {
    const defaultTable = [];
    for (let i = 0; i < num; i++) {
      const row = [];
      for (let j = 0; j < num; j++) {
        row.push(i * num + j + 1); 
      }
      defaultTable.push(row);
    }
    localStorage.setItem("bingoTable", JSON.stringify(defaultTable));
  }

  for (let i = 0; i < num; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < num; j++) {
      const td = document.createElement("td");
      td.textContent = tableData ? tableData[i][j] : i * num + j + 1; 
      tr.appendChild(td);

      td.addEventListener("click", () => {
        const authorMode = document.querySelector("#authorMode").checked;

        if (authorMode) {
          td.classList.remove("selected");
          enableEditing(td); 
        } else {
          td.classList.toggle("selected");
          checkWin(table); 
        }

        saveTableState(); 
      });
    }
    tbody.appendChild(tr);
  }

  loadTableState();

  const authorSwitch = document.querySelector("#authorMode");
  authorSwitch.addEventListener("change", () => {
    if (authorSwitch.checked) {
      resetTable(table); 
    }
  });

  return table;
}
