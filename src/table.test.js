import { expect, test, vi } from 'vitest';
import { generateTable, resetTable } from './table.js';

vi.stubGlobal('requestAnimationFrame', (cb) => cb());

HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: vi.fn(),
  fillStyle: '',
});
HTMLCanvasElement.prototype.toDataURL = () => 'data:image/x-icon;base64,test';

test('selecting five in a row shows bingo message and reset button works', () => {
  document.body.innerHTML = `
    <div id="table"></div>
    <div class="bingo" hidden>
      <h2>BINGO!</h2>
      <form>
        <input type="submit" value="Start again">
      </form>
    </div>
    <label class="switch">
      <input type="checkbox" id="authorMode">
      <span class="slider round"></span>
    </label>
    <form action="#share" hidden></form>
  `;
  
  const table = generateTable(5);
  document.getElementById('table').appendChild(table);
  
  document.getElementById('authorMode').checked = false;
  
  const bingoMessage = document.querySelector('.bingo');
  expect(bingoMessage.hidden).toBe(true);
  
  const firstRow = table.querySelectorAll('tr')[0];
  const cells = firstRow.querySelectorAll('td');
  
  cells.forEach(cell => cell.click());
  
  expect(bingoMessage.hidden).toBe(false);
  
  resetTable(table);
  
  expect(bingoMessage.hidden).toBe(true);
  
  const selectedCells = table.querySelectorAll('td.selected');
  expect(selectedCells.length).toBe(0);
});