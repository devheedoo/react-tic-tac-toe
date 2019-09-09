import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
     className="square"
     onClick={props.onClick}
     style={props.style}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const { squares, onClick, winLine } = this.props;
    if (winLine && winLine.indexOf(i) > -1) {
      return (
        <Square
         key={i}
         value={squares[i]}
         onClick={() => onClick(i)}
         style={{ backgroundColor: 'green' }}
        />
      )
    } else {
      return (
        <Square
         key={i}
         value={squares[i]}
         onClick={() => onClick(i)}
        />
      )
    }
  }

  render() {
    const rowSize = 3;
    const columnSize = 3;

    const board = [];
    for (let rowIter=0; rowIter<rowSize; rowIter++) {
      let boardRow = [];
      for(let columnIter=0; columnIter<columnSize; columnIter++) {
        boardRow.push(this.renderSquare((rowIter * 3) + columnIter));
      }
      board.push(boardRow);
    }

    return (
      <div>
        {board.map((boardRow, rowIndex) => {
          return (
            <div className="board-row" key={rowIndex}>
              {boardRow}
            </div>
          )
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        squareIndex: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isMovesReversed: false,
    }
  }

  handleClick(i) {
    const { stepNumber, xIsNext } = this.state;
    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squaresCopy = current.squares.slice();
    if (calculateWinnerAndWinLine(squaresCopy) || squaresCopy[i]) {
      return;
    }
    squaresCopy[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squaresCopy,
        squareIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      history: this.state.history.slice(0, move + 1),
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    })
  }

  reverseMoves() {
    this.setState({
      isMovesReversed: !this.state.isMovesReversed,
    });
  }

  render() {
    const { history, stepNumber, xIsNext, isMovesReversed } = this.state;
    const current = history[stepNumber];
    const winnerAndWinLine = calculateWinnerAndWinLine(current.squares);
    const winner = winnerAndWinLine && winnerAndWinLine.winner;
    const winLine = winnerAndWinLine && winnerAndWinLine.line;

    const movesArray = [];
    history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + (Math.floor(step.squareIndex / 3)) + ', ' + (step.squareIndex % 3) + ')' :
        'Go to game start';
      if (!isMovesReversed) {
        movesArray.push(
          <li key={move}>
            <button
            style={{ fontWeight: stepNumber === move ? 'bold' : 'normal' }}
            onClick={() => this.jumpTo(move)}
            >{desc}</button>
          </li>
        );
      } else {
        movesArray.unshift(
          <li key={move}>
            <button
            style={{ fontWeight: stepNumber === move ? 'bold' : 'normal' }}
            onClick={() => this.jumpTo(move)}
            >{desc}</button>
          </li>
        );
      }
    });


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
           squares={current.squares}
           onClick={(i) => this.handleClick(i)}
           winLine={winLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseMoves()}>Reverse Moves</button>
          <ol>{movesArray}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinnerAndWinLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }
  return null;
}