import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const CurrentBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);

  // user-edited filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  // filters that are applied to fetch
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchCurrentBorrows = async () => {
      setLoading(true);
      try {
        const params = {};
        if (appliedFilters.startDate) params.startDate = appliedFilters.startDate;
        if (appliedFilters.endDate)   params.endDate   = appliedFilters.endDate;

        const response = await dashboardAPI.getCurrentBorrows(params);
        setBorrows(response.data.data || []);
      } catch (err) {
        console.error('Error fetching current borrows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentBorrows();
  }, [appliedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const empty = { startDate: '', endDate: '' };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'returned') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="loading">Loading current borrows...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setAppliedFilters(filters)}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="filter-controls">
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </label>

        <label style={{ marginLeft: '1rem' }}>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </label>

        <button onClick={applyFilters} style={{ marginLeft: '1rem' }}>
          Apply Filters
        </button>
        <button onClick={clearFilters} style={{ marginLeft: '0.5rem' }}>
          Clear Filters
        </button>
      </div>

      {borrows.length === 0 ? (
        <div className="empty-state">
          <p>No active borrows found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((loan) => {
                const overdue = isOverdue(loan.dueDate, loan.status);
                return (
                  <tr key={loan._id} style={overdue ? { backgroundColor: '#fff3cd' } : {}}>
                    <td><strong>{loan.itemId?.title || 'Unknown'}</strong></td>
                    <td>{loan.itemId?.author || '-'}</td>
                    <td>
                      {loan.borrowerMemberId?.name || 'Unknown'}
                      {loan.borrowerMemberId?.email && (
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {loan.borrowerMemberId.email}
                        </div>
                      )}
                    </td>
                    <td>{formatDate(loan.borrowDate)}</td>
                    <td style={overdue ? { color: '#e74c3c', fontWeight: 600 } : {}}>
                      {formatDate(loan.dueDate)}
                    </td>
                    <td>
                      <span className={`badge badge-${overdue ? 'overdue' : loan.status}`}>
                        {overdue ? 'Overdue' : loan.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrentBorrows;

