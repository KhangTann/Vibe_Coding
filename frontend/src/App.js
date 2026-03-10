import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import SearchBar from './components/SearchBar';
import Statistics from './components/Statistics';
import ExportButton from './components/ExportButton';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);

  // Fetch students
  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchStats();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students/`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/classes/`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchStudents();
    } else {
      try {
        const response = await axios.get(`${API_URL}/students/search/`, {
          params: { name: query }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error searching students:', error);
      }
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      await axios.post(`${API_URL}/students/`, studentData);
      fetchStudents();
      fetchStats();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleUpdateStudent = async (studentId, studentData) => {
    try {
      await axios.put(`${API_URL}/students/${studentId}`, studentData);
      fetchStudents();
      fetchStats();
      setEditingStudent(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/students/${studentId}`);
        fetchStudents();
        fetchStats();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
      }
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Student Management System</h1>
      </header>

      <div className="container">
        <div className="top-section">
          <SearchBar onSearch={handleSearch} />
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Student
          </button>
          <ExportButton />
        </div>

        {stats && <Statistics stats={stats} />}

        {showForm && (
          <StudentForm
            classes={classes}
            onSubmit={editingStudent 
              ? (data) => handleUpdateStudent(editingStudent.student_id, data)
              : handleAddStudent
            }
            onClose={handleFormClose}
            initialData={editingStudent}
          />
        )}

        <StudentList
          students={students}
          classes={classes}
          onEdit={handleEditClick}
          onDelete={handleDeleteStudent}
        />
      </div>
    </div>
  );
}

export default App;
