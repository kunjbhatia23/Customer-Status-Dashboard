# Customer Status Dashboard

A responsive React-based dashboard to filter and view **Inactive** and **Active** customers based on date ranges using a Flask backend and CSV data. Includes dark/light mode, pagination, and CSV export functionality for both customer types.

## 🚀 Features

- 📅 Filter customers by purchase date ranges.
- 📊 View paginated tables for Active and Inactive customers.
- 🌙 Toggle between Light and Dark modes.
- 📥 Download separate CSVs for Inactive and Active customers.
- ⚡ Fast data filtering with a Python Flask API and Pandas.
- 🎯 Clean, responsive UI with modern styling.

## 🛠️ Tech Stack

- **Frontend**: React, CSS
- **Backend**: Flask, Pandas
- **Other**: CSV handling, CORS

## 📂 Folder Structure

```

project/
│
├── client/                # React frontend
│   ├── CustomerList.js
│   ├── CustomerList.css
│   └── ...
│
├── server/                # Flask backend
│   ├── server.py
│   └── dev\_sir\_file.csv
│
└── README.md

````

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/customer-status-dashboard.git
cd customer-status-dashboard
````

### 2. Backend Setup (Python)

```bash
cd server
pip install flask flask-cors pandas
python server.py
```

Make sure your CSV file is named `dev_sir_file.csv` and structured correctly.

### 3. Frontend Setup (React)

```bash
cd client
npm install
npm start
```

## 📈 Filtering Logic (Backend)

* **Inactive Customers**: Appeared only once ever and that record falls within the selected date range.
* **Active Customers**: Appeared more than 3 times in total and at least once within the selected date range. Shows their **latest** record from the selected range.

## 📤 Download Format

Each CSV download includes:

* Branch Name
* Mobile Number
* Invoice Number
* Date of Purchase
