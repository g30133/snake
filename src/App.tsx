import * as React from 'react';
import './App.css';

import * as C from './constants'

import Board, { CellType } from './Board'
import Snake from './Snake'
import ItemStore from './ItemStore'
import Util from './Util'

interface AppState {
  board: CellType[]
}

interface PlayerInfo {
  name: string
  score: number
}

class App extends React.Component<any, AppState> {
  map:string
  snake:Snake
  aiSnake:Snake
  itemStore:ItemStore
  numLives:number
  currScore:number
  topThreeScores:number[]
  topThreePlayers: PlayerInfo[]

  constructor(props:any) {
    super(props)

    this.gameLoop = this.gameLoop.bind(this)

    this.state = {
      board: []
    }

    this.init()
  }

  private init() {

    this.map = C.map2 
    this.numLives = 3

    for(let i = 0; i < C.NUM_BOARD_ROWS * C.NUM_BOARD_COLS; i++) {
        this.state.board.push(this.map[i] as CellType)
    }

    this.snake = new Snake(10, 10)
    this.aiSnake = new Snake(20, 20)

    this.itemStore = new ItemStore(this.state.board, 1000)

    this.currScore = 0

    this.loadHighScore()

    document.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowLeft') {
        this.onKeyDown('w')
      } else if(event.key === 'ArrowRight') {
        this.onKeyDown('e')
      } else if(event.key === 'ArrowUp') {
        this.onKeyDown('n')
      } else if(event.key === 'ArrowDown') {
        this.onKeyDown('s')
      }
    })
  }

  componentDidMount() {
    this.gameLoop()
  }

  private onKeyDown(direction:string) {
    if(direction === 'w' && this.snake.direction !== 'e') {
      this.snake.direction = 'w'
    } else if (direction === 'e' && this.snake.direction !== 'w') {
      this.snake.direction = 'e'
    } else if (direction === 'n' && this.snake.direction !== 's') {
      this.snake.direction = 'n'
    } else if (direction === 's' && this.snake.direction !== 'n') {
      this.snake.direction = 's'
    }
  }

  private checkSnakeCollisionsAgainstEnvironment(snake:Snake, isAi:boolean) {
    const map = this.map
    const items = this.itemStore.items

    const snakeIxInBoard = snake.units[0].rowIx * C.NUM_BOARD_COLS + snake.units[0].colIx
    // check collistion between head of snake and its body units
    for(const bodyPart of snake.units.slice(1, snake.units.length)) {
      if(bodyPart.rowIx * C.NUM_BOARD_COLS + bodyPart.colIx === snakeIxInBoard) {
        if (isAi === false) {
          this.numLives--
        }
        snake.relocateTo(10, 10)
      }
    }

    // check collision between head of snake and walls
    if (map[snakeIxInBoard] === '#') {
      console.log('hit a wall!')
      if (isAi === false) {
        this.numLives--
      }
      snake.relocateTo(10, 10)
    }
    
    // check collision between head of snake and items
    for(const item of items)  {
      if(item.rowIx * C.NUM_BOARD_COLS + item.colIx === snakeIxInBoard) {
        if (isAi === false) {
          this.currScore++
          this.saveHighScores()
        }
        snake.grow()
        this.itemStore.relocateFrom(this.state.board, item.rowIx, item.colIx)
      }
    }
  }

  private checkSnakeCollisionsWithOtherSnake(snake:Snake, aiSnake:Snake) {
    const snakeIxInBoard = snake.units[0].rowIx * C.NUM_BOARD_COLS + snake.units[0].colIx
    const aiSnakeIxInBoard = aiSnake.units[0].rowIx * C.NUM_BOARD_COLS + aiSnake.units[0].colIx
    for(const snakeUnit of snake.units) {
      if(snakeUnit.rowIx * C.NUM_BOARD_COLS + snakeUnit.colIx === aiSnakeIxInBoard) {
        //snake head collided with aisnake body
        console.log('Snake collided with aiSnake!!!')
      }
    }

    for(const aiSnakeUnit of aiSnake.units) {
      if(aiSnakeUnit.rowIx * C.NUM_BOARD_COLS + aiSnakeUnit.colIx === snakeIxInBoard) {
        console.log('aiSnake collided with snake!!!')
        //ai snake head collided with snake body
      }
    }
  }

  private checkCollisions() {
    this.checkSnakeCollisionsAgainstEnvironment(this.snake, false)
    this.checkSnakeCollisionsAgainstEnvironment(this.aiSnake, true)
    this.checkSnakeCollisionsWithOtherSnake(this.snake, this.aiSnake)
  }

  private gameLoop() {
    console.log('gameLoop()')
    if(this.numLives > 0) {
      setTimeout(this.gameLoop, C.ANIMATION_DELAY)
    } else {
      //GAME OVER TODO
      console.log('currScore:' + this.currScore + ' topThreePlayers:' + this.topThreePlayers[0].score)
      if(this.currScore > this.topThreePlayers[0].score) {
        this.topThreePlayers[2].name = this.topThreePlayers[1].name
        this.topThreePlayers[2].score = this.topThreePlayers[1].score

        this.topThreePlayers[1].name = this.topThreePlayers[0].name
        this.topThreePlayers[1].score = this.topThreePlayers[0].score

        let name = prompt('Enter your name', 'Player')
        if(name === null) {
          name = 'Player'
        }
        this.topThreePlayers[0].name = name.substr(0, 8)
        this.topThreePlayers[0].score = this.currScore
        
      } else if(this.currScore > this.topThreePlayers[1].score) {
        this.topThreePlayers[2].name = this.topThreePlayers[1].name
        this.topThreePlayers[2].score = this.topThreePlayers[1].score

        let name = prompt('Enter your name', 'Player')
        if(name === null) {
          name = 'Player'
        }
        this.topThreePlayers[1].name = name.substr(0, 8)
        this.topThreePlayers[1].score = this.currScore
      } else if(this.currScore > this.topThreePlayers[2].score) {
        let name = prompt('Enter your name', 'Player')
        if(name === null) {
          name = 'Player'
        }
        this.topThreePlayers[2].name = name.substr(0, 8)
        this.topThreePlayers[2].score = this.currScore
      }

      this.saveHighScores()

      const result = document.querySelector('.result')
      if(result !== null) result.classList.remove('hidden')
      
    }
    // if(this.snake.getNextMove(this.state.board) === '.') {
    //   this.snake.move()
    // } else {
    //   console.log('you crashed!')
    //}

    this.snake.move(false, this.state.board)
    
    if(this.aiSnake.checkSurrounded(this.state.board)) {
      this.aiSnake.relocateTo(20, 20)
    } else {
      this.aiSnake.move(true, this.state.board)
    }

    this.checkCollisions()

    this.setState((prevState) => {
      const newBoard:CellType[] = prevState.board.map((elem) => {
        if(elem === '#') {
          return '#' as CellType
        } else {
          return '.' as CellType
        }
      })

      this.itemStore.emit(newBoard)
      this.snake.emit(newBoard)
      this.aiSnake.emit(newBoard)

      console.log('Ai head pos:' + JSON.stringify(this.aiSnake.units[0]))

      return ({
        board: newBoard
      })
    })
  }

  /////////////////////////////////////////////////////////////////////////////
  // local storage functions
  loadFromLocalStorage() {
    console.log('loadFromLocalStorage()')
    const highScoresStr = localStorage.getItem('highScores')
    if (highScoresStr === null) {
      localStorage.setItem('highScores', "[{name: '', score:0},{name: '', score:0|,{name: '', score:0}]")
    }
    else {
      console.log('highScoreStr:(' + highScoresStr + ')')
      this.topThreePlayers = JSON.parse(highScoresStr)
    }
  }

  saveToLocalStorage() {
    console.log('saveToLocalStorage()')
    console.log('this.topThreePlayers()' + this.topThreePlayers.toString())
    localStorage.setItem('highScores', this.topThreePlayers.toString())
  }
   
  private loadHighScore() {
    console.log('loadHighScore()')
    const highScoresStr = localStorage.getItem('highScores')
    console.log('highScoresStr(' + highScoresStr + ')')
    if (highScoresStr) {
        this.topThreePlayers = JSON.parse(highScoresStr)  
    }
    else {
      this.topThreePlayers = [
        {name: '', score:0} as PlayerInfo,
        {name: '', score:0} as PlayerInfo,
        {name: '', score:0} as PlayerInfo
      ]
    }

    console.log('this.highScores:' + this.topThreeScores)
  }

  private saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(this.topThreePlayers))
  }


  public render() {
    console.log('App render()')
    Util.dumpBoard(this.state.board)
    return (
      <div className="app">
        <Board
          board={this.state.board}
        />
        <div className='score'>Current Score:{this.currScore} High Score:{this.topThreePlayers[0].score} Lives:{this.numLives}</div>
        <div className='buttons'>
          <div className='button left' onClick={() => {this.onKeyDown('w')}}> W </div>
          <div className='button down' onClick={() => {this.onKeyDown('s')}}> S </div>
          <div className='button right' onClick={() => {this.onKeyDown('e')}}> E </div>
          <div className='button up' onClick={() => {this.onKeyDown('n')}}> N </div>
        </div>
        <div className='result hidden'>
          <h1>Leaderboard</h1>
          <br/><br/>
          Leader  [{this.topThreePlayers[0].name} ({this.topThreePlayers[0].score})]
          <br/><br/>
          2nd [{this.topThreePlayers[1].name} ({this.topThreePlayers[1].score})]
          <br/><br/>
          3rd [{this.topThreePlayers[2].name} ({this.topThreePlayers[2].score})]
        </div>
      </div>
    );
  }
}

export default App;