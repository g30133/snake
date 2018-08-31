
import { CellType } from './Board'
import * as C from './constants'
//import Util from './Util'


type DirectionType = 'n' | 's' | 'e' | 'w'

type UnitType = 'H' | 'B'

interface Unit {
    type: UnitType
    rowIx:number
    colIx:number
}

class Snake {
    units:Unit[] = []
    direction:DirectionType

    constructor(rowIx:number, colIx:number) {
        const head:Unit = { type: 'H', rowIx: rowIx, colIx: colIx }
        this.units.push(head)
        this.setDirection('n')
    }

    setDirection(direction:DirectionType) {
        this.direction = direction
    }

    getNextMove() {
        let rowIx = -1
        let colIx = -1
        switch(this.direction) {
            case 'n':
            rowIx = this.units[0].rowIx-1
            colIx = this.units[0].colIx
            break

            case 'e':
            rowIx = this.units[0].rowIx
            colIx = this.units[0].colIx+1
            break

            case 's':
            rowIx = this.units[0].rowIx+1
            colIx = this.units[0].colIx
            break

            case 'w':
            rowIx = this.units[0].rowIx
            colIx = this.units[0].colIx-1
            break
        }
        return rowIx * C.NUM_BOARD_COLS + colIx
    }

    checkSurrounded(board:CellType[]) {
        const northValue = board[(this.units[0].rowIx-1) * C.NUM_BOARD_COLS + this.units[0].colIx]
        const southValue = board[(this.units[0].rowIx+1) * C.NUM_BOARD_COLS + this.units[0].colIx]
        const eastValue = board[this.units[0].rowIx * C.NUM_BOARD_COLS + this.units[0].colIx+1]
        const westValue = board[this.units[0].rowIx * C.NUM_BOARD_COLS + this.units[0].colIx-1]
        console.log('northValue:' + JSON.stringify(northValue))
        console.log('southValue:' + JSON.stringify(southValue))
        console.log('eastValue:' + JSON.stringify(eastValue))
        console.log('westValue:' + JSON.stringify(westValue))
        if(
            (northValue === 'B' || northValue === '#') &&
            (southValue === 'B' || southValue === '#') &&
            (eastValue === 'B' || eastValue === '#') &&
            (westValue === 'B' || westValue === '#')
        ) {
            console.log('SURROUNDED')
            return true
        }
        return false
    }

    move(isRandom:boolean, board:CellType[]) {
        if (isRandom === true) {
            this.moveRandom(board)
            this.moveStraight()
        }
        else {
            this.moveStraight()
        }
    }

    moveRandom(board:CellType[]) {
        console.log('moveRandom!!! getNextMove' + this.getNextMove())
        while(true) {
            if(this.checkSurrounded(board)) {
                break
            }
            const r = Math.random()
            console.log('r:' + r)
            console.log('relooping...')
            if(r < 0.1) {
                if(this.direction !== 's' as DirectionType) {
                    this.setDirection('n')
                    if(board[this.getNextMove()] === '.' || board[this.getNextMove()] === 'A') {
                        console.log('CHANGED DIRECTIONS NORTH')
                        break
                    }
                }
            } else if(r < 0.2) {
                if(this.direction !== 'n' as DirectionType) {
                    this.setDirection('s') 
                    if(board[this.getNextMove()] === '.' || board[this.getNextMove()] === 'A') {
                        console.log('CHANGED DIRECTIONS SOUTH')
                        break
                    }
                }
            } else if(r < 0.3) {
                if(this.direction !== 'w' as DirectionType) {
                    this.setDirection('e') 
                    if(board[this.getNextMove()] === '.' || board[this.getNextMove()] === 'A') {
                        console.log('CHANGED DIRECTIONS EAST')
                        break
                    }
                }
            } else if(r < 0.4) {
                if(this.direction !== 'e' as DirectionType) {
                    this.setDirection('w')
                    if(board[this.getNextMove()] === '.' || board[this.getNextMove()] === 'A') {
                        console.log('CHANGED DIRECTIONS WEST')
                        break
                    }
                }
            } else {
                if(board[this.getNextMove()] === '.' || board[this.getNextMove()] === 'A') {
                    break
                }
            }
        }
        console.log('direction:' + this.direction)
    }

    moveStraight() {
        // for body
        for(let bodyIndex = this.units.length-1; bodyIndex > 0; bodyIndex--) {
            this.units[bodyIndex].colIx = this.units[bodyIndex-1].colIx
            this.units[bodyIndex].rowIx = this.units[bodyIndex-1].rowIx
        }

        // for head
        switch(this.direction) {
            case 'n':
                this.units[0].rowIx--
            break

            case 'e':
            this.units[0].colIx++
            break

            case 's':
            this.units[0].rowIx++
            break

            case 'w':
            this.units[0].colIx--
            break
        }
    }

    relocateTo(rowIx:number, colIx:number) {
        this.units = []
        const head:Unit = { type: 'H', rowIx: rowIx, colIx: colIx }
        this.units.push(head)
        this.setDirection('n')
    }

    emit(board:CellType[]) {
        //Util.dumpBoard(board)
        for(const unit of this.units) {
            const index = unit.rowIx * C.NUM_BOARD_COLS + unit.colIx
            board[index] = unit.type
        }
    }

    grow() {
        console.log('GROW()')
        this.units.push({
            type:'B',
            rowIx: this.units[this.units.length-1].rowIx,
            colIx: this.units[this.units.length-1].colIx
        })
        console.log('UNITS AFTER PUSH:' + JSON.stringify(this.units))
    }
}

export default Snake