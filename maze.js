"use strict";
/*/
Maze Creator
/*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Maze = /** @class */ (function () {
    function Maze(width, height, seed) {
        this._maze = [];
        this._current_cord = { x: 0, y: 0 };
        this._cords_stack = [];
        this._width = width;
        this._height = height;
        this.createCanvas();
        this.createMaze();
        this.start();
    }
    Maze.prototype.createCanvas = function () {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = this._width;
        canvas.height = this._height;
        document.body.appendChild(canvas);
        var zoomedInCanvas = document.createElement("canvas");
        zoomedInCanvas.id = "zoomed-in-canvas";
        zoomedInCanvas.width = 50;
        zoomedInCanvas.height = 50;
        document.body.appendChild(zoomedInCanvas);
    };
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
            // @ts-ignore
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
        return __awaiter(this, void 0, void 0, function () {
            var canvas, ctx, neighbor, zoomedInCanvas, zoomedInCtx, imageData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = document.getElementById("canvas");
                        ctx = canvas.getContext("2d");
                        // Get random point
                        this._current_cord = { y: Math.floor(Math.random() * this._height), x: Math.floor(Math.random() * this._width) };
                        this._maze[this._current_cord.y][this._current_cord.x] = 1;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        neighbor = this.checkNeigbors();
                        // Check if we are stuck, if so, break as we are done
                        if (neighbor == undefined) {
                            return [3 /*break*/, 3];
                        }
                        // Set current cord to neighbor
                        this._current_cord = neighbor;
                        // Set color
                        ctx.fillStyle = "red";
                        // Check if nighebor is in stack
                        if (this._cords_stack.includes(neighbor)) {
                            ctx.fillStyle = "black";
                        }
                        // Draw
                        ctx.fillRect(this._current_cord.x, this._current_cord.y, 1, 1);
                        zoomedInCanvas = document.getElementById("zoomed-in-canvas");
                        zoomedInCtx = zoomedInCanvas.getContext("2d");
                        imageData = ctx.getImageData(this._current_cord.x - 25, this._current_cord.y - 25, 50, 50);
                        // Draw it with double pixel size
                        zoomedInCtx.putImageData(imageData, 0, 0);
                        // Wait
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1); })];
                    case 2:
                        // Wait
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
var maze = new Maze(1000, 1000, 1);
