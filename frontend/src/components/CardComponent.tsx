import React from 'react';

interface Card {
  id: number;
  title: string;
  content: string;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div>
      <h3 className="text-lg font-bold">{card.title}</h3>
      <p>{card.content}</p>
    </div>
  );
};

export default CardComponent;
