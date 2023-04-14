import { Component } from '@angular/core';
import { Dijkstra } from '../dijkstra';
import { Cell } from '../cell.model';
import { faHouseFlag, faCrown, faChessKnight } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-chess-grid',
  templateUrl: './chess-grid.component.html',
  styleUrls: ['./chess-grid.component.css']
})
export class ChessGridComponent {

  faHouseFlag = faHouseFlag;
  faCrown = faCrown;
  faChessKnight = faChessKnight;

  board: boolean[][] = Array.from({ length: 8 }, () => Array(8).fill(false));
  knightGrid: boolean[][] = Array.from({ length: 8 }, () => Array(8).fill(false));
  knightVisitedGrid: boolean[][] = Array.from({ length: 8 }, () => Array(8).fill(false));
  selectedCells: Cell[] = [];
  shortestPath: Cell[] = [];
  gameStarted = false;
  movementOrder: number[] = [];

  startGame(): void {
    this.gameStarted = true;
  }

  async selectCell(x: number, y: number): Promise<void> {
    if (!this.gameStarted || this.board[x][y]) {
      return;
    }
    if (this.selectedCells.length < 2) {
      this.selectedCells.push({ x, y });
    }
    if (this.selectedCells.length === 2) {
      let start = this.selectedCells[0];
      let end = this.selectedCells[1];
      let dijkstra = new Dijkstra(this.board);
      this.shortestPath = dijkstra.computeShortestPath(start, end);
      await this.moveKnight();
    }
  }

  isBoardEmpty(): boolean {
    return this.board.every((row) => row.every((cell) => !cell));
  }

  canGenerateObstacles(): boolean {
    return this.gameStarted && this.selectedCells.length === 1 && this.isBoardEmpty();
  }

  generateRandomObstacles(): void {
    if (!this.canGenerateObstacles()) {
      return;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (!this.isSelected(i, j)) {
          this.board[i][j] = Math.random() < 0.2;
        }
      }
    }
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(false));
    this.knightGrid = Array.from({ length: 8 }, () => Array(8).fill(false));
    this.knightVisitedGrid = Array.from({ length: 8 }, () => Array(8).fill(false));
    this.selectedCells = [];
    this.shortestPath = [];
    this.gameStarted = false;
  }

  isSelected(x: number, y: number): boolean {
    return this.selectedCells.some((cell) => cell.x === x && cell.y === y);
  }

  isShortestPath(x: number, y: number): boolean {
    return this.shortestPath.some((cell) => cell.x === x && cell.y === y);
  }

  getCellOrder(x: number, y: number): number {
    return this.shortestPath.findIndex((cell) => cell.x === x && cell.y === y) + 1;
  }

  async moveKnight(): Promise<void> {
    if (this.selectedCells.length !== 2) {
      return;
    } if (this.shortestPath.length === 0) return;
    for (let i = 0; i < this.shortestPath.length; i++) {
      let currentCell = this.shortestPath[i];
      this.knightGrid[currentCell.x][currentCell.y] = true;
      await this.sleep(500);
      this.knightGrid[currentCell.x][currentCell.y] = false;
      this.knightVisitedGrid[currentCell.x][currentCell.y] = true;
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
