import React, { useState, useEffect } from 'react';

function StudentForm({ classes, onSubmit, onClose, initialData }) {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    birth_year: new Date().getFullYear() - 20,
    major: '',
    gpa: '',
    class_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'student_id' || name === 'birth_year' || name === 'class_id'
        ? parseInt(value)
        : name === 'gpa'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.student_id || !formData.name || !formData.major || !formData.gpa || !formData.class_id) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.gpa < 0 || formData.gpa > 4) {
      alert('GPA must be between 0 and 4');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{initialData ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="number"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              disabled={!!initialData}
              required
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Birth Year</label>
            <input
              type="number"
              name="birth_year"
              value={formData.birth_year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Major</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>GPA</label>
            <input
              type="number"
              name="gpa"
              step="0.01"
              min="0"
              max="4"
              value={formData.gpa}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Class</label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a class</option>
              {classes.map(cls => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
