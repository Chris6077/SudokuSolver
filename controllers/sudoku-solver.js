class SudokuSolver { 
  validate(puzzleString) {
    if(puzzleString.length !== 81)
      return { error: 'Expected puzzle to be 81 characters long' };
    
    if(!/^[1-9.]*$/.test(puzzleString))
      return { error: 'Invalid characters in puzzle' };
    
    return false;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g);
    let rowString = rows[row];
    let valueAtLocation = this.getValue(puzzleString, row, column);
    if(valueAtLocation != '.'){
      return rowString.split('').filter(x => x === value).length == 1;
    }
    //console.log("ROW");
    //console.log(rows);
    //console.log(row);
    //console.log(rowString.includes(value));
    return !rowString.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colString = "";
    for(let idx = 0; idx < 9; idx++){
      colString += puzzleString[column + (idx * 9)]
    }
    //console.log("COL");
    //console.log(colString);
    //console.log(column);
    //console.log(colString.includes(value));
    let valueAtLocation = this.getValue(puzzleString, row, column);
    if(valueAtLocation != '.'){
      return colString.split('').filter(x => x === value).length == 1;
    }
    return !colString.includes(value);
    //let cols = [];
    //let col = "";
    //for(let idxC = 0; idxC < 9; idxC++){
    //  col = "";
    //  for(let idxR = 0; idxR < 9; idxR++){
    //    col += puzzleString[idxR + (idxC * 9)];
    //  }
    //  cols.push(col);
    //}
    //return cols[column].includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let thirds = puzzleString.match(/.{3}/g);
    let colIdx = Math.ceil((column + 1) / 3);
    colIdx--;
    let grid = "";
    if(row % 3 == 0){
      grid += thirds[(3 * row) + colIdx];
      grid += thirds[(3 * row) + colIdx + 3];
      grid += thirds[(3 * row) + colIdx + 6];
    } else if(row % 3 == 1){
      grid += thirds[(3 * row) + colIdx - 3];
      grid += thirds[(3 * row) + colIdx];
      grid += thirds[(3 * row) + colIdx + 3];
    } else {
      grid += thirds[(3 * row) + colIdx - 6];
      grid += thirds[(3 * row) + colIdx - 3];
      grid += thirds[(3 * row) + colIdx];
    }
    let valueAtLocation = this.getValue(puzzleString, row, column);
    if(valueAtLocation != '.'){
      return grid.split('').filter(x => x === value).length == 1;
    }
    //console.log("Region");
    //console.log(thirds);
    //console.log(grid);
    //console.log(row);
    //console.log(column);
    //console.log(grid.includes(value));
    return !grid.includes(value);
  }
  
  getValue(puzzleString, row, column){
    return puzzleString[(row * 9) + column];
  }
  
  checkCandidate(puzzleString, row, column, value){
    //console.log("row");
    //console.log(!this.checkRowPlacement(puzzleString, row, column, value));
    //console.log("col");
    //console.log(!this.checkColPlacement(puzzleString, row, column, value));
    //console.log("reg");
    //console.log(!this.checkRegionPlacement(puzzleString, row, column, value));
    return this.checkRowPlacement(puzzleString, row, column, value) && this.checkColPlacement(puzzleString, row, column, value) && this.checkRegionPlacement(puzzleString, row, column, value);
  }
  
  rowToIndex(row){
    return row.toUpperCase().charCodeAt(0) - 65
  }
  
  solve(puzzleString) {
    if(this.validate(puzzleString))
      return false;
    
    let puzzleChars = puzzleString.split("");
    let toFill = [];
    let toFillCount = 0;
    
    let fillValue = (valIndex) => {
      toFillCount--;
          
      puzzleChars[valIndex] = toFill[valIndex]["candidates"][0];
      delete toFill[valIndex];

      puzzleString = puzzleChars.join('');
    };
    
    for (let idx = 0; idx < 81; idx++) {
      if (puzzleChars[idx] == '.') {
        toFillCount++;
        
        let rowIndex = Math.floor(idx/9);
        let colIndex = idx - (rowIndex * 9);
        toFill[idx] = { "row": rowIndex, "column": colIndex, "candidates": [] };
        
        for (let value = 1; value <= 9; value++) {
          if (this.checkCandidate(puzzleString, rowIndex, colIndex, value))
            toFill[idx]['candidates'].push(value);
        }
        if (toFill[idx]['candidates'].length == 1)
          fillValue(idx);
      }
    };
    let sec = 0;
    while (toFillCount > 0 && sec < 1000) {
      for (var cellIndex in toFill) {
        toFill[cellIndex]['candidates'].forEach((value, idx) => {
          if (!this.checkCandidate(puzzleString, toFill[cellIndex]['row'], toFill[cellIndex]['column'], value))
            toFill[cellIndex]['candidates'].splice(idx, 1);
        });
        if (toFill[cellIndex]['candidates'].length == 1)
          fillValue(cellIndex);
      }
      sec++;
    }
    if(sec >= 1000)
      return false;
    //console.log(toFill);
    //for (var cellIndex in toFill) {
    //  toFill[cellIndex]["candidates"].forEach((value, idx) => {
    //    console.log (!this.checkCandidate(puzzleString, toFill[cellIndex]["row"], toFill[cellIndex]["column"] + 1, value));
    //  });
    //}
    puzzleString = puzzleChars.join('');
    return puzzleString;
  }
}

module.exports = SudokuSolver;