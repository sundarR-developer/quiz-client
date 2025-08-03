import { useEffect, useState } from "react";
import { getServerData } from "../helper/helper";

const ResultTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getServerData(
      `https://quiz-server-9.onrender.com/api/result`,
      (res) => {
        setData(res);
      }
    );
  });

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded shadow-md p-8 mt-8 text-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-center">Results Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white text-gray-900">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Attempts</th>
              <th className="py-3 px-4">Earn Points</th>
              <th className="py-3 px-4">Result</th>
            </tr>
          </thead>
          <tbody>
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No data found</td>
              </tr>
            )}
            {data && data.map((val, i) => (
              <tr className="border-b hover:bg-blue-50 transition" key={i}>
                <td className="py-3 px-4">{val?.username || ""}</td>
                <td className="py-3 px-4">{val?.attempts || 0}</td>
                <td className="py-3 px-4">{val?.points || 0}</td>
                <td className="py-3 px-4">{val?.achieved || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;
