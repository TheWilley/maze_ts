# Notes

Maze must be generated with a recursive backtracker algorithm.

## Recursive backtracker algorithm

1. Start at a random cell.
2. Mark the cell as visited.
3. While the current cell has any unvisited neighbours:
    1. Choose randomly one of the unvisited neighbours.
    2. Push the current cell to the stack.
    3. Remove the wall between the current cell and the chosen cell.
    4. Make the chosen cell the current cell and mark it as visited.

4. If the stack is not empty:
    1. Pop a cell from the stack.
    2. Make it the current cell.