import React, { useState, useEffect } from 'react';
import './Customerlist.css';

function CustomerList() {
  const [lostCustomers, setLostCustomers] = useState([]);
  const [activeCustomers, setActiveCustomers] = useState([]);
  const [error, setError] = useState(null);

  const [lostStartDate, setLostStartDate] = useState('');
  const [lostEndDate, setLostEndDate] = useState('');
  const [activeStartDate, setActiveStartDate] = useState('');
  const [activeEndDate, setActiveEndDate] = useState('');

  const [currentLostPage, setCurrentLostPage] = useState(1);
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const rowsPerPage = 20;

  // 🔥 Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleFetch = () => {
    if (!lostStartDate || !lostEndDate || !activeStartDate || !activeEndDate) {
      setError('Please select all dates!');
      return;
    }
    setError(null);

    fetch('http://localhost:5000/filter-customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lost_start: lostStartDate,
        lost_end: lostEndDate,
        active_start: activeStartDate,
        active_end: activeEndDate
      })
    })
      .then(res => res.json())
      .then(data => {
        setLostCustomers(data.lost_customers || []);
        setActiveCustomers(data.active_customers || []);
        setCurrentLostPage(1);
        setCurrentActivePage(1);
      })
      .catch(err => setError('Failed to fetch data: ' + err.message));
  };

  const paginate = (data, page) => {
    const indexOfLastRow = page * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return data.slice(indexOfFirstRow, indexOfLastRow);
  };

  const totalLostPages = Math.ceil(lostCustomers.length / rowsPerPage);
  const totalActivePages = Math.ceil(activeCustomers.length / rowsPerPage);

  const renderPageNumbers = (totalPages, currentPage, setCurrentPage) => {
    const pageNumbers = [];
    const range = 3;
    let startPage = Math.max(currentPage - range, 1);
    let endPage = Math.min(currentPage + range, totalPages);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return (
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        {pageNumbers.map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ) : (
            <span key={index}>{page}</span>
          )
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    );
  };

  const handleDownloadCSV = (type) => {
    const convertToCSV = (arr) => {
      if (arr.length === 0) return '';
      const headers = Object.keys(arr[0]);
      const csvRows = [
        headers.join(','), 
        ...arr.map(row => headers.map(field => `"${row[field] ?? ''}"`).join(','))
      ];
      return csvRows.join('\n');
    };
  
    let csv = '';
    let filename = '';
  
    if (type === 'lost') {
      csv = convertToCSV(lostCustomers);
      filename = `inactive_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (type === 'active') {
      csv = convertToCSV(activeCustomers);
      filename = `active_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    }
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  return (
    <div>
      {/* 🔥 Theme Switch Button (Top-Left) */}
      <div className="theme-switch-btn" onClick={() => setDarkMode(!darkMode)}>
        <img 
          src={darkMode ? '/dark-icon.png' : '/light-icon.png'}
          class="icon" 
          alt="Theme Icon" 
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1>Customer Status Dashboard</h1>

        <div style={{ marginBottom: '20px' }}>
          <div>
            <label>Inactive Customers Start Date: </label>
            <input type="date" value={lostStartDate} onChange={(e) => setLostStartDate(e.target.value)} />
            <label> Inactive Customers End Date: </label>
            <input type="date" value={lostEndDate} onChange={(e) => setLostEndDate(e.target.value)} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Active Customers Start Date: </label>
            <input type="date" value={activeStartDate} onChange={(e) => setActiveStartDate(e.target.value)} />
            <label> Active Customers End Date: </label>
            <input type="date" value={activeEndDate} onChange={(e) => setActiveEndDate(e.target.value)} />
          </div>
          <button onClick={handleFetch} style={{ marginTop: '10px' }} className='fetch-button'>Fetch</button>
          <button 
  onClick={() => handleDownloadCSV('lost')} 
  style={{ marginTop: '10px', marginLeft: '10px' }} 
  className='fetch-button'
  disabled={lostCustomers.length === 0}
>
  Download Inactive CSV
</button>

<button 
  onClick={() => handleDownloadCSV('active')} 
  style={{ marginTop: '10px', marginLeft: '10px' }} 
  className='fetch-button'
  disabled={activeCustomers.length === 0}
>
  Download Active CSV
</button>

        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <h2>Inactive Customers</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Mobile Number</th>
                <th>Invoice Number</th>
                <th>Date of Purchase</th>
              </tr>
            </thead>
            <tbody>
              {lostCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4">No inactive customers found in selected date range.</td>
                </tr>
              ) : (
                paginate(lostCustomers, currentLostPage).map((cust, index) => (
                  <tr key={index}>
                    <td>{cust['branch'] || ''}</td>
                    <td>{cust['mobile no.'] || ''}</td>
                    <td>{cust['invoice no.'] || ''}</td>
                    <td>{cust['date'] || ''}</td> 
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {lostCustomers.length > 0 && totalLostPages > 1 && renderPageNumbers(totalLostPages, currentLostPage, setCurrentLostPage)}

        <h2>Active Customers</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Mobile Number</th>
                <th>Invoice Number</th>
                <th>Date of Purchase</th>
              </tr>
            </thead>
            <tbody>
              {activeCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4">No active customers found in selected date range.</td>
                </tr>
              ) : (
                paginate(activeCustomers, currentActivePage).map((cust, index) => (
                  <tr key={index}>
                    <td>{cust['branch'] || ''}</td>
                    <td>{cust['mobile no.'] || ''}</td>
                    <td>{cust['invoice no.'] || ''}</td>
                    <td>{cust['date'] || ''}</td> 
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {activeCustomers.length > 0 && totalActivePages > 1 && renderPageNumbers(totalActivePages, currentActivePage, setCurrentActivePage)}
      </div>
    </div>
  );
}

export default CustomerList;
