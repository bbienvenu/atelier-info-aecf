export class Dijkstra {
    constructor(private grid: boolean[][]) {}
  
    computeShortestPath(start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number }[] {
      const visited = Array.from({ length: this.grid.length }, () => Array(this.grid[0].length).fill(false));
      const queue: { position: { x: number; y: number }; distance: number; path: { x: number; y: number }[] }[] = [];
      const dx = [-2, -1, 1, 2, 2, 1, -1, -2];
      const dy = [1, 2, 2, 1, -1, -2, -2, -1];
      queue.push({ position: start, distance: 0, path: [start] });
      visited[start.x][start.y] = true;
      while (queue.length > 0) {
        const current = queue.shift();
        const position = current!.position;
        const distance = current!.distance;
        const path = current!.path;
  
        if (position.x === end.x && position.y === end.y) {
          return path;
        }
        for (let i = 0; i < 8; i++) {
          const newX = position.x + dx[i];
          const newY = position.y + dy[i];
  
          if (this.isValidMove(newX, newY) && !visited[newX][newY]) {
            visited[newX][newY] = true;
            queue.push({ position: { x: newX, y: newY }, distance: distance + 1, path: [...path, { x: newX, y: newY }] });
          }
        }
      }
      return [];
    }

    isValidMove(x: number, y: number): boolean {
        return x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[0].length && !this.grid[x][y];
      }

  }