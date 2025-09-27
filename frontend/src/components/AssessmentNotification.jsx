import React, { useEffect, useState } from "react";
import { getStudentAssessments } from "../services/assessmentService";
import { BellIcon } from "@heroicons/react/24/solid";

export default function AssessmentNotification() {
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    // Fetch assessments and count those without completedAt
    getStudentAssessments()
      .then(res => {
        const newAssessments = res.data.filter(a => !a.completedAt);
        setNewCount(newAssessments.length);
      })
      .catch(() => setNewCount(0));
  }, []);

  if (newCount === 0) return null;
  return (
    <div className="relative">
      <BellIcon className="h-6 w-6 text-yellow-500" />
      <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
        {newCount}
      </span>
    </div>
  );
}
