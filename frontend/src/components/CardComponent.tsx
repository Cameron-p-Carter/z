import React from 'react';

interface Card {
  id: number;
  title: string;
  content: string;
}

const CardComponent: React.FC<{ 
  card: Card; 
  onClick: () => void; 
  onDelete: () => void; 
  onUpdate: () => void; 
  selected: boolean;
}> = ({ card, onClick, onDelete, onUpdate, selected }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer ${
        selected ? 'bg-gray-300' : 'bg-white'
      } hover:bg-gray-100 transition-all`}
    >
      <h3 className="text-lg font-serif font-bold text-gray-900 truncate">{card.title}</h3>
      <p className="text-sm text-gray-700 truncate">{card.content}</p>
      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); //prevents triggering onClick for selection
            onUpdate();
          }}
          className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500 transition-all"
        >
          ✎ {/* edit icon */}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
        >
          ✖ {/* delete icon */}
        </button>
      </div>
    </div>
  );
};

export default CardComponent;
