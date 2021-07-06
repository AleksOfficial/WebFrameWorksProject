export class Game {
    private tiles: Tile[] = [];

    constructor() {
        for (let i = 1; i <= 9; i++) {
            this.tiles[i-1] = new Tile(i);
        }
    }

    shuffle(): void {
        let counter: number = this.tiles.length;
        while(counter)
        {
            counter--;
            let index: number = Math.floor(Math.random() * counter);
            let temp : Tile;
            temp = this.tiles[counter];
            this.tiles[counter] = this.tiles[index];
            this.tiles[index] = temp;
        }
    }

    checkForWin(): boolean {
        for (let i = 1; i <= 9; i++) {
            if (this.tiles[i-1].getID() != i) {
                return false;
            }
        }
        return true;
    }

    swapTiles(id1: number, id2: number) {
        let temp: Tile = this.tiles[id1];
        this.tiles[id1] = this.tiles[id2];
        this.tiles[id2] = temp;
    }

    getTiles(): Tile[] {
        return this.tiles;
    }
}

export class Tile {
    private id: number;

    constructor(id: number) {
        this.id = id;
    }

    getID(): number {
        return this.id;
    }
}