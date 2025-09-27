import React from "react";

const QuestionOverlay = ({ question, onAnswer }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
      <h3 className="font-semibold">{question.questionText}</h3>
      <div className="mt-2 space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className="block w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionOverlay;
