import React from 'react';

const Card = (props) => {
    const {turn, discovered, color, position, word, teamColor, guessPositions, setGuessPositions, nbOfGuess} = props;

    const [imgSource, setImgSource] = React.useState("")
    React.useEffect(() => {
      setImgSource(() => {
        let tmp;
        ['red', 'blue'].includes(color) ? tmp = `${window.location.origin}/${color}_card_${Math.floor((Math.random()* 3) + 1)}.png`
        : `${color.includes("black")}` ? tmp = `${window.location.origin}/black_card.png`
        : tmp = `${window.location.origin}/white_card.png`
        return tmp;
      })
    }, [color, teamColor]);

    const handleClick = (e, position) => {
      // if position already set, remove
      e.preventDefault();
      if (turn !== teamColor || discovered) return;
      let newPosition = [...guessPositions];
      if (guessPositions.includes(position)) {
        newPosition = newPosition.filter((oldPosition) => oldPosition !== position);
      } else {
        if (guessPositions.length === nbOfGuess) return;
        newPosition.push(position);
      }
      setGuessPositions(newPosition);
    };

    return (
        <div onClick={(e) => handleClick(e, position)} className={``}>
          <img 
            src={imgSource}
            className={` z-20 relative top-[calc(12vh+0.5rem)] w-[calc(10vw+1rem)] h-[12vh] ${!discovered ? "opacity-0" : ""}
            ${turn === teamColor && !discovered? "cursor-pointer" : ""}`}
            alt="" 
          />
          <div className={`box-border cursor-pointer m-2 w-[10vw] h-[12vh] flex flex-col relative bg-orange-200 rounded text-gray-700 bold border-4
          ${turn !== teamColor && discovered && "cursor-pointer"}
          ${guessPositions && guessPositions.includes(position) ? "border-lime-700" : 
            color === 'red' && "red" === teamColor? "border-red-700"
            : color === 'blue' && "blue" === teamColor? "border-blue-700"
            : color === `black_${teamColor}`? "border-black"
            : "border-gray-300"}`}
          >
            <div className="text-center italic font-semi-bold mt-[calc(15vh-36px-1rem)] h-30px bg-slate-300 justify-self-end">{word.toUpperCase()}</div>
          </div>
        </div>
    );
}

export default Card;
