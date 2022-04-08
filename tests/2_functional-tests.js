const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const okPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const solvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

suite('Functional Tests', () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: okPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solvedPuzzle);
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: okPuzzle.replace(/\./g, 'x') })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: okPuzzle + "." })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error,"Expected puzzle to be 81 characters long");
        done();
      });
  });
  
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..611" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error,"Puzzle cannot be solved");
        done();
      });
  });
  
  test("Check a puzzle placement with all fields: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle,
            coordinate: 'a1',
            value: 7})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid,true);
        done();
      });
  });
  
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle,
            coordinate: 'a1',
            value: 3})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid,false);
        assert.equal(res.body.conflict, 'region');
        done();
      });
  });
  
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle,
            coordinate: 'a1',
            value: 1})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid,false);
        assert.equal(res.body.conflict[0], 'row');
        assert.equal(res.body.conflict[1], 'column');
        done();
      });
  });
  
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle,
            coordinate: 'a1',
            value: 5})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid,false);
        assert.equal(res.body.conflict[0], 'row');
        assert.equal(res.body.conflict[1], 'column');
        assert.equal(res.body.conflict[2], 'region');
        done();
      });
  });
  
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle.replace(/\./g, 'x'),
            coordinate: 'a1',
            value: 1})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle + ".",
            coordinate: 'a1',
            value: 1})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle,
            coordinate: 'x1',
            value: 1})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: okPuzzle,
            coordinate: 'a1',
            value: 'x'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});