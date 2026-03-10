import React from 'react';

function Statistics({ stats }) {
  return (
    <div className="statistics">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="value">{stats.total_students}</div>
        </div>
        <div className="stat-card">
          <h3>Average GPA</h3>
          <div className="value">{stats.average_gpa.toFixed(2)}</div>
        </div>
      </div>

      {Object.keys(stats.students_by_major).length > 0 && (
        <div className="major-stats">
          <h3>Students by Major</h3>
          {Object.entries(stats.students_by_major).map(([major, count]) => (
            <div key={major} className="major-item">
              <span>{major}</span>
              <strong>{count} students</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Statistics;
