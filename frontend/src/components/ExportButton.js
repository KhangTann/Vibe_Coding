import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function ExportButton() {
  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`);
      const csvContent = response.data.content;

      // Create a blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'students.csv');
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting students:', error);
      alert('Error exporting students');
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleExport}>
      Export to CSV
    </button>
  );
}

export default ExportButton;
