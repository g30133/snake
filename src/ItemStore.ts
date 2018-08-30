import * as C from './constants'
import { CellType } from './Board'
import Util from './Util'

type ItemType = 'A'

interface Item {
    type:ItemType
    rowIx:number
    colIx:number
}

class ItemStore {
    items:Item[] = []

    constructor(board:CellType[], numItems:number) {
        for(let i = 0; i < numItems; i++) {

            const wallBlockIxs = []
            for(let i = 0; i < board.length; i++) {
                if(board[i] === '#') {
                    wallBlockIxs.push(i)
                }
            }
            console.log('wallBlockIxs:' + wallBlockIxs)
            const randomIx = Util.randomUniqueIx(0, C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS - 1, wallBlockIxs)

            this.items.push({
                type:'A' as ItemType,
                rowIx: Math.floor(randomIx/C.NUM_BOARD_COLS),
                colIx: randomIx%C.NUM_BOARD_COLS
            })
        }
        console.log('items after push:' + JSON.stringify(this.items))
    }

    public emit(board:CellType[]) {
        for(const item of this.items) {
            const idx = item.rowIx * C.NUM_BOARD_COLS + item.colIx
            board[idx] = item.type
        }
    }

    // relocate the item from given rowIx, colIx to random valid position in the board
    public relocateFrom(board:CellType[], rowIx:number, colIx:number) {
        const itemValue = board[rowIx * C.NUM_BOARD_COLS + colIx]
        board[rowIx * C.NUM_BOARD_COLS + colIx] = '.' as CellType
        let randomIx = Math.floor(Math.random() * C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS)
        while(board[randomIx] !== '.') {
            randomIx = Math.floor(Math.random() * C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS)
        }
        for(let itemIx = 0; itemIx < this.items.length; itemIx++) {
            if(this.items[itemIx].rowIx === rowIx && this.items[itemIx].colIx === colIx) {
                this.items[itemIx] = ({
                    type: itemValue as ItemType,
                    rowIx: Math.floor(randomIx/C.NUM_BOARD_ROWS),
                    colIx: randomIx%C.NUM_BOARD_COLS
                })        
            }
        }
        console.log('items after relocate:' + JSON.stringify(this.items))
    }
    
    public remove(rowIx:number, colIx:number) {
        for(let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
            if(this.items[itemIndex].rowIx === rowIx && this.items[itemIndex].colIx === colIx) {
                this.items.splice(itemIndex, 1)
            }
        }
        console.log('this.items:' + JSON.stringify(this.items))
    }
}

export default ItemStore