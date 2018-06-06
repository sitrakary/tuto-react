import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {
  render () {
    if (this.props.winner) {
      return (
        <button className='square highlight' onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      )
    } else {
      return (
        <button className='square' onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      )
    }
  }
}

class Board extends React.Component {
  renderSquare (i) {
    const isWinner = this.props.winner ? this.props.winner.indexOf(i) > -1 : false
    return <Square winner={isWinner} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
  }

  renderRow (lineNumber) {
    let lines = []
    const start = lineNumber * 3
    for (var i = 0; i < 3; i++) {
      lines = lines.concat([this.renderSquare(start + i)])
    }
    return (
      <div className='board-row'>
        {lines}
      </div>
    )
  }

  render () {
    let rows = []
    for (var i = 0; i < 3; i++) {
      rows = rows.concat([this.renderRow(i)])
    }
    return (
      <div>
        {rows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      clickPosition: [{
        row: null,
        col: null
      }],
      historyIsAsc: true // or desc
    }
  }

  handleClick (i) {
    const history = this.state.history
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const clickPosition = this.state.clickPosition.slice()
    if (calculateWinner(squares)) {
      return
    }
    if (squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{squares: squares}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clickPosition: clickPosition.concat([this.moveLocation(i)])
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  moveLocation (position) {
    let col = position % 3
    let row = 0
    let i = 0
    while (i < position + 1) {
      if (i % 3 === 0) {
        row++
      }
      i++
    }
    return {
      row: row - 1,
      col: col
    }
  }

  renderMove (step, move) {
    const clickPosition = this.state.clickPosition
    const description = move ? 'Go to move: #' + move : 'Go to start'
    if (move === this.state.stepNumber) {
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <b>{description} ({clickPosition[move].row}, {clickPosition[move].col})</b>
          </button>
        </li>
      )
    } else {
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {description} ({clickPosition[move].row}, {clickPosition[move].col})
          </button>
        </li>
      )
    }
  }

  handleToggleButton () {
    this.setState({
      historyIsAsc: !this.state.historyIsAsc
    })
  }

  render () {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    let status = ''
    let moves = history.map((step, move) => {
      return this.renderMove(step, move)
    })
    if (!this.state.historyIsAsc) {
      moves = moves.reverse()
    }
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]]
    } else {
      if (!winner && this.state.stepNumber === 9) {
        status = 'No one wins, It\'s a draw'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      }
    }
    return (
      <div className='game'>
        <div className='game-board'>
          <Board winner={winner} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <div><button onClick={() => this.handleToggleButton()}>Toggle</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (var i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]
    }
  }
  return null
}
