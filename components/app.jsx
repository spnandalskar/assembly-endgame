import React from "react";
import { languages } from "../languages";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "../utils";
import Confetti from "react-confetti";

export default function AssemblyEndgame() {
  // State values
  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());

  console.log(currentWord);

  const [guessedLetters, setGuessedLetters] = React.useState([]);

  // Derived values
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // functions
  function addGuessedLetter(letter) {
    return setGuessedLetters((prev) => {
      const letterSet = new Set(prev);
      letterSet.add(letter);
      return Array.from(letterSet);
    });
  }

  function startNewGame() {
    setGuessedLetters([]);
    setCurrentWord(getRandomWord());
  }

  // Elements
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };

    const className = clsx("chip", isLanguageLost && "lost");

    return (
      <span className={className} key={lang.name} style={styles}>
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const className = clsx(
      "letter",
      isGameLost && !guessedLetters.includes(letter) && "notGuessed"
    );
    return (
      <span className={className} key={index}>
        {!isGameOver
          ? guessedLetters.includes(letter) && letter.toUpperCase()
          : letter.toUpperCase()}
      </span>
    );
  });

  const keyElements = alphabet.split("").map((key) => {
    const isGuessed = guessedLetters.includes(key);
    const isCorrect = isGuessed && currentWord.includes(key);
    const isWrong = isGuessed && !currentWord.includes(key);
    const className = clsx({ correct: isCorrect, wrong: isWrong });

    return (
      <button
        className={className}
        key={key}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(key)}
        aria-label={`Letter ${key}`}
        onClick={() => addGuessedLetter(key)}
      >
        {key.toUpperCase()}
      </button>
    );
  });

  // Clsx Classes
  const gameStatusClass = clsx("status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return <p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>;
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done!🎊🎉✨</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly😭</p>
        </>
      );
    }
  }

  return (
    <>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <main>
        <header>
          <h1>Assembly : Endgame</h1>
          <p>
            Guess the word under <strong>8 attempts</strong> to keep the
            programming world safe from Assembly!
          </p>
        </header>
      </main>
      <section className={gameStatusClass} aria-live="polite" role="status">
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>

      {/* This section is combined for screen-readers only*/}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(guessedLetters[guessedLetters.length - 1])
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {wrongGuessCount - 8} attempts left.
        </p>
        <p>
          Current word:
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="keyboard">{keyElements}</section>
      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </>
  );
}
