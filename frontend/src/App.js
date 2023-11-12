import './App.css';
import Card from './components/Card';
import useSocket from './useSocket';
import React, {useState} from 'react';

const grid = [
  {
    "discovered": false,
    "word": "a1",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "b1",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "c1",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "d1",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "e1",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "a2",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "b2",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "c2",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "d2",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "e2",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "a3",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "b3",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "c3",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "d3",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "e3",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "a4",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "b4",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "c4",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "d4",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "e4",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "a5",
    "color": "blue"
  },
  {
    "discovered": false,
    "word": "b5",
    "color": "red"
  },
  {
    "discovered": false,
    "word": "c5",
    "color": "white"
  },
  {
    "discovered": false,
    "word": "d5",
    "color": "black"
  },
  {
    "discovered": false,
    "word": "e5",
    "color": "blue"
  }
]

const fiveByFive = (input, props) => {
  if (input.length !== 25) return;
  const output = []
  for (let i=0; i<5; i++) {
    let tmp = []
    for (let j=0; j<5; j++) {
      let properties = {position: i*5 + j}
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

  const { role, gameGrid, sendMessage } = useSocket();
  console.log(role)
  const [gridContent, _] = React.useState(() => fiveByFive(grid, ["discovered", "color", "word"]));
  
  const [numberOfWordsToGuess, setNumberOfWordsToGuess] = useState(0);
  const [clue, setClue] = useState([]);

  const [guessPosition, setGuessPosition] = useState([]);

  const handleClick = (e, position) => {
    setGuessPosition((position) => [position, ""])
  }
  const handleHelpWordInput = (e) => {
    setClue(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(gameGrid, "team")
    setGuessPosition([])
  }
  return (
    <div className="App">
      <header className="App-header">
        <div>{role}</div>
        <div className="flex flex-col space-y-2 bg-blue-300">
          {gridContent && gridContent.map((rowContent, index) => {
          return (
            <div key={index} className=" flex flex-row space-x-2">
              {rowContent.map((cardContent, index_) => {
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
          
      </header>
    </div>
  );
}

export default App;
