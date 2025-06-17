from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

file_name = 'dev_sir_file.csv'
df = pd.read_csv(file_name, header=4)
df.columns = df.columns.str.strip().str.lower()
df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')

@app.route('/filter-customers', methods=['POST'])
def filter_customers():
    data = request.json

    lost_start = pd.to_datetime(data.get('lost_start'), dayfirst=True, errors='coerce')
    lost_end = pd.to_datetime(data.get('lost_end'), dayfirst=True, errors='coerce')

    active_start = pd.to_datetime(data.get('active_start'), dayfirst=True, errors='coerce')
    active_end = pd.to_datetime(data.get('active_end'), dayfirst=True, errors='coerce')

    # Filter the entire dataframe first by selected date range
    df_lost_range = df[(df['date'] >= lost_start) & (df['date'] <= lost_end)]
    df_active_range = df[(df['date'] >= active_start) & (df['date'] <= active_end)]

    # Lost customers: purchased only once EVER, and only entry falls within selected range
    lost_customer_counts = df.groupby('mobile no.')['mobile no.'].count()
    lost_numbers = lost_customer_counts[lost_customer_counts == 1].index

    lost_customers = df_lost_range[df_lost_range['mobile no.'].isin(lost_numbers)].copy()

    # Active customers: purchased >3 times EVER, and appeared in selected range
    active_customer_counts = df.groupby('mobile no.')['mobile no.'].count()
    active_numbers = active_customer_counts[active_customer_counts > 3].index

    # Now take only those active numbers whose record falls in date range
    active_customers = df_active_range[df_active_range['mobile no.'].isin(active_numbers)].copy()

    # From filtered data, pick latest record per mobile no (strictly from selected date range)
    active_customers = active_customers.sort_values('date').drop_duplicates(subset='mobile no.', keep='last')

    # Format dates
    lost_customers['date'] = lost_customers['date'].dt.strftime('%d-%m-%Y')
    active_customers['date'] = active_customers['date'].dt.strftime('%d-%m-%Y')

    return jsonify({
        'lost_customers': lost_customers.where(pd.notnull(lost_customers), None).to_dict(orient='records'),
        'active_customers': active_customers.where(pd.notnull(active_customers), None).to_dict(orient='records')
    })

if __name__ == '__main__':
    app.run(debug=True)
