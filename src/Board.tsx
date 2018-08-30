import * as React from 'react';
import './Board.css';

export type CellType = '.' | '#' | 'H' | 'B' | 'A'

interface BoardProps {
    board:  CellType[]
}

class Board extends React.Component<BoardProps> {
    public render() {
        const cells = []
        for(let i = 0; i < this.props.board.length; i++) {
            let className = 'cell'
            switch (this.props.board[i]) {
                case '.':
                className += ' empty'
                break;
                case '#':
                className += ' boundary'
                break
                case 'H':
                className += ' head'
                break;
                case 'B':
                className += ' body'
                break;
                case 'A':
                className += ' apple'
                break
                default:
            }
            const cell = <div key={i} className={className}></div>
            cells.push(cell)
        }
        return (
            <div className="board">
                {cells}
            </div>
        )
    }
}

export default Board