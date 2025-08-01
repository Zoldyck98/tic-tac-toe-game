import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "square-winning" : ""}`}
      onClick={onSquareClick}>
      {value}
    </button>);
}


function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  let status;
  let winningLine = [];
  if (result) {
    status = "Winner: " + result.winner;
    winningLine = result.line;
  } else if (squares.every(square => square !== null)) {
    status = "Empate";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || result) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const boardRows = [0, 1, 2].map(row => (
    <div clasName="board-row" key={row}>
      {[0, 1, 2].map(col => {
        const idx = row * 3 + col;
        const isWinning = winningLine.includes(idx);
        return (
          <Square
            key={idx}
            value={squares[idx]}
            onSquareClick={() => handleClick(idx)}
            isWinning={isWinning}
          />
        );
      })}
    </div>
  ))
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveIdx: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [reverseMoves, setReverseMoves] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;


  function handlePlay(nextSquares, moveIdx) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1), { squares: nextSquares, moveIdx }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleMoveOrder(arr) {
    return arr.slice().reverse();
  }

  const movesArray = history.map((step, move) => {
    let description;
    const idx = step.moveIdx;
    const row = Math.floor(idx / 3) + 1;
    const col = (idx % 3) + 1;
    if (move > 0) {
      description = `Go to move # ${move} (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}> {move === currentMove
        ? <span>
          {currentMove > 0
            ? `Estás en el movimiento n.º${move} (${row}, ${col})`
            : "Estás en el inicio del juego"}
        </span>
        : <button onClick={() => jumpTo(move)}>{description}</button>
      }
      </li>
    );
  });

  const moves = reverseMoves ? toggleMoveOrder(movesArray) : movesArray;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setReverseMoves(!reverseMoves)}>
          {reverseMoves ? "Mostrar movimientos en orden normal" : "Mostrar movimientos en orden inverso"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }

  return null;
}