/* eslint-disable no-fallthrough */

/*/
Maze Creator
/*/

export default class Maze {
    private _maze: number[][] = []
    private _width: number
    private _height: number
    private _current_cord: { y: number, x: number } = { x: 0, y: 0 }
    private _cords_stack: { y: number, x: number }[] = []
    private _completed_cells = 0
    private _completed_cells_collection: number[] = []
    private _total = 0
    private _backtracking = false
    private _cleared_cells = 0
    private _uncleared_cells = 0
    private _canvasElement: HTMLCanvasElement
    private _infoElement: HTMLElement
    private _doneCallback: () => void
    private _stop = false

    constructor(width: number, height: number, canvasElement: HTMLCanvasElement, infoElement: HTMLElement, doneCallback: () => void) {
        this._width = width
        this._height = height
        this._canvasElement = canvasElement
        this._infoElement = infoElement
        this._doneCallback = doneCallback

        this.createMaze()
        this.addCurrentSpeed()
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
    }

    checkNeigbors() {
        // Define variables
        const all_neighbors = []
        const numbers = [1, 2, 3, 4]
        let neighbor: { y: number, x: number } | undefined = { y: 0, x: 0 }

        // We check all neghbors and push it if it's free
        for (const number of this.shuffle(numbers)) {
            if (number == 1) {
                if (this._current_cord.y - 1 >= 0 && this._maze[this._current_cord.y - 1][this._current_cord.x] == 0) {
                    all_neighbors.push({ y: this._current_cord.y - 1, x: this._current_cord.x })
                }

            } else if (number == 2) {
                if (this._current_cord.y + 1 <= this._height && this._maze[this._current_cord.y + 1][this._current_cord.x] == 0) {
                    all_neighbors.push({ y: this._current_cord.y + 1, x: this._current_cord.x })
                }

            } else if (number == 3) {
                if (this._current_cord.x - 1 >= 0 && this._maze[this._current_cord.y][this._current_cord.x - 1] == 0) {
                    all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x - 1 })
                }

            } else if (number == 4) {
                if (this._current_cord.x + 1 <= this._width && this._maze[this._current_cord.y][this._current_cord.x + 1] == 0) {
                    all_neighbors.push({ y: this._current_cord.y, x: this._current_cord.x + 1 })
                }
            }
        }

        // Check if we are stuck
        if (all_neighbors.length == 0) {
            neighbor = this._cords_stack.pop()
        } else {
            // Get random direction from neighbors
            const direction = Math.floor(Math.random() * all_neighbors.length)
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
        // eslint-disable-next-line no-constant-condition
        while (true) {
            amount = this._completed_cells
            this._completed_cells_collection.push(amount)
            this._completed_cells = 0
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    getAverageSpeed() {
        let total = 0
        for (const amount of this._completed_cells_collection) {
            total += amount
        }

        return total / this._completed_cells_collection.length
    }

    getTimeToComplete() {
        // Get average speed
        const average_speed = this.getAverageSpeed()

        // Get time to complete
        const time_to_complete = this._uncleared_cells / average_speed

        // Check if time to complete is infinity
        if (time_to_complete == Infinity) {
            return "Infinity"
        }

        // Check if we are done
        if (this._uncleared_cells == 0) {
            this._doneCallback()
            return "Done"
        }

        // Return time to complete
        return time_to_complete
    }

    secondsToHms(d: number | string) {
        // Check if d is a string
        if (typeof d == "string") return d

        // Continue
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);

        const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

        return hDisplay + mDisplay + sDisplay;
    }

    public getInfo() {
        const info = {
            cleared: `<b> Cleared: </b> ${this._cleared_cells} / ${this._total} (${((this._cleared_cells / this._total) * 100).toFixed(2)}%)`,
            uncleared: `<b> Uncleared: </b> ${this._uncleared_cells} / ${this._total} (${((this._uncleared_cells / this._total) * 100).toFixed(2)}%)`,
            status: `<b> Status: </b> ${this._backtracking ? 'Backtracking' : "Drawing"}`,
            avarage_speed: `<b> Average speed: </b> ${this.getAverageSpeed().toFixed(2)} cells / second`,
            time_to_complete: `<b> Time to complete: </b> ${this.secondsToHms(this.getTimeToComplete())}`
        }

        return info.cleared + '<br>' + info.uncleared + '<br>' + info.status + '<br>' + info.avarage_speed + '<br>' + info.time_to_complete
    }

    async start() {
        // Get canvas
        const ctx = this._canvasElement.getContext("2d")

        // Make sure ctx is not null
        if (!ctx) return;

        // Reset stop parameter
        this._stop = false

        // Clear canvas
        ctx.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height)

        // Get random point
        this._current_cord = { y: Math.floor(Math.random() * this._height), x: Math.floor(Math.random() * this._width) }
        this._maze[this._current_cord.y][this._current_cord.x] = 1

        this._total = this._width * this._height + (this._width % (this._width * this._height) + this._height % (this._width * this._height))
        this._uncleared_cells = this._total
        this._cleared_cells = 0

        while (!this._stop) {
            // Check neighbors
            const neighbor = this.checkNeigbors()

            // Check if we are stuck, if so, break as we are done
            if (neighbor == undefined) {
                break
            }

            // Set current cord to neighbor
            this._current_cord = neighbor

            // Check if nighebor is in stack
            if (this._cords_stack.includes(neighbor)) {
                ctx.fillStyle = "black"
                this._backtracking = false
            } else {
                ctx.fillStyle = "red"
                this._uncleared_cells--
                this._cleared_cells++
                this._backtracking = true
            }

            // Draw
            ctx.fillRect(this._current_cord.x, this._current_cord.y, 1, 1)

            // Increase completed cells
            this._completed_cells++

            // Update info
            this._infoElement.innerHTML = this.getInfo()

            // Wait
            await new Promise(r => setTimeout(r, 1));
        }
    }

    public stop() {
        this._stop = true
    }
}