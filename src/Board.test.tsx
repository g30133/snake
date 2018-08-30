import * as React from 'react';

import * as C from './constants'

import { shallow } from 'enzyme';
import Board, { CellType } from './Board';

describe('board', () => {
    it('sanity test', () => {
        const board:CellType[] = []
        for (let i = 0; i < C.NUM_BOARD_ROWS * C.NUM_BOARD_ROWS; i++) {
            board.push('.')
        }
    
        const wrapper = shallow(<Board board={board}/>)
        expect(wrapper.find('.board')).toHaveLength(1)
    })

    it('should render snake', () => {
        const board:CellType[] = []
        for (let i = 0; i < C.NUM_BOARD_ROWS * C.NUM_BOARD_ROWS; i++) {
            board.push('.')
        }

        board[C.NUM_BOARD_COLS * 10 + 10] = 'H'
        board[C.NUM_BOARD_COLS * 10 + 11] = 'B'
        board[C.NUM_BOARD_COLS * 10 + 12] = 'B'

        const wrapper = shallow(<Board board={board}/>)
        expect(wrapper.find('.head')).toHaveLength(1)
        expect(wrapper.find('.body')).toHaveLength(2)
    })
})
