import './App.css';
import Card from './components/Card';
import GameInfo from './components/GameInfo';
import Score from './components/GameInfo';
import Loader from './components/Loader';
import useSocket, {socketEventKeys} from './hooks/useSocket';
import React, {useState, useEffect} from 'react';

const makeGrid = (input, teamColor, props, guessPositions, setGuessPositions, turn, nbOfGuess) => {
  if (input === undefined || input.length !== 25) return;
  const output = []
  for (let i=0; i<5; i++) {
    let tmp = []
    for (let j=0; j<5; j++) {
      let properties = {
        setGuessPositions,
        position: i*5 + j,
        teamColor,
        guessPositions,
        turn,
        nbOfGuess
      }
      props.forEach((prop) => properties[prop] = input[i*5+j][prop]);
      tmp.push(<div>
        <Card {...properties} />
      </div>)
    }
    output.push(tmp)
  }
  return output
}

function App() {

  const { turn, teamColor, gameGrid, sendMessage, guessHelper, changeTurn, gameStatus, numberOfClients } = useSocket();
  
  const [gridContent, setGridContent] = useState([])
  const [numberOfWordsToGuess, setNumberOfWordsToGuess] = useState(1);
  const [clue, setClue] = useState("");
  const [guessPositions, setGuessPositions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [nbOfPlayers, setnbOfPlayers] = useState(2);
  const timeoutRef = React.useRef(null);
  const handleHelpWordInput = (e) => {
    console.log("value changing");
    setClue(e.target.value);
  }
  
  const handleNbOfGuess = (addition=true) => {
    if (addition) {
      if (numberOfWordsToGuess >= 5) {
        setErrorMsg("Maximum 5 words to guess by clue")
        timeoutRef.current = setTimeout(() => setErrorMsg(""), 2000)
        return;
      }
      setNumberOfWordsToGuess((nb) => nb + 1)
      setErrorMsg("")
    }
    else {
      if (numberOfWordsToGuess === 1) {
        return
      }
      setNumberOfWordsToGuess((nb) => nb - 1)
      setErrorMsg("")
    }
  }
  const handleSubmitProposal = (e) => {
    e.preventDefault();
    if (guessPositions.length === 0) return;
    setGuessPositions([]);
    setNumberOfWordsToGuess(1);
    setClue('');
    changeTurn();
    sendMessage(guessPositions, teamColor, "guess_from_client")
  }
  const restartGame  = () => {
    console.log("restarting game");
    setGuessPositions([]);
    setNumberOfWordsToGuess(1);
    setClue('');
    sendMessage({}, teamColor, "new_game_client")
  };

  const handleSubmitHelper = (e) => {
    e.preventDefault();
    console.log("entering submit helper")
    
    if (clue.length === 0 ) {
      setErrorMsg("You need to provide a clue!")
      timeoutRef.current = setTimeout(() => setErrorMsg(""), 2000)
      return
    };
    sendMessage({clue: clue, number_of_guess: numberOfWordsToGuess}, teamColor, "helper_from_client")
  };
    

  useEffect(()=> {
    setGridContent(() => makeGrid(gameGrid, teamColor, ["discovered", "color", "word"], guessPositions, setGuessPositions, turn, guessHelper.nbOfGuess))
  }, [numberOfClients, guessPositions, gameGrid, teamColor, turn, guessHelper.nbOfGuess])

  useEffect(() => {
    console.log("number of clients", numberOfClients);
  }, [numberOfClients])

  useEffect(() => {
    return(() => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    });
  }, [])
  return (
    <div className="w-full h-full bg-[#282c34] flex flex-row justify-center items-center">
      {gameGrid.length > 0 &&
      <div className="flex flex-col space-y-4">
       <div className="text-center ml-4 text-white font-bold box-border bg-gray-500 rounded border-2">You're part of <span className={teamColor === "red" ? "italic text-red-400 font-bold" : "italic text-blue-300 font-bold"}>{teamColor.toUpperCase()}</span> team! </div>
       <GameInfo
         gameGrid={gameGrid}
         turn={turn}
        />
        {turn === teamColor && guessHelper.clue !== "" ? 
         <button
           onClick={(e) => handleSubmitProposal(e)}
           className={`ml-4 text-white font-bold box-border bg-gray-500 rounded border-2 ${guessPositions.length === 0 && "cursor-not-allowed"}`}
         >
          Send proposal
         </button>
         : <></>
        }
        </div>
      }
    <div className="w-full h-[100vh]  flex items-center flex-col justify-center">
      {gameStatus.status === 'end' && 
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-transparent z-40">
          <div className={`flex justify-center items-center flex-col font-bold text-white text-lg text-center w-[40vw] h-[20vh] absolute top-[calc((100%-20vh)/2)] left-[calc((100%-40vw)/2)] z-40 bg-[#282c34]`}>
              <div className="">{gameStatus.winner === teamColor ? "Your team won" : "Enemy team won"}</div>
              <button
                className="border-2 rounded border-gray-400"
                onClick={restartGame}
              >Restart the game</button>
          </div>
        </div>
      }
      {numberOfClients < 2 &&
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-transparent z-40">
          <div className={`flex justify-center items-center flex-col font-bold text-white text-lg text-center w-[40vw] h-[25vh] absolute top-[calc((100%-20vh)/2)] left-[calc((100%-40vw)/2)] z-40 bg-[#282c34] border-2 rounded border-red-600`}>
              <div className="">Waiting for another player to join</div>
              <Loader />
          </div>
        </div>
      }
      {turn === teamColor ? 
       guessHelper.clue === "" ? 
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-transparent z-20">
          <div className={`rounded border-2 border-white flex-col flex justify-center items-center font-bold text-white text-lg text-center w-[40vw] h-[25vh] absolute top-[calc((100%-25vh)/2)] left-[calc((100%-40vw)/2)] z-40 bg-[#282c34]`}>
              <div className="">Waiting for {nbOfPlayers === 2 ? "other player" : "your spy"} to set clue</div>
              <Loader />
          </div>
        </div> 
        
      : <div className="flex flex-col text-white">
          <div className="flex flex-row">
            <p className="font-semibold ">clue:</p>
            <p className="ml-6 font-bold underline italic "> {guessHelper.clue} </p>
          </div>
          <div className="flex flex-row">
            <p className="font-semibold ">number of words: </p>
            <p className="ml-6 font-bold underline italic ">{guessHelper.nbOfGuess}</p>
          </div>
        </div>
      :<></>
      }
      <div className={`${(turn === teamColor && guessHelper.clue === "") || gameStatus.status === 'end' ? "test_blur" : ""} flex flex-row max-h-[100vh] overflow-hidden`}>
        <div className="rounded flex flex-col space-y-2 bg-blue-300">
          {gridContent && numberOfClients >= 2 && gridContent.map((rowContent, index) => {
          return (
            <div key={index} className="relative -top-[12vh] max-h-[calc(15vh+0.5rem)] flex flex-row space-x-2">
              {rowContent && rowContent.map((cardContent, index_) => {
                return(
                  <React.Fragment key={index_}>
                    {cardContent}
                  </React.Fragment>
                )
              })}
            </div>
          )}
        )}
        </div>
      </div>
        
        { turn !== teamColor && guessHelper.clue === "" && numberOfClients >= 2? 
        <div className="mt-5 flex flex-row space-x-2"> 
          <input
          // ref={clueRef}
          type="text"
          value={clue}
          onChange={handleHelpWordInput}
          placeholder='type your clue here'
          className="text-blue-700 h-[30px]"
          />
          <div className="flex flex-row m-0 pt-1">
          {errorMsg && <p className="italic text-red-600">{errorMsg}</p>}
            <p className="px-4 font-bold text-white">{numberOfWordsToGuess}</p>
            <div className="flex flex-row space-x-4">
              <button
                onClick={() => handleNbOfGuess()}
                className="font-white font-bold my-auto box-border w-[24px]  border-gray-500 rounded border-2"
              >+</button>
              <button
                onClick={() => handleNbOfGuess(false)}
                className="font-white font-bold my-auto box-border w-[24px]  border-gray-500 rounded border-2"
              >-</button>
              <button className={`${clue.length === 0 && "cursor-not-allowed"} box-border border-white rounded border-2`} onClick={handleSubmitHelper}>Submit choices</button>
            </div>
          </div>
        </div>
        : <></> }
    </div>
    
    </div>
  );
}

export default App;
