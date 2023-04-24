"use strict";
/*/
Maze Creator
/*/
var Maze = /** @class */ (function () {
    function Maze(width, height, seed) {
        this._maze = [];
        this._current_cord = { x: 0, y: 0 };
        this._cords_stack = [];
        this._width = width;
        this._height = height;
        this.createMaze();
        this.start();
    }
    Maze.prototype.createMaze = function () {
        for (var y = 0; y <= this._height; y++) {
            // Create a new row
            this._maze.push([]);
            for (var x = 0; x < this._width; x++) {
                this._maze[y][x] = 0;
            }
        }
    };
    // https://stackoverflow.com/a/48083382
    Maze.prototype.shuffle = function (array) {
        var _a;
        var currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            _a = [
                array[randomIndex], array[currentIndex]
            ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
        }
        return array;
    };
    ;
    Maze.prototype.checkNeigbors = function () {
        // Define variables
        var all_neighbors = [];
        var numbers = [0, 1, 2, 3];
        var neighbor = { y: 0, x: 0 };
        // We check all neghbors and push it if it's free
        for (var _i = 0, _a = this.shuffle(numbers); _i < _a.length; _i++) {
            var number = _a[_i];
            switch (number) {
                case 1: {
                    if (this._current_cord.y - 1 > 0 && this._maze[this._current_cord.y - 1][this._current_cord.x] == 0) {
                        all_neighbors.push({ y: this._current_cord.y - 1, x: this._current_cord.x });
                    }
                }
                case 2: {
                    if (this._current_cord.y + 1 < this._height && this._maze[this._current_cord.y + 1][this._current_cord.x] == 0) {
                        all_neighbors.push({ y: this._current_cord.y + 1, x: this._current_cord.x });
                    }
                }
                case 3: {
                    if (this._current_cord.x - 1 > 0 && this._maze[this._current_cord.y][this._current_cord.x - 1] == 0) {
                        all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x - 1 });
                    }
                }
                case 4: {
                    if (this._current_cord.x + 1 < this._width && this._maze[this._current_cord.y][this._current_cord.x + 1] == 0) {
                        all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x + 1 });
                    }
                }
            }
        }
        // Check if we are stuck
        if (all_neighbors.length == 0) {
            neighbor = this._cords_stack.pop();
        }
        else {
            // Get random direction from neighbors
            var direction = Math.floor(Math.random() * all_neighbors.length);
            neighbor = all_neighbors[direction];
            // Mark neighbor
            this._maze[neighbor.y][neighbor.x] = 1;
            this._cords_stack.push(neighbor);
        }
        return neighbor;
    };
    Maze.prototype.start = function () {
        // Get random point
        this._current_cord = { y: Math.floor(Math.random() * this._height), x: Math.floor(Math.random() * this._width) };
        this._maze[this._current_cord.y][this._current_cord.x] = 1;
        while (true) {
            // Check neighbors
            var neighbor = this.checkNeigbors();
            // Check if we are stuck, if so, break as we are done
            if (neighbor == undefined) {
                break;
            }
            // Set current cord to neighbor
            this._current_cord = neighbor;
        }
    };
    Object.defineProperty(Maze.prototype, "maze", {
        get: function () {
            return this._maze;
        },
        enumerable: false,
        configurable: true
    });
    return Maze;
}());
var maze = new Maze(100, 100, 1);
