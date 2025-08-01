import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateResult } from "../hooks/setResult.js";

const Questions = ({ onChecked }) => {
  const [checked, setChecked] = useState(undefined);
  const { trace, queue } = useSelector((state) => state.questions);
  const result = useSelector((state) => state.result.result);

  const question = queue[trace];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateResult({ trace, checked }));
  }, [checked, dispatch, trace]);

  const onSelect = (i) => {
    onChecked(i);
    setChecked(i);
  };

  if (!question) {
    return <h3 className="text-gray-900 text-lg font-semibold">No question found.</h3>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">{question?.question}</h2>
      <ul key={question?.id} className="flex flex-col gap-3">
        {question?.options.map((q, i) => (
          <li key={i} className="flex items-center gap-3 p-3 bg-gray-100 rounded">
            <input
              type="radio"
              value={false}
              name="options"
              id={`q${i}-option`}
              onChange={() => onSelect(i)}
              checked={result[trace] === i}
              className="mr-2 accent-blue-600"
            />
            <label htmlFor={`q${i}-option`} className="text-gray-900 cursor-pointer">
              {q}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;

