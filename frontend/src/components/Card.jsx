import React from 'react';

const Card = (props) => {
    const {discovered, color, position, word} = props
    return (
        <>
        {discovered && <img 
          src={`${color}_card.png`}
          alt="" 
        />}
        <div className={`box-border cursor-pointer m-2 w-[12vw] h-[15vh] flex flex-col relative bg-orange-200 rounded text-gray-700 bold border-2 
        ${color == 'red'? "border-red-700"
        : color == 'blue'? "border-blue-700"
        : color == 'white'? "border-gray-300"
        : "border-black"}`}>
          <div className="mt-[calc(15vh-36px-1rem)] h-30px bg-slate-300 justify-self-end">{word}</div>
        </div>
        </>
    );
}

export default Card;
