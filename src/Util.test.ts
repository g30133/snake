import * as C from './constants'

import Util from './Util'

describe('util', () => {
    it('loadMap()', () => {
        const board:string[] = []
        // initialize the board
        for(let i = 0; i < C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS; i++) {
            board.push('')
        }
    
        Util.loadMap(board, C.map1)
        expect(board[0]).toBe('#')
        expect(board[1]).toBe('#')
        expect(board[2]).toBe('#')
        expect(board[3]).toBe('#')
        expect(board[19]).toBe('#')
        expect(board[20]).toBe('#')
        expect(board[21]).toBe('.')
    })
    
    it('randomUniqueIx() should return a valid index when there is a spot', () => {
        const randomIx = Util.randomUniqueIx(0, 10, [0,1,2,3,4,5,6,7,8,9])
        expect(randomIx).toBe(10)
    })
    
    it('randomUniqueIx() should return -1 when there is no spot', () => {
        const randomIx = Util.randomUniqueIx(0, 10, [0,1,2,3,4,5,6,7,8,9,10])
        expect(randomIx).toBe(-1)
    })

    it('unitIxs() should return all indexes that are not in takenIxs', () => {
        const indexes = [0,1,2,3,4,5,6,7,8,9]
        const takenIxs = [0,1,2,3,4,6,7,9]
        expect(Util.unitIxs(takenIxs, indexes)).toEqual([5,8])
    })

})
