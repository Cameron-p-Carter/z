import React from 'react';

interface Card {
  id: number;
  title: string;
  content: string;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300 ease-in-out">
      <div className="mb-2">
        <div className="text-xs text-gray-600 italic">Note ID: {card.id}</div>
        <h3 className="text-xl font-serif font-bold text-gray-900">{card.title}</h3>
      </div>
      <p className="text-base font-serif text-gray-800 leading-relaxed">{card.content}</p>

      <div className="mt-4 text-right">
        <span className="text-xs text-gray-500 italic">Created on: 12th August, 1890</span>
      </div>
    </div>
  );
};

export default CardComponent;
