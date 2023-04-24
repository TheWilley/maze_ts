/*/
Maze Creator
/*/

class Maze {
    private _maze: number[][] = []
    private _width: number
    private _height: number
    private _current_cord: { y: number, x: number } = { x: 0, y: 0 }
    private _cords_stack: { y: number, x: number }[] = []

    constructor(width: number, height: number, seed: number) {
        this._width = width
        this._height = height

        this.createCanvas()
        this.createMaze()
        this.start()
    }

    createCanvas() {
        let canvas = document.createElement("canvas")
        canvas.id = "canvas"
        canvas.width = this._width
        canvas.height = this._height
        document.body.appendChild(canvas)

        let zoomedInCanvas = document.createElement("canvas")
        zoomedInCanvas.id = "zoomed-in-canvas"
        zoomedInCanvas.width = 50
        zoomedInCanvas.height = 50
        document.body.appendChild(zoomedInCanvas)
    }

    createMaze() {
        for (let y = 0; y <= this._height; y++) {
            // Create a new row
            this._maze.push([])

            for (let x = 0; x < this._width; x++) {
                this._maze[y][x] = 0
            }
        }
    }

    // https://stackoverflow.com/a/48083382
    shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    checkNeigbors() {
        // Define variables
        let all_neighbors = []
        let numbers = [0, 1, 2, 3]
        let neighbor = { y: 0, x: 0 }

        // We check all neghbors and push it if it's free
        for (let number of this.shuffle(numbers)) {
            switch (number) {
                case 1: {
                    if (this._current_cord.y - 1 > 0 && this._maze[this._current_cord.y - 1][this._current_cord.x] == 0) {
                        all_neighbors.push({ y: this._current_cord.y - 1, x: this._current_cord.x })
                    }
                }
                case 2: {
                    if (this._current_cord.y + 1 < this._height && this._maze[this._current_cord.y + 1][this._current_cord.x] == 0) {
                        all_neighbors.push({ y: this._current_cord.y + 1, x: this._current_cord.x })
                    }
                } case 3: {
                    if (this._current_cord.x - 1 > 0 && this._maze[this._current_cord.y][this._current_cord.x - 1] == 0) {
                        all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x - 1 })
                    }
                } case 4: {
                    if (this._current_cord.x + 1 < this._width && this._maze[this._current_cord.y][this._current_cord.x + 1] == 0) {
                        all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x + 1 })
                    }
                }
            }
        }

        // Check if we are stuck
        if (all_neighbors.length == 0) {
            // @ts-ignore
            neighbor = this._cords_stack.pop()
        } else {
            // Get random direction from neighbors
            let direction = Math.floor(Math.random() * all_neighbors.length)
            neighbor = all_neighbors[direction]

            // Mark neighbor
            this._maze[neighbor.y][neighbor.x] = 1
            this._cords_stack.push(neighbor)
        }

        return neighbor
    }

    async start() {
        // Get canvas
        let canvas = document.getElementById("canvas")! as HTMLCanvasElement
        let ctx = canvas.getContext("2d")!

        // Get random point
        this._current_cord = { y: Math.floor(Math.random() * this._height), x: Math.floor(Math.random() * this._width) }
        this._maze[this._current_cord.y][this._current_cord.x] = 1

        while (true) {
            // Check neighbors
            let neighbor = this.checkNeigbors()

            // Check if we are stuck, if so, break as we are done
            if (neighbor == undefined) {
                break
            }

            // Set current cord to neighbor
            this._current_cord = neighbor

            // Set color
            ctx.fillStyle = "red"
            
            // Check if nighebor is in stack
            if (this._cords_stack.includes(neighbor)) {
                ctx.fillStyle = "black"
            }

            // Draw
            ctx.fillRect(this._current_cord.x, this._current_cord.y, 1, 1)

            // Get zoomed in canvas
            let zoomedInCanvas = document.getElementById("zoomed-in-canvas")! as HTMLCanvasElement
            let zoomedInCtx = zoomedInCanvas.getContext("2d")!

            // Get 10 x 10 area around current cord 
            let imageData = ctx.getImageData(this._current_cord.x - 25, this._current_cord.y - 25, 50, 50)

            // Draw it with double pixel size
            zoomedInCtx.putImageData(imageData, 0, 0)

            // Wait
            await new Promise(r => setTimeout(r, 1));
        }
    }

    get maze() {
        return this._maze
    }
}

let maze = new Maze(1000, 1000, 1)