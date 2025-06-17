df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')

# start_date = pd.to_datetime('20-04-2025', dayfirst=True)
# end_date = pd.to_datetime('28-04-2025', dayfirst=True)

# filtered_df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]