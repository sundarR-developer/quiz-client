import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getServerData } from "../helper/helper";

/* redux actions */
import * as Action from "../redux/question_reducer";
import { createResultAction } from "../redux/result_reducer";

/* fetch question hook to fetch API data and set value to store */
export const useFetchQuestion = (examId) => {
  const dispatch = useDispatch();

  const [getData, setGetData] = useState({
    isLoading: false,
    apiData: [],
    serverError: null,
  });

  useEffect(() => {
    setGetData((prev) => ({ ...prev, isLoading: true }));

    /* async function fetch backend data */
    (async () => {
      try {
        if (!examId) throw new Error("No Exam ID provided");
        
        const exam = await getServerData(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/api/exams/${examId}`,
          (data) => data
        );
        
        const questions = exam.questions;
        // The answers should also come from the questions
        const answers = questions.map(q => q.answer);

        if (questions.length > 0) {
          setGetData((prev) => ({ ...prev, isLoading: false }));
          setGetData((prev) => ({ ...prev, apiData: { questions, answers } }));

          /* dispatch an action and update store */
          dispatch(Action.startExamAction({ question: questions, answers }));
          /** create a new result array */
          dispatch(createResultAction(new Array(questions.length).fill(undefined)));

        } else {
          throw new Error("No questions available for this exam.");
        }
      } catch (error) {
        setGetData((prev) => ({ ...prev, isLoading: false }));
        setGetData((prev) => ({ ...prev, serverError: error }));
      }
    })();
  }, [dispatch, examId]);

  return [getData, setGetData];
};

/* move action dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
  try {
    dispatch(Action.moveNextAction());
  } catch (error) {
    console.log(error);
  }
};

export const MovePrevQuestion = () => async (dispatch) => {
  try {
    dispatch(Action.movePrevAction());
  } catch (error) {
    console.log(error);
  }
};
