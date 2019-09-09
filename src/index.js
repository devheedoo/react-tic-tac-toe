import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
     className="square"
     onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const { squares, onClick } = this.props;
    return (
      <Square
       key={i}
       value={squares[i]}
       onClick={() => onClick(i)}
      />
    )
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
    }
  }

  handleClick(i) {
    const { stepNumber, xIsNext } = this.state;
    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squaresCopy = current.squares.slice();
    if (calculateWinner(squaresCopy) || squaresCopy[i]) {
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

  render() {
    const { history, stepNumber, xIsNext } = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + (Math.floor(step.squareIndex / 3)) + ', ' + (step.squareIndex % 3) + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button
           style={{ fontWeight: stepNumber === move ? 'bold' : 'normal' }}
           onClick={() => this.jumpTo(move)}
          >{desc}</button>
        </li>
      );
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
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}