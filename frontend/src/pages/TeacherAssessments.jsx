import React, { useEffect, useState } from "react";
import { UserIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { getTeacherAssessments, assignAssessment, updateAssessment } from "../services/assessmentService";
import useTranslation from "../hooks/useTranslation";
import NetworkError from "../components/NetworkError";
import { getAllStudents, getAllDrills } from "../services/userService";

const TeacherAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [drills, setDrills] = useState([]);
  const [form, setForm] = useState({ studentId: "", drillId: "", score: "", feedback: "", assignToAll: false });
  const [assignLoading, setAssignLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ score: "", feedback: "", status: "" });
  const { t } = useTranslation();

  useEffect(() => {
    getTeacherAssessments()
      .then(res => {
        setAssessments(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
    getAllStudents().then(res => setStudents(res.data)).catch(()=>{});
    getAllDrills().then(res => setDrills(res.data)).catch(()=>{});
  }, []);

  if (loading) return <p>{t("loading")}</p>;
  if (error?.isNetworkError || error?.isServerError) return <NetworkError message={error.message} />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
        <UserIcon className="h-8 w-8 text-blue-700" /> Teacher Assessments
      </h1>
      <form
        className="mb-8 p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 shadow-lg"
        onSubmit={async e => {
          e.preventDefault();
          setAssignLoading(true);
          try {
            await assignAssessment(
              form.studentId,
              form.drillId,
              form.score,
              form.feedback,
              form.assignToAll
            );
            setForm({ studentId: "", drillId: "", score: "", feedback: "", assignToAll: false });
            const res = await getTeacherAssessments();
            setAssessments(res.data);
          } catch (err) {
            setError(err);
          }
          setAssignLoading(false);
        }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-6 w-6 text-teal-700" /> Assign New Assessment
        </h2>
  <div className="flex flex-wrap gap-4 mb-4 items-center">
          <select
            className="border rounded px-2 py-1"
            value={form.studentId}
            onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
            disabled={form.assignToAll}
            required={!form.assignToAll}
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={form.assignToAll}
              onChange={e => setForm(f => ({ ...f, assignToAll: e.target.checked, studentId: "" }))}
            />
            <span className="text-sm">Assign to All Students</span>
          </label>
          <select
            className="border rounded px-2 py-1"
            value={form.drillId}
            onChange={e => setForm(f => ({ ...f, drillId: e.target.value }))}
            required
          >
            <option value="">Select Drill</option>
            {drills.map(d => (
              <option key={d._id} value={d._id}>{d.title}</option>
            ))}
          </select>
          <input
            type="number"
            className="border rounded px-2 py-1 w-20"
            placeholder="Score"
            value={form.score}
            onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
            min={0}
          />
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Feedback"
            value={form.feedback}
            onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={assignLoading}>
            Assign
          </button>
        </div>
      </form>
      <table className="w-full border rounded-xl overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Drill</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Feedback</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map(a => (
            <tr key={a._id}>
              <td className="p-2 border">{a.student?.name}</td>
              <td className="p-2 border">{a.drill?.title || a.drill?.disasterType || a.drill?._id || <span className="text-red-600">Drill not found</span>}</td>
              <td className="p-2 border">{editId === a._id ? (
                <input type="number" value={editForm.score} onChange={e => setEditForm(f => ({ ...f, score: e.target.value }))} className="border rounded px-2 py-1 w-16" />
              ) : a.score}</td>
              <td className="p-2 border">{editId === a._id ? (
                <input type="text" value={editForm.feedback} onChange={e => setEditForm(f => ({ ...f, feedback: e.target.value }))} className="border rounded px-2 py-1" />
              ) : a.feedback}</td>
              <td className="p-2 border">
                {editId === a._id ? (
                  <select 
                    value={editForm.status} 
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} 
                    className="border rounded px-2 py-1"
                  >
                    <option value="incomplete">Incomplete</option>
                    <option value="working">Working On</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    a.status === 'completed' ? 'bg-green-100 text-green-800' :
                    a.status === 'working' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {a.status === 'completed' ? 'Completed' :
                     a.status === 'working' ? 'Working On' :
                     'Incomplete'}
                  </span>
                )}
              </td>
              <td className="p-2 border">
                {editId === a._id ? (
                  <>
                    <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={async () => {
                      await updateAssessment(a._id, editForm.score, editForm.feedback, editForm.status);
                      setEditId(null);
                      setEditForm({ score: "", feedback: "", status: "" });
                      const res = await getTeacherAssessments();
                      setAssessments(res.data);
                    }}>Save</button>
                    <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => {
                    setEditId(a._id);
                    setEditForm({ score: a.score, feedback: a.feedback, status: a.status || 'incomplete' });
                  }}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAssessments;
