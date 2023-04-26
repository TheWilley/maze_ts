/*/
Maze Creator
/*/

class Maze {
    private _maze: number[][] = []
    private _width: number
    private _height: number
    private _current_cord: { y: number, x: number } = { x: 0, y: 0 }
    private _cords_stack: { y: number, x: number }[] = []
    private _completed_cells: number = 0
    private _completed_cells_collection: number[] = []
    private _total: number = 0
    private _uncleared_cells: number = 0

    constructor(width: number, height: number) {
        this._width = width
        this._height = height

        this.createCanvas()
        this.createMaze()
        this.addCurrentSpeed()
        this.start()
    }

    createCanvas() {
        let maze = document.getElementById("maze")! as HTMLCanvasElement
        maze.width = this._width
        maze.height = this._height
    }

    createMaze() {
        for (let y = 0; y <= this._height; y++) {
            // Create a new row
            this._maze.push([])

            for (let x = 0; x <= this._width; x++) {
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
                    if (this._current_cord.y - 1 >= 0 && this._maze[this._current_cord.y - 1][this._current_cord.x] == 0) {
                        all_neighbors.push({ y: this._current_cord.y - 1, x: this._current_cord.x })
                    }
                }
                case 2: {
                    if (this._current_cord.y + 1 <= this._height && this._maze[this._current_cord.y + 1][this._current_cord.x] == 0) {
                        all_neighbors.push({ y: this._current_cord.y + 1, x: this._current_cord.x })
                    }
                } case 3: {
                    if (this._current_cord.x - 1 >= 0 && this._maze[this._current_cord.y][this._current_cord.x - 1] == 0) {
                        all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x - 1 })
                    }
                } case 4: {
                    if (this._current_cord.x + 1 <= this._width && this._maze[this._current_cord.y][this._current_cord.x + 1] == 0) {
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

    async addCurrentSpeed() {
        // Get amount of completed cells per second with a timeer of 1 second
        let amount = 0
        while (true) {
            amount = this._completed_cells
            this._completed_cells_collection.push(amount)
            this._completed_cells = 0
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    getAverageSpeed() {
        let total = 0
        for (let amount of this._completed_cells_collection) {
            total += amount
        }

        return total / this._completed_cells_collection.length
    }

    getTimeToComplete() {
        // Get average speed
        let average_speed = this.getAverageSpeed()

        // Get time to complete
        let time_to_complete = this._uncleared_cells / average_speed

        // Check if time to complete is infinity
        if(time_to_complete == Infinity) {
            return "Infinity"
        }

        // Check if we are done
        if (this._uncleared_cells == 0) {
            return "Done"
        }

        // Return time to complete
        return time_to_complete
    }
        
    secondsToHms(d: number | string) {
        // Check if d is a string
        if(typeof d == "string") return d

        // Continue
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

        return hDisplay + mDisplay + sDisplay;
    }

    async start() {
        // Get canvas
        let canvas = document.getElementById("maze")! as HTMLCanvasElement
        let ctx = canvas.getContext("2d")!

        // Get random point
        this._current_cord = { y: Math.floor(Math.random() * this._height), x: Math.floor(Math.random() * this._width) }
        this._maze[this._current_cord.y][this._current_cord.x] = 1

        this._total = this._width * this._height + (this._width % (this._width * this._height) + this._height % (this._width * this._height))
        let uncleared = this._total
        let cleared = 0

        while (true) {
            // Check neighbors
            let neighbor = this.checkNeigbors()

            // Check if we are stuck, if so, break as we are done
            if (neighbor == undefined) {
                break
            }

            // Set current cord to neighbor
            this._current_cord = neighbor

            // Check if nighebor is in stack
            if (this._cords_stack.includes(neighbor)) {
                ctx.fillStyle = "black"
            } else {
                ctx.fillStyle = "red"
                uncleared--
                cleared++
            }

            // Set uncleared global
            this._uncleared_cells = uncleared

            // Draw
            ctx.fillRect(this._current_cord.x, this._current_cord.y, 1, 1)

            // Increase completed cells
            this._completed_cells++

            // Update info
            document.getElementById("info")!.innerHTML = `Cleared: ${cleared} / ${this._total} (${((cleared / this._total) * 100).toFixed(2)}%)<br>Uncleared: ${uncleared} / ${this._total} (${((uncleared / this._total) * 100).toFixed(2)}%)<br>Average speed: ${this.getAverageSpeed().toFixed(2)} cells / second<br>Time to complete: ${this.secondsToHms(this.getTimeToComplete())}`

            // Wait
            await new Promise(r => setTimeout(r, 1));
        }
        console.log("Done!")
    }

    get maze() {
        return this._maze
    }
}

let maze = new Maze(1000, 1000)