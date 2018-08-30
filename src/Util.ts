import * as C from "./constants"
import { CellType } from './Board'

class Util {
    // return a random unique index between (inclusive) @lowBound and @upperBound, AND
    //        not colliding with any numbers in @takenIxs
    //        -1 when it is not possible to make such index
    public static randomUniqueIx(lowBound:number, upperBound:number, takenIxs:number[]) {
        const indexes = []
        for(let i = lowBound; i <= upperBound; i++) {
            indexes.push(i)
        }
        const availableIxs = Util.unitIxs(takenIxs, indexes)
        console.log('availableIndexes:' + JSON.stringify(availableIxs))
        if(availableIxs.length === 0) {
            return -1
        } else {
            let randomIx = Math.floor(Math.random() * availableIxs.length)
            return availableIxs[randomIx]
        }
    }

    public static unitIxs(takenIxs:number[], indexes:number[]) {
        const unitIxs = []
        for(const index of indexes) {
            if(takenIxs.indexOf(index) === -1) {
                    unitIxs.push(index)
            }
        }
        return unitIxs
    }


    public static dumpBoard(board:CellType[]) {
        //console.log(`dumpBoard(${board})`)
        let dump:string = ''
        for (let cellIx = 0; cellIx < C.NUM_BOARD_ROWS*C.NUM_BOARD_COLS; cellIx++) {
            if (cellIx % C.NUM_BOARD_COLS === 0) {
                dump += '\n'
            }
            dump += board[cellIx]
        }
        console.log(dump)
    }

    public static clearBoard(board:CellType[]) {
        // TODO
        console.log('clearBoard')
        for(let cellIx = 0; cellIx < board.length; cellIx++) {
            if(board[cellIx] === '#') {
                board[cellIx] =  '#' as CellType
            } else {
                board[cellIx] =  '.' as CellType
            }
        }
    }

    static loadMap(board:string[], map:string) {
        for(let cellIndex = 0; cellIndex < board.length; cellIndex++) {
            board[cellIndex] = map[cellIndex] as CellType
        }
    }
}

export default Util