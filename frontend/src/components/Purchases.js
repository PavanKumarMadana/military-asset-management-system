import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Purchases = () => {
  const [formData, setFormData] = useState({ assetId: '', quantity: '', base: '', selectedAssetType: '' });
  const [purchases, setPurchases] = useState([]);
  const [assets, setAssets] = useState([]); // State to store available assets
  const [selectedAsset, setSelectedAsset] = useState(null); // State to store the currently selected asset object
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPurchases = async () => {
    try {
      const res = await api.get('/purchases');
      setPurchases(res.data);
    } catch (err) {
      console.error('Failed to fetch purchases', err);
      setError('Failed to load purchase history.');
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error('Failed to fetch assets', err);
      // Optionally set an error message for the user
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchAssets(); // Fetch assets when the component mounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assetId') {
      const asset = assets.find(a => a.id === parseInt(value));
      setSelectedAsset(asset);
      setFormData({ ...formData, [name]: value, selectedAssetType: asset ? asset.type : '' });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.assetId || !formData.quantity || !formData.base) {
      setError('All fields are required');
      return false;
    }
    if (parseInt(formData.quantity, 10) <= 0) {
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
      await api.post('/purchases', formData);
      setSuccess('Purchase recorded successfully');
      setFormData({ assetId: '', quantity: '', base: '' }); // Clear form fields, no need to clear selectedAssetType from formData
      setSelectedAsset(null); // Clear selected asset
      fetchPurchases(); // Refetch purchases to show the new record
    } catch (err) {
      setError('Failed to record purchase');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Purchases</h1>
      <div className="card">
        <h2>Record New Purchase</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asset ID</label>
            <select
              name="assetId"
              value={formData.assetId}
              onChange={handleInputChange}
              className="form-control" // Assuming you have some CSS for form-control
            >
              <option value="">Select Asset ID</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.id} - {asset.name}
                </option>
              ))}
            </select>
          </div>
          {selectedAsset && <div className="form-group">
            <label>Equipment Type: {selectedAsset.type}</label>
          </div>}
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
          <button type="submit" className="btn btn-primary">Record Purchase</button>
        </form>
      </div>

      <div className="card">
        <h2>Purchase History</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Equipment Type</th>
              <th>Quantity</th>
              <th>Base</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.slice().reverse().map((purchase, idx) => (
              <tr key={idx}>
                <td>{purchase.asset_id}</td>
                <td>{purchase.asset_type}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.base}</td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;