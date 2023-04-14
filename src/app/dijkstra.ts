import { Cell } from './cell.model';
import { KnightMoves } from './knight-moves';

export class Dijkstra {
  constructor(private grid: boolean[][]) {}

  private isCellValid(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < 8 && y < 8 && !this.grid[x][y];
  }

  private getNeighbors(cell: Cell): Cell[] {
    return KnightMoves.map((move) => ({ x: cell.x + move.x, y: cell.y + move.y }))
      .filter((neighbor) => this.isCellValid(neighbor.x, neighbor.y));
  }

  computeShortestPath(start: Cell, end: Cell): Cell[] {
    let visited = new Set<string>();
    let queue: Cell[] = [start];
    let cameFrom = new Map<string, Cell>();
    let getKey = (cell: Cell) => `${cell.x},${cell.y}`;
    visited.add(getKey(start));
    while (queue.length > 0) {
      let current = queue.shift() as Cell;
      if (current.x === end.x && current.y === end.y) {
        let path: Cell[] = [current];
        while (cameFrom.has(getKey(current))) {
          current = cameFrom.get(getKey(current)) as Cell;
          path.unshift(current);
        }
        return path;
      }
      for (let neighbor of this.getNeighbors(current)) {
        let key = getKey(neighbor);
        if (!visited.has(key)) {
          visited.add(key);
          cameFrom.set(key, current);
          queue.push(neighbor);
        }
      }
    }
    return []; // Return an empty array if there's no valid path
  }
}
