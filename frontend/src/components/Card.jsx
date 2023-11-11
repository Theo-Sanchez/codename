import React from 'react';

const Card = (props) => {
    const {discovered, color, position, word} = props
    return (
        <>
        {discovered && <img 
          src={`${color}_card.png`}
          alt="" 
        />}
        <div className="relative rounded text-gray-700 bold">
          {word}
        </div>
        </>
    );
}

export default Card;
