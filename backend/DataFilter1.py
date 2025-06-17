import pandas as pd

file_name = 'dev_sir_file.csv'

df = pd.read_csv(file_name, header=4)

print("Columns detected:", df.columns.tolist())
df.columns = df.columns.str.strip().str.lower()
print("Cleaned columns:", df.columns.tolist())

df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')

lost_start = pd.to_datetime('20-04-2025', dayfirst=True)
lost_end = pd.to_datetime('23-04-2025', dayfirst=True)

active_start = pd.to_datetime('24-04-2025', dayfirst=True)
active_end = pd.to_datetime('28-04-2025', dayfirst=True)

lost_customers = df[(df['date'] >= lost_start) & (df['date'] < active_start)]
lost_customers.to_csv('lost_customers.csv', index=False)
print("Lost customers saved to 'lost_customers.csv'")

active_customers = df[(df['date'] >= active_start) & (df['date'] <= active_end)]
active_customers.to_csv('active_customers.csv', index=False)
print("Active customers saved to 'active_customers.csv'")