import React from 'react';

function StudentList({ students, classes, onEdit, onDelete }) {
  const getClassName = (classId) => {
    const classObj = classes.find(c => c.class_id === classId);
    return classObj ? classObj.class_name : 'N/A';
  };

  return (
    <div className="student-list">
      {students.length > 0 ? (
        <table className="student-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>GPA</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.name}</td>
                <td>{student.major}</td>
                <td>{student.gpa.toFixed(2)}</td>
                <td>{getClassName(student.class_id)}</td>
                <td>
                  <button
                    className="btn btn-success action-btn"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger action-btn"
                    onClick={() => onDelete(student.student_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-message">
          <p>No students found</p>
        </div>
      )}
    </div>
  );
}

export default StudentList;
