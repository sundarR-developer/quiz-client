import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";

export function attempts_Number(result) {
  return result.filter((r) => r !== undefined).length;
}

export function earnPoints_Number(result, answers, point) {
  return result
    .map((element, i) => answers[i] === element)
    .filter((i) => i === true)
    .map((i) => point)
    .reduce((prev, curr) => prev + curr, 0);
}

export function flagResult(totalPoints, earnPoints) {
  // returns true or false
  return Math.round(earnPoints / totalPoints) >= 0.5;
}

/* check user authorisation */
export function CheckUserExist({ children }) {
  const auth = useSelector((state) => state.result.userId);
  return auth ? children : <Navigate to={"/"} replace={true}></Navigate>;
}

/* get server data */
export async function getServerData(url, callback) {
  const data = await (await axios.get(url))?.data;
  return callback ? callback(data) : data;
}

/* post server data */
export async function postServerData(url, result, callback) {
  const data = await (await axios.post(url, result))?.data;
  return callback ? callback(data) : data;
}

/** put server data */
export async function putServerData(url, result, callback) {
  const data = await (await axios.put(url, result))?.data;
  return callback ? callback(data) : data;
}

/** delete server data */
export async function deleteServerData(url, callback) {
  const data = await (await axios.delete(url))?.data;
  return callback ? callback(data) : data;
}

export async function getServerDataWithAuth(url) {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.get(url, config);
}
