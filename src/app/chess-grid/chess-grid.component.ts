import { Component } from '@angular/core';
import { Dijkstra } from '../dijkstra';

@Component({
  selector: 'app-chess-grid',
  templateUrl: './chess-grid.component.html',
  styleUrls: ['./chess-grid.component.css'],
})
export class ChessGridComponent {
  board: boolean[][] = Array.from({ length: 8 }, () => Array(8).fill(false));
  knightGrid: boolean[][] = Array.from({ length: 8 }, () => Array(8).fill(false));
  selectedCells: { x: number; y: number }[] = [];
  shortestPath: { x: number; y: number }[] = [];

  gameStarted = false;

  startGame(): void {
    this.gameStarted = true;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(false));
    this.knightGrid = Array.from({ length: 8 }, () => Array(8).fill(false));
    this.selectedCells = [];
    this.shortestPath = [];
    this.gameStarted = false;
  }

  async selectCell(x: number, y: number): Promise<void> {
    if (!this.gameStarted || this.board[x][y]) {
      return;
    }
    if (this.selectedCells.length < 2) {
      this.selectedCells.push({ x, y });
    }
    if (this.selectedCells.length === 2) {
      const start = this.selectedCells[0];
      const end = this.selectedCells[1];
      const dijkstra = new Dijkstra(this.board);
      this.shortestPath = dijkstra.computeShortestPath(start, end);
      await this.moveKnight();
    }
  }

  isSelected(x: number, y: number): boolean {
    return this.selectedCells.some((cell) => cell.x === x && cell.y === y);
  }

  isStartingCell(x: number, y: number): boolean {
    return this.selectedCells.length > 0 && this.selectedCells[0].x === x && this.selectedCells[0].y === y;
  }

  isDestinationCell(x: number, y: number): boolean {
    return this.selectedCells.length > 1 && this.selectedCells[1].x === x && this.selectedCells[1].y === y;
  }

  isShortestPath(x: number, y: number): boolean {
    return this.shortestPath.some((cell) => cell.x === x && cell.y === y);
  }

  computeShortestPath(): void {
    const start = this.selectedCells[0];
    const end = this.selectedCells[1];
    const dijkstra = new Dijkstra(this.board);

    this.shortestPath = dijkstra.computeShortestPath(start, end);
    console.log('Shortest path:', this.shortestPath);
  }

  getCellOrder(x: number, y: number): number {
    const cellIndex = this.shortestPath.findIndex((cell) => cell.x === x && cell.y === y);
    return cellIndex + 1; // Return the 1-based index
  }

  canGenerateObstacles(): boolean {
    return this.selectedCells.length === 0 && this.isBoardEmpty() && this.gameStarted;
  }

  isBoardEmpty(): boolean {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  generateRandomObstacles(): void {
    const numberOfObstacles = 10;
    this.resetBoard();

    for (let i = 0; i < numberOfObstacles; i++) {
      let randomX: number;
      let randomY: number;
      do {
        randomX = Math.floor(Math.random() * this.board.length);
        randomY = Math.floor(Math.random() * this.board[0].length);
      } while (this.board[randomX][randomY] || this.isSelected(randomX, randomY));
      this.board[randomX][randomY] = true;
    }
  }

  async moveKnight(): Promise<void> {
    if (this.selectedCells.length !== 2) {
      return;
    }
  
    const start = this.selectedCells[0];
    const end = this.selectedCells[1];
  
    const dijkstra = new Dijkstra(this.board);
    this.shortestPath = dijkstra.computeShortestPath(start, end);
  
    for (let i = 0; i < this.shortestPath.length; i++) {
      const currentCell = this.shortestPath[i];
      this.knightGrid[currentCell.x][currentCell.y] = true;
      await this.sleep(500);
  
      if (i !== this.shortestPath.length - 1) {
        this.knightGrid[currentCell.x][currentCell.y] = false;
      }
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
