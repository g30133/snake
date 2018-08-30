import * as C from './constants'

import ItemStore from './ItemStore'
import Util from './Util'
import { CellType } from './Board'

describe('ItemStore', () => {
    
    let itemStore:ItemStore
    let board:CellType[]

    beforeEach(() => {
        board = []
        for (let i = 0; i < C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS; i++) {
            board.push('.')
        }
    })

    it('should work with 1 item max', () => {
        itemStore = new ItemStore(board, 1)
        
        itemStore.emit(board)
        expect(board).toContain('A')

        const item = itemStore.items[0]
        const rowIx = item.rowIx
        const colIx = item.colIx
        itemStore.relocateFrom(board, item.rowIx, item.colIx)

        expect(itemStore.items[0]).not.toEqual({type:'A', rowIx:rowIx, colIx:colIx})

        Util.clearBoard(board)
        itemStore.emit(board)
        expect(board).toContain('A')

    })

    it('should work with 2 items max', () => {
        itemStore = new ItemStore(board, 2)
        
        itemStore.emit(board)
        expect(board).toContain('A')

        const item1 = itemStore.items[0]
        const r1 = item1.rowIx
        const c1 = item1.colIx
        const item2 = itemStore.items[1]
        const r2 = item2.rowIx
        const c2 = item2.colIx
        itemStore.relocateFrom(board, item1.rowIx, item1.colIx)

        expect(itemStore.items[0]).not.toEqual({type:'A', rowIx:r1, colIx:c1})
        console.log('itemStore:' + JSON.stringify(itemStore))
        console.log('itemStore.items[0]:' + JSON.stringify(itemStore.items[0]))
        console.log('should not be equal to rowIx:' + r2 + ' colIx:' + c2)
        expect(itemStore.items[0]).not.toEqual({type:'A', rowIx:r2, colIx:c2})

        itemStore.relocateFrom(board, item2.rowIx, item2.colIx)
        expect(itemStore.items[1]).not.toEqual({type:'A', rowIx:r2, colIx:c2})
        expect(itemStore.items[1]).not.toEqual({type:'A', rowIx:r1, colIx:c1})

        Util.clearBoard(board)
        itemStore.emit(board)
        expect(board).toContain('A')

    })
})