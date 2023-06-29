import React, { useState } from "react";
import { motion } from "framer-motion";

import "./App.css";

import BackXO from "./BackXO";
import Start from "./Start";

const buttonVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const gameVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningCombination, setWinningCombination] = useState(null);

  const [showGame, setShowGame] = useState(false);

  const handleStartClick = () => {
    setShowGame(true);
  };

  const handleSquareClick = (index) => {
    if (board[index] === null && !winner) {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);

      checkWinner(newBoard, player);

      // Switch player
      setPlayer(player === "X" ? "O" : "X");
    }
  };

  const checkWinner = (board, currentPlayer) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        board[a] === currentPlayer &&
        board[b] === currentPlayer &&
        board[c] === currentPlayer
      ) {
        setWinner(currentPlayer);
        setWinningCombination(combination);
        break;
      }
    }
  };

  const renderSquare = (index) => {
    const isWinningSquare =
      winningCombination && winningCombination.includes(index);
    return (
      <motion.button
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        key={index}
        className={`square ${isWinningSquare ? "winning-square" : ""}`}
        onClick={() => handleSquareClick(index)}
      >
        {board[index] && <span>{board[index]}</span>}
      </motion.button>
    );
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
    setWinningCombination(null); // Reset the winning combination
  };

  return (
    <div className="App container">
      {!showGame && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: 1 }}
        >
          <Start handleClick={handleStartClick} />
        </motion.div>
      )}
      <BackXO />
      {showGame && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={gameVariants}
          className="game-conatiner"
        >
          <div className="game">
            <div className="center-logo"></div>
            <div className="game-box">
              <h1>Tic Tac Toe</h1>
              <div className="board">
                {board.map((square, index) => renderSquare(index))}
              </div>
              {winner && <h2>{winner} wins!</h2>}
              {!winner && board.every((square) => square !== null) && (
                <h2>It's a draw!</h2>
              )}
              <button className="reset-button" onClick={resetGame}>
                Reset Game
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
