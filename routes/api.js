'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
    
      if(puzzle && coordinate && value){
        if(coordinate.length != 2)
          res.send({ error: 'Invalid coordinate' });
        else if(/^[1-9]{1}$/.test(value)){
          let validationResult = solver.validate(puzzle);
          if(validationResult)
            res.send(validationResult);
          else{
            let rowIdx = coordinate.toUpperCase().charCodeAt(0) - 65;
            let columnIdx = coordinate[1] - 1;
                        
            if(rowIdx >= 0 && rowIdx <= 8 && columnIdx >= 0 && columnIdx <= 8){
              let conflict = [];
              if(!solver.checkRowPlacement(puzzle, rowIdx, columnIdx, value))
                conflict.push('row');
              if(!solver.checkColPlacement(puzzle, rowIdx, columnIdx, value))
                conflict.push('column');
              if(!solver.checkRegionPlacement(puzzle, rowIdx, columnIdx, value))
                conflict.push('region');
                            
              res.send({ valid: conflict.length == 0, conflict });
            }
            else
              res.send({ error: 'Invalid coordinate' });
          }
        }
        else
          res.send({ error: 'Invalid value' });
      }
      else
        res.send({ error: 'Required field(s) missing' });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if(puzzle)
      {
        let validationResult = solver.validate(puzzle);
        
        if(validationResult)
          res.send(validationResult);
        else if(!validationResult){
          let solved = solver.solve(puzzle);
          if(solved)
            res.send({ solution: solved });
          else
            res.send({ error: 'Puzzle cannot be solved' });
        }
      }
      else
        res.send({ error: 'Required field missing' });
    });
};