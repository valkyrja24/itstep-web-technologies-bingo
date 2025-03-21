export function saveTableState() {
  const tableData = [];
  const selectedCells = [];

  document.querySelectorAll("tr").forEach((tr) => {
    const rowData = [];
    tr.querySelectorAll("td").forEach((td, index) => {
      rowData.push(td.textContent); 
      if (td.classList.contains("selected") || td.textContent === '*') {
        selectedCells.push(index); 
      }
    });
    tableData.push(rowData);
  });

  let bingoId = window.location.hash.split('=')[0];
  if (!bingoId || bingoId === '#') {
    bingoId = '#bingo-' + Date.now();
  }
  
  const hasErrors = document.querySelectorAll("td.error").length > 0;
  if (!hasErrors) {
    const state = {
      tableData: tableData,
      selectedCells: selectedCells
    };
    window.location.hash = bingoId + '=' + encodeURIComponent(JSON.stringify(state));
  }
}

export function loadTableState() {
  if (window.location.hash && window.location.hash.includes('=')) {
    try {
      const hashContent = window.location.hash.split('=')[1];
      const state = JSON.parse(decodeURIComponent(hashContent));
      
      if (state.tableData && state.tableData.length > 0) {
        const rows = document.querySelectorAll("tr");
        
        if (rows.length === state.tableData.length) {
          rows.forEach((tr, rowIndex) => {
            const cells = tr.querySelectorAll("td");
            const rowData = state.tableData[rowIndex];
            
            if (cells.length === rowData.length) {
              cells.forEach((td, colIndex) => {
                td.textContent = rowData[colIndex]; 
                
                if (td.textContent === '*') {
                  td.classList.add("selected");
                }
              });
            }
          });
        }
      }

      if (state.selectedCells && state.selectedCells.length > 0) {
        const cells = document.querySelectorAll("td");
        cells.forEach((td, index) => {
          if (state.selectedCells.includes(index) || td.textContent === '*') {
            td.classList.add("selected");
          }
        });
      }
      
      resizeCellText();
      ensureStarCellsSelected();
      
      const table = document.querySelector("table");
      checkWin(table);
      
      if (document.querySelectorAll("td.error").length > 0) {
        updateFavicon("error");
      } else if (!document.querySelector(".bingo").hidden) {
        updateFavicon("complete");
      } else {
        updateFavicon("progress");
      }
    } catch (e) {
      console.error("Error loading bingo state:", e);
    }
  }
}

function ensureStarCellsSelected() {
  document.querySelectorAll("td").forEach(td => {
    if (td.textContent === '*') {
      td.classList.add("selected");
    }
  });
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
  updateFavicon("complete");
}

function enableEditing(td) {
  const text = td.textContent;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  td.textContent = "";
  td.appendChild(textarea);
  textarea.focus();
  
  textarea.addEventListener("input", () => {
    if (textarea.value.length > 50) {
      textarea.classList.add("error");
    } else {
      textarea.classList.remove("error");
    }
  });

  textarea.addEventListener("blur", () => {
    td.textContent = textarea.value;
    
    if (textarea.value.length > 50) {
      td.classList.add("error");
    } else {
      td.classList.remove("error");
    }
    
    if (td.textContent === '*') {
      td.classList.add("selected");
    }
    
    saveTableState();
    checkDuplicates();
    resizeCellText();
    ensureStarCellsSelected();
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
        if (cell.textContent.length <= 50) {
          cell.classList.remove("error");
        }
      }
    }
  });
  
  if (document.querySelectorAll("td.error").length > 0) {
    updateFavicon("error");
  } else if (!document.querySelector(".bingo").hidden) {
    updateFavicon("complete");
  } else {
    updateFavicon("progress");
  }
  
  ensureStarCellsSelected();
}

export function resetTable(table) {
  table.querySelectorAll("td").forEach((td, index) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    td.classList.remove("selected");
    td.classList.remove("error");
    td.textContent = row * 5 + col + 1; 
  });

  const bingoId = window.location.hash.split('=')[0];
  if (bingoId && bingoId !== '#') {
    window.location.hash = bingoId;
  } else {
    window.location.hash = '';
  }

  document.querySelector(".bingo").hidden = true;
  updateFavicon("progress");
  
  saveTableState();
  resizeCellText();
  ensureStarCellsSelected();
}

function resizeCellText() {
  document.querySelectorAll("td").forEach(td => {
    if (td.textContent && !td.querySelector("textarea")) {
      const text = td.textContent;
      const cellWidth = td.offsetWidth;
      const cellHeight = td.offsetHeight;
      
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.textContent = text;
      document.body.appendChild(tempSpan);
      
      const textWidth = tempSpan.offsetWidth;
      const textHeight = tempSpan.offsetHeight;
      
      const widthScale = (cellWidth * 0.8) / textWidth;
      const heightScale = (cellHeight * 0.8) / textHeight;
      
      let scale = Math.min(widthScale, heightScale, 1);
      
      scale = Math.max(scale, 0.3);
      scale = Math.min(scale, 1.5);
      
      const baseFontSize = 16;
      const fontSize = baseFontSize * scale;
      
      td.style.fontSize = `${fontSize}px`;
      
      document.body.removeChild(tempSpan);
    }
  });
  
  ensureStarCellsSelected();
}

function updateFavicon(status) {
  const existingFavicon = document.querySelector("link[rel='icon']");
  if (existingFavicon) {
    document.head.removeChild(existingFavicon);
  }
  
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  
  let color = "#FFCC00";
  if (status === "complete") {
    color = "#00CC00";
  } else if (status === "error") {
    color = "#CC0000";
  }
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 32, 32);
  
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/x-icon";
  link.href = canvas.toDataURL("image/x-icon");
  document.head.appendChild(link);
}

export function generateTable(num) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  let existingState = false;
  if (window.location.hash && window.location.hash.includes('=')) {
    try {
      const hashContent = window.location.hash.split('=')[1];
      const state = JSON.parse(decodeURIComponent(hashContent));
      if (state.tableData) {
        existingState = true;
      }
    } catch (e) {
      console.error("Error checking hash state:", e);
    }
  }

  for (let i = 0; i < num; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < num; j++) {
      const td = document.createElement("td");
      if (!existingState) {
        td.textContent = i * num + j + 1;
      } else {
        td.textContent = ''; 
      }
      tr.appendChild(td);

      td.addEventListener("click", () => {
        const authorMode = document.querySelector("#authorMode").checked;

        if (authorMode) {
          enableEditing(td); 
        } else {
          if (td.textContent === '*') {
            td.classList.add("selected");
          } else {
            td.classList.toggle("selected");
          }
          checkWin(table); 
        }

        saveTableState(); 
      });
    }
    tbody.appendChild(tr);
  }

  window.addEventListener("resize", function() {
    requestAnimationFrame(resizeCellText);
  });
  
  setTimeout(() => {
    loadTableState();
    
    if (!existingState && !window.location.hash.includes('=')) {
      saveTableState();
    }
    
    ensureStarCellsSelected();
    
    resizeCellText();
  }, 100);

  const authorSwitch = document.querySelector("#authorMode");
  authorSwitch.addEventListener("change", () => {
    if (authorSwitch.checked) {
      document.querySelector("form[action='#share']").hidden = false;
    } else {
      document.querySelector("form[action='#share']").hidden = true;
      
      ensureStarCellsSelected();
    }
    
    checkWin(table);
  });

  return table;
}

window.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        ensureStarCellsSelected();
      }
    });
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    characterData: true 
  });
});