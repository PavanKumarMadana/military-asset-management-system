import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Assignments = () => {
  const [formData, setFormData] = useState({ assetId: '', personnel: '', quantity: '', base: '', type: 'assigned' });
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.assetId || !formData.personnel || !formData.quantity || !formData.base || !formData.type) {
      setError('All fields are required');
      return false;
    }
    if (parseInt(formData.quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;

    try {
      await api.post('/assignments', formData);
      setSuccess('Assignment recorded successfully');
      setFormData({ assetId: '', personnel: '', quantity: '', base: '', type: 'assigned' });
      fetchAssignments();
    } catch (err) {
      setError('Failed to record assignment');
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div>
      <h1>Assignments & Expenditures</h1>
      
      <div className="card">
        <h2>Record New Assignment/Expenditure</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asset ID</label>
            <input
              type="text"
              name="assetId"
              value={formData.assetId}
              onChange={handleInputChange}
              placeholder="Enter asset ID"
            />
          </div>
          <div className="form-group">
            <label>Personnel</label>
            <input
              type="text"
              name="personnel"
              value={formData.personnel}
              onChange={handleInputChange}
              placeholder="Enter personnel name"
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Base</label>
            <input
              type="text"
              name="base"
              value={formData.base}
              onChange={handleInputChange}
              placeholder="Enter base name"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="assigned">Assigned</option>
              <option value="expended">Expended</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <div className="card">
        <h2>Assignment/Expenditure History</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Personnel</th>
              <th>Quantity</th>
              <th>Base</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {assignments.slice().reverse().map((assignment, idx) => (
              <tr key={idx} style={{ backgroundColor: assignment.type === 'expended' ? '#FEF2F2' : '#F0FDF4' }}>
                <td>{assignment.asset_id}</td>
                <td>{assignment.personnel}</td>
                <td>{assignment.quantity}</td>
                <td>{assignment.base}</td>
                <td style={{ color: assignment.type === 'expended' ? '#DC2626' : '#16A34A', fontWeight: 'bold' }}>
                  {assignment.type}
                </td>
                <td>{new Date(assignment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
