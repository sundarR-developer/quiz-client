import { postServerData } from "../helper/helper";
import * as Action from "../redux/result_reducer";

export const PushAnswer = (result) => async (dispatch) => {
  try {
    await dispatch(Action.pushResultAction(result));
  } catch (error) {
    console.log(error);
  }
};

export const updateResult = (index) => async (dispatch) => {
  try {
    dispatch(Action.updateResultAction(index));
  } catch (error) {
    console.log(error);
  }
};

/* insert user data */
export const usePublishResult = (resultData) => {
  const { result, username } = resultData;
  // postServerData
  (async () => {
    try {
      if (result.length === 0 || !username) {
        throw new Error("Couldn't get result!");
      }
      await postServerData(
        `https://quiz-server-9.onrender.com/api/result`,
        resultData,
        (data) => data
      );
    } catch (error) {
      console.log(error);
    }
  })();
};

