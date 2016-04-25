var Cell = (function () {
    function Cell(x, y, numberNeighbours) {
        if (numberNeighbours === void 0) { numberNeighbours = 0; }
        this.x = x;
        this.y = y;
        this.numberNeighbours = numberNeighbours;
    }
    return Cell;
}());
var Board = (function () {
    function Board() {
    }
    Board.prototype.isNeighbour = function (neighbour1, neighbour2) {
        return (Math.abs(neighbour1.x - neighbour2.x) <= 1 && Math.abs(neighbour1.y - neighbour2.y) <= 1);
    };
    Board.prototype.generateStartLife = function (width, height) {
        this.cells = [];
        var countLifes = Math.floor((Math.random() * width * 10) + 1);
        for (var i = 0; i < countLifes; ++i) {
            var xCoords = Math.floor((Math.random() * width * 0.1) + 1);
            var yCoords = Math.floor((Math.random() * height * 0.1) + 1);
            this.cells.push(new Cell(xCoords, yCoords));
        }
    };
    return Board;
}());
var LifeGame = (function () {
    function LifeGame(board) {
        this.board = board;
        this.width = 400;
        this.height = 400;
        board.generateStartLife(this.width, this.height);
    }
    LifeGame.prototype.tick = function () {
        if (this.board.cells.length > 0) {
            this.spawn();
            this.spreadLife();
            this.killZombie();
            this.refreshLife();
            this.draw();
            this.clearAccount();
            var that_1 = this;
            setTimeout(function () {
                requestAnimationFrame(function () { return that_1.tick(); });
            }, 1000);
        }
        else {
            alert('Game over !');
        }
    };
    LifeGame.prototype.draw = function () {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
        for (var j = 1; j < this.board.cells.length; j++) {
            ctx.fillStyle = "#22FF44";
            ctx.fillRect(this.board.cells[j].x, this.board.cells[j].y, 1, 1);
        }
    };
    LifeGame.prototype.clearAccount = function () {
        for (var l in this.board.cells) {
            this.board.cells[l].numberNeighbours = 0;
        }
    };
    LifeGame.prototype.spawn = function () {
        var _this = this;
        var coords = [{ "x": -1, "y": -1 }, { "x": -1, "y": 0 },
            { "x": -1, "y": 1 }, { "x": 0, "y": -1 }, { "x": 0, "y": 1 },
            { "x": 1, "y": -1 }, { "x": 1, "y": 0 }, { "x": 1, "y": 1 }];
        this.board.newBornCells = [];
        var _loop_1 = function(i) {
            var _loop_2 = function(k) {
                if (!(this_1.board.cells.some(function (c) { return c.x + coords[k].x == _this.board.cells[i].x
                    && c.y + coords[k].y == _this.board.cells[i].y; }))) {
                    var isNewBornCell = true;
                    for (var j = 0; j < this_1.board.newBornCells.length; ++j) {
                        if (this_1.board.cells[i].x + coords[k].x == this_1.board.newBornCells[j].x
                            && this_1.board.cells[i].y + coords[k].y == this_1.board.newBornCells[j].y) {
                            this_1.board.newBornCells[j].numberNeighbours++;
                            isNewBornCell = false;
                        }
                    }
                    if (isNewBornCell) {
                        this_1.board.newBornCells.push(new Cell(this_1.board.cells[i].x + coords[k].x, this_1.board.cells[i].y + coords[k].y, 1));
                    }
                }
            };
            for (var k = 0; k < coords.length; ++k) {
                _loop_2(k);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.board.cells.length; ++i) {
            _loop_1(i);
        }
    };
    LifeGame.prototype.spreadLife = function () {
        for (var i = 0; i < this.board.cells.length - 1; ++i) {
            for (var j = i + 1; j < this.board.cells.length; ++j) {
                if (this.board.isNeighbour(this.board.cells[i], this.board.cells[j])) {
                    this.board.cells[i].numberNeighbours += 1;
                    this.board.cells[j].numberNeighbours += 1;
                }
            }
        }
    };
    LifeGame.prototype.refreshLife = function () {
        for (var j in this.board.newBornCells) {
            if (this.board.newBornCells[j].numberNeighbours == 3) {
                this.board.cells.push(this.board.newBornCells[j]);
            }
        }
    };
    LifeGame.prototype.killZombie = function () {
        for (var i = this.board.cells.length - 1; i >= 0; --i) {
            if (this.board.cells[i].numberNeighbours < 2 ||
                this.board.cells[i].numberNeighbours > 3) {
                this.board.cells.splice(i, 1);
            }
        }
    };
    return LifeGame;
}());
var createGame = new LifeGame(new Board());
createGame.tick();
