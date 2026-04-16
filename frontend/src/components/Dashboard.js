import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Dashboard = () => {
  const [filters, setFilters] = useState({ base: '', date: '', assetType: '' });
  const [allPurchases, setAllPurchases] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allTransfers, setAllTransfers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({
    openingBalance: 0,
    closingBalance: 0,
    netMovement: 0,
    assigned: 0,
    expended: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [purchasesRes, assignmentsRes, transfersRes] = await Promise.all([
        api.get('/purchases'),
        api.get('/assignments'),
        api.get('/transfers'),
      ]);

      const purchases = purchasesRes.data.map(p => ({ ...p, date: new Date(p.date).toISOString().slice(0, 10), asset_type: p.asset_type || '' }));
      const assignments = assignmentsRes.data;
      const transfers = transfersRes.data;

      setAllPurchases(purchases);
      setAllAssignments(assignments);
      setAllTransfers(transfers);
      setFilteredData(purchases);
      calculateMetrics(purchases, assignments, transfers, filters);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const calculateMetrics = (purchases, assignments, transfers, currentFilters) => {
    const filteredPurchases = purchases.filter(p => {
      const baseMatch = !currentFilters.base || (p.base && p.base.toLowerCase().includes(currentFilters.base.toLowerCase())); // Assuming p.base exists
      const assetMatch = !currentFilters.assetType || (p.asset_type && p.asset_type.toLowerCase().includes(currentFilters.assetType.toLowerCase())); // Use p.asset_type
      const dateMatch = !currentFilters.date || p.date === currentFilters.date;
      return baseMatch && assetMatch && dateMatch;
    });

    const filteredAssignments = assignments.filter(a => {
      const baseMatch = !currentFilters.base || (a.base && a.base.toLowerCase().includes(currentFilters.base.toLowerCase()));
      return baseMatch;
    });

    const netMovement = filteredPurchases.reduce((sum, p) => sum + (parseInt(p.quantity, 10) || 0), 0);
    const assigned = filteredAssignments.filter(a => a.type === 'assigned').reduce((sum, a) => sum + (parseInt(a.quantity, 10) || 0), 0);
    const expended = filteredAssignments.filter(a => a.type === 'expended').reduce((sum, a) => sum + (parseInt(a.quantity, 10) || 0), 0);
    const openingBalance = 0; // This should be based on business logic, maybe from a specific API endpoint.
    const closingBalance = openingBalance + netMovement - expended;

    setMetrics({ openingBalance, closingBalance, netMovement, assigned, expended });
    setFilteredData(filteredPurchases);
  };

  const handleSearch = () => {
    calculateMetrics(allPurchases, allAssignments, allTransfers, filters);
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="card">
        <h2>Filters</h2>
        <div className="filters">
          <div className="form-group">
            <label>Base</label>
            <input
              type="text"
              placeholder="Enter base name"
              value={filters.base}
              onChange={(e) => handleFilterChange('base', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Equipment Type</label>
            <input
              type="text"
              placeholder="e.g., weapon, vehicle"
              value={filters.assetType}
              onChange={(e) => handleFilterChange('assetType', e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.openingBalance}</div>
          <div className="metric-label">Opening Balance</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.closingBalance}</div>
          <div className="metric-label">Closing Balance</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.netMovement}</div>
          <div className="metric-label">Net Movement</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.assigned}</div>
          <div className="metric-label">Assigned</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.expended}</div>
          <div className="metric-label">Expended</div>
        </div>
      </div>

      <div className="card">
        <h2>Net Movement Details</h2>
        {loading ? <p>Loading...</p> : filteredData.length === 0 ? (
          <p>No records found</p>
        ) : (
          <div>
            <h3>Purchases ({filteredData.length} records)</h3>
            <ul>
              {filteredData.map((p, idx) => (
                <li key={idx}>
                  {p.quantity} of {p.asset_type || 'Unknown'} (Asset: {p.asset_id}) at {p.base} on {new Date(p.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;