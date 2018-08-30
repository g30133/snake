import * as C from './constants'

import { CellType } from './Board'

import Snake from './Snake'

describe('snake', () => {

    let snake:Snake
    let board:CellType[]

    beforeEach(() => {
        snake = new Snake(10, 10)
        board = []
        for (let i = 0; i < C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS; i++) {
            board.push('.')
        }
    })

    it('sanity test', () => {
        expect(snake.units).toHaveLength(1)
        expect(snake.units[0]).toEqual({type:'H', rowIx:10, colIx:10})
    })
    
    it('should move', () => {
        snake.setDirection('n')
        snake.move()
        expect(snake.units[0]).toEqual({type:'H', rowIx:9, colIx:10})

        snake.setDirection('e')
        snake.move()
        expect(snake.units[0]).toEqual({type:'H', rowIx:9, colIx:11})

        snake.setDirection('s')
        snake.move()
        expect(snake.units[0]).toEqual({type:'H', rowIx:10, colIx:11})

        snake.setDirection('w')
        snake.move()
        expect(snake.units[0]).toEqual({type:'H', rowIx:10, colIx:10})

        snake.move()
        expect(snake.units[0]).toEqual({type:'H', rowIx:10, colIx:9})
    })

    it('should emit', () => {
        snake.emit(board)
        expect(board[C.NUM_BOARD_COLS * 10 + 10]).toBe('H')
    })

    it('should grow', () => {
        snake.grow()
        expect(snake.units).toHaveLength(2)

        snake.setDirection('n')
        snake.move()
        console.log('snake:' + JSON.stringify(snake.units))
        expect(snake.units[0]).toEqual({type:'H', rowIx:9, colIx:10})
        expect(snake.units[1]).toEqual({type:'B', rowIx:10, colIx:10})

        snake.move()
        expect(snake.units[0]).toEqual({type:'H', rowIx:8, colIx:10})
        expect(snake.units[1]).toEqual({type:'B', rowIx:9, colIx:10})

    })


})
