import React from 'react';

const GameInfo = ({gameGrid, turn}) => {
    console.log(gameGrid)
    const [leftCases, setLeftCases] = React.useState({
      "blue": "",
      "red": "",
    });
    React.useEffect(() => {
      setLeftCases({
        "blue": gameGrid.filter((gameCase) => gameCase.color === "blue" && !gameCase.discovered).length,
        "red": gameGrid.filter((gameCase) => gameCase.color === "red" && !gameCase.discovered).length
      })
    }, [gameGrid])
    
    return (
      <div className="py-4 ml-4 border-2 rounded bg-gray-500 w-[20vw] flex flex-col space-y-4 mx-auto">
        <img
          src={`${window.location.origin}/${turn}_card_1.png`}
          alt="card indicating whos to play"
           className="mx-auto"
        />
        <div className="mx-auto">{turn} team is guessing </div>
      <div className="max-h-[10vh] flex flex-col ">
        <div className="mx-auto text-blue-700 font-bold">Blue: {leftCases.blue}</div>
        <div className="mx-auto text-red-700 font-bold">Red: {leftCases.red}</div>
      </div>
      </div>
      
    );
}

export default GameInfo;
