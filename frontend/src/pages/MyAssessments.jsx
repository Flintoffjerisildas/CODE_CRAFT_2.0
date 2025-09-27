import React, { useEffect, useState } from "react";
import { UserIcon } from '@heroicons/react/24/outline';
import { getStudentAssessments } from "../services/assessmentService";
import useTranslation from "../hooks/useTranslation";
import NetworkError from "../components/NetworkError";
import { Link } from "react-router-dom";

const MyAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getStudentAssessments()
      .then(res => {
        setAssessments(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>{t("loading")}</p>;
  if (error?.isNetworkError || error?.isServerError) return <NetworkError message={error.message} />;


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
        <UserIcon className="h-8 w-8 text-blue-700" /> My Assessments
      </h1>
      {assessments.length === 0 ? (
        <p className="text-lg text-gray-500">No assessments assigned by your teacher yet.</p>
      ) : (
        <table className="w-full border rounded-xl overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Teacher</th>
              <th className="p-2 border">Drill</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Feedback</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Assigned</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a._id}>
                <td className="p-2 border">{a.teacher?.name}</td>
                <td className="p-2 border">{a.drill?.title || a.drill?.disasterType || a.drill?._id || <span className="text-red-600">Drill not found</span>}</td>
                <td className="p-2 border">{a.score}</td>
                <td className="p-2 border">{a.feedback}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    a.status === 'completed' ? 'bg-green-100 text-green-800' :
                    a.status === 'working' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {a.status === 'completed' ? 'Completed' :
                     a.status === 'working' ? 'Working On' :
                     'Incomplete'}
                  </span>
                </td>
                <td className="p-2 border">{a.assignedAt ? new Date(a.assignedAt).toLocaleDateString() : "-"}</td>
                <td className="p-2 border">
                  {a.drill?._id ? (
                    <Link
                      to={`/drill/${a.drill.disasterType || a.drill._id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      state={{ assessmentId: a._id }}
                    >
                      Start Drill
                    </Link>
                  ) : (
                    <span className="text-gray-400">Unavailable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAssessments;
