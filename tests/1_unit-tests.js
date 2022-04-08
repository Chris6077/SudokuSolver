const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const Solver = new SudokuSolver();

const okPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const solvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters',function(done){
    assert.equal(Solver.validate(okPuzzle), false);
    done();
  });
  
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',function(done){
    assert.equal(Solver.validate(okPuzzle.replace(/\./g, 'x')).error,'Invalid characters in puzzle');
    done();
  });
  
  test('Logic handles a puzzle string that is not 81 characters in length', function(done){
    assert.equal(Solver.validate(okPuzzle + ".").error, "Expected puzzle to be 81 characters long");
    done();
  });
  
  test('Logic handles a valid row placement', function(done) {
    console.log(Solver.checkRowPlacement(okPuzzle, 0, 0, 7));
    assert.equal(Solver.checkRowPlacement(okPuzzle, 0, 0, 7), true);
    done();
  });
  
  test('Logic handles an invalid row placement', function(done) {
    assert.equal(Solver.checkRowPlacement(okPuzzle, 0, 1, 1), false);
    done();
  });
  
  test('Logic handles a valid column placement', function(done) {
    assert.equal(Solver.checkColPlacement(okPuzzle, 0, 0, 7), true);
    done();
  });
  
  test('Logic handles an invalid column placement', function(done) {
    assert.equal(Solver.checkColPlacement(okPuzzle, 0, 0, 6), false);
    done();
  });
  
  test('Logic handles a valid region (3x3 grid) placement', function(done) {
    assert.equal(Solver.checkRegionPlacement(okPuzzle, 0, 0, 7), true);
    done();
  });
  
  test('Logic handles an invalid region (3x3 grid) placement', function(done) {
    assert.equal(Solver.checkRegionPlacement(okPuzzle, 0, 0, 4), false);
    done();
  });
  
  test('Valid puzzle strings pass the solver', function(done) {
    assert.equal(Solver.solve(solvedPuzzle), solvedPuzzle);
    done();
  });
  
  test('Invalid puzzle strings fail the solver', function(done) {
    assert.equal(Solver.solve(okPuzzle.replace(/\./g, 'x')),false);
    done();
  });
  
  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    assert.equal(Solver.solve(okPuzzle), solvedPuzzle);
    done();
  });
});