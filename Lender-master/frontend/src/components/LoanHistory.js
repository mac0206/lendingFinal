import React, { useState, useEffect } from 'react';
import { loanHistoryAPI } from '../services/api';

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters state — user is editing here
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  // committedFilters = the filters actually used in the last fetch
  const [committedFilters, setCommittedFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    // fetch when committedFilters changes
    const fetchLoanHistory = async () => {
      setLoading(true);
      try {
        const params = {};
        if (committedFilters.startDate)
          params.startDate = committedFilters.startDate;
        if (committedFilters.endDate)
          params.endDate = committedFilters.endDate;
        if (committedFilters.status)
          params.status = committedFilters.status;

        const response = await loanHistoryAPI.getHistory(params);
        setLoans(response.data.data || []);
      } catch (err) {
        console.error('Error fetching loan history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, [committedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setCommittedFilters(filters);
  };

  const clearFilters = () => {
    const empty = { startDate: '', endDate: '', status: '' };
    setFilters(empty);
    setCommittedFilters(empty);
  };

  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading loan history...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={() => setCommittedFilters(filters)}>
          🔄 Refresh
        </button>
      </div>

      <div className="filter-controls" style={{ marginBottom: '1rem' }}>
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

        <label style={{ marginLeft: '1rem' }}>
          Status:
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>

        <button onClick={applyFilters} style={{ marginLeft: '1rem' }}>
          Apply Filters
        </button>
        <button onClick={clearFilters} style={{ marginLeft: '0.5rem' }}>
          Clear Filters
        </button>
      </div>

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>No loan history found.</p>
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
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
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
                  <td>{formatDate(loan.dueDate)}</td>
                  <td>{formatDate(loan.returnDate)}</td>
                  <td>
                    <span className={`badge badge-${loan.status}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanHistory;
