import './App.css';
import Card from './components/Card';
import useSocket, {socketEventKeys} from './hooks/useSocket';
import React, {useState, useEffect} from 'react';

const fiveByFive = (input, teamColor, props, guessPositions, setGuessPositions, turn, nbOfGuess) => {
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

  const { turn, teamColor, gameGrid, sendMessage, guessHelper, changeTurn } = useSocket();
  
  const [gridContent, setGridContent] = useState([])
  const [numberOfWordsToGuess, setNumberOfWordsToGuess] = useState(1);
  const [clue, setClue] = useState("");
  const [guessPositions, setGuessPositions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [nbOfPlayers, setnbOfPlayers] = useState(2)

  const handleHelpWordInput = (e) => {
    setClue(e.target.value);
  }
  
  const handleNbOfGuess = (addition=true) => {
    if (addition) {
      if (numberOfWordsToGuess >= 5) {
        setErrorMsg((errorMsg) => {return {...errorMsg, "nbWords": "Maximum 5 words to guess by clue"}})
        return;
      }
      setNumberOfWordsToGuess((nb) => nb + 1)
      setErrorMsg((errorMsg) => {return {...errorMsg, "nbWords": ""}})
    }
    else {
      if (numberOfWordsToGuess === 1) {
        return
      }
      setNumberOfWordsToGuess((nb) => nb - 1)
      setErrorMsg((errorMsg) => {return {...errorMsg, "nbWords": ""}})
    }
  }
  const handleSubmitProposal = (e) => {
    e.preventDefault();
    console.log("test guess position", guessPositions)
    // setGuessPositions([]);
    setNumberOfWordsToGuess(1);
    setClue('');
    changeTurn();
    
    sendMessage(guessPositions, teamColor, socketEventKeys.guess_client)
  }
  const handleSubmitHelper = (e) => {
    e.preventDefault();
    if (clue.length === 0 ) return;
    sendMessage({clue: clue, number_of_guess: numberOfWordsToGuess}, teamColor, socketEventKeys.emit_guess_helper)
  }

  useEffect(() => {
    console.log("mounting");
  }, [])
  /**
   * setClue("")
    setNumberOfWordsToGuess(1);
   */
    

  useEffect(()=> {
    setGridContent(() => fiveByFive(gameGrid, teamColor, ["discovered", "color", "word"], guessPositions, setGuessPositions, turn, guessHelper.nbOfGuess))
  }, [guessPositions, gameGrid, teamColor, turn, guessHelper.nbOfGuess])

  return (
    <div className="w-full h-[100vh] bg-[#282c34] flex items-center flex-col justify-center">
      {turn === teamColor ? 
       guessHelper.clue === "" ? 
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-transparent z-20">
          <div className={`flex justify-center items-center font-bold text-white text-lg text-center w-[40vw] h-[20vh] absolute top-[calc((100%-20vh)/2)] left-[calc((100%-40vw)/2)] z-40 bg-[#282c34]`}>
              <div className="">Waiting for {nbOfPlayers === 2 ? "other player" : "your spy"} to set clue</div>
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
      <div className="font-bold text-white self-center justify-self-start">{teamColor}</div>
      <div className={`${turn === teamColor && guessHelper.clue === "" ? "test_blur" : ""} flex flex-row max-h-[100vh] overflow-hidden`}>
        <div className="rounded flex flex-col space-y-2 bg-blue-300">
          {gridContent && gridContent.map((rowContent, index) => {
          return (
            <div key={index} className="relative -top-[calc(12vh+0.5rem)] max-h-[calc(15vh+0.5rem)] flex flex-row space-x-2">
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
        {turn === teamColor && guessHelper.clue !== "" ? 
         <button
           onClick={(e) => handleSubmitProposal(e)}
           className="text-white font-bold box-border border-gray-500 rounded border-2"
         >
          Send proposal
         </button>
         : <></>
        }
        { turn !== teamColor && guessHelper.clue === "" ? 
        <div className="mt-5 flex flex-row space-x-2 space-y-2"> 
          <input
          type="text"
          value={clue}
          onChange={handleHelpWordInput}
          placeholder='type your clue here'
          className="text-blue-700 h-[30px]"
          />
          <div className="flex flex-row m-0 p-0">
          {errorMsg.nbWords && <p className="italic text-red-600">{errorMsg.nbWords}</p>}
            <p>{numberOfWordsToGuess}</p>
            <div className="flex flex-row space-x-4">
              <button
                onClick={() => handleNbOfGuess()}
                className="box-border w-[24px] h-[24px] border-gray-500 rounded border-2"
              >+</button>
              <button
                onClick={() => handleNbOfGuess(false)}
                className="box-border w-[24px] h-[24px] border-gray-500 rounded border-2"
              >-</button>
              <button className={`${clue.length === 0 && "cursor-not-allowed"} box-borderborder-gray-500 rounded border-2`} onClick={handleSubmitHelper}>Submit choices</button>
            </div>
          </div>
        </div>
        : <></> }
    </div>
  );
}

export default App;
