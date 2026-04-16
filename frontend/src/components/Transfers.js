import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Transfers = () => {
  const [formData, setFormData] = useState({ assetId: '', quantity: '', fromBase: '', toBase: '' });
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.assetId || !formData.quantity || !formData.fromBase || !formData.toBase) {
      setError('All fields are required');
      return false;
    }
    if (parseInt(formData.quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    if (formData.fromBase === formData.toBase) {
      setError('From Base and To Base must be different');
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
      await api.post('/transfers', formData);
      setSuccess('Transfer recorded successfully');
      setFormData({ assetId: '', quantity: '', fromBase: '', toBase: '' });
      fetchTransfers();
    } catch (err) {
      setError('Failed to record transfer');
      console.error(err);
    }
  };

  const fetchTransfers = async () => {
    try {
      const res = await api.get('/transfers');
      setTransfers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return (
    <div>
      <h1>Transfers</h1>
      
      <div className="card">
        <h2>Record New Transfer</h2>
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
            <label>From Base</label>
            <input
              type="text"
              name="fromBase"
              value={formData.fromBase}
              onChange={handleInputChange}
              placeholder="Enter from base"
            />
          </div>
          <div className="form-group">
            <label>To Base</label>
            <input
              type="text"
              name="toBase"
              value={formData.toBase}
              onChange={handleInputChange}
              placeholder="Enter to base"
            />
          </div>
          <button type="submit" className="btn btn-primary">Transfer</button>
        </form>
      </div>

      <div className="card">
        <h2>Transfer History</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Quantity</th>
              <th>From Base</th>
              <th>To Base</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.slice().reverse().map((transfer, idx) => (
              <tr key={idx}>
                <td>{transfer.asset_id}</td>
                <td>{transfer.quantity}</td>
                <td>{transfer.fromBase}</td>
                <td>{transfer.toBase}</td>
                <td>{new Date(transfer.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transfers;
