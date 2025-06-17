import pandas as pd

df = pd.read_csv('filtered_data.csv')

df.columns = df.columns.str.strip().str.lower()

print(df.columns)

purchase_counts = df['mobile no.'].value_counts()

one_time_numbers = purchase_counts[purchase_counts == 1].index
one_time_customers = df[df['mobile no.'].isin(one_time_numbers)]

regular_numbers = purchase_counts[purchase_counts > 3].index
regular_customers = df[df['mobile no.'].isin(regular_numbers)]

one_time_customers.to_csv('one_time_customers.csv', index=False)
regular_customers.to_csv('regular_customers.csv', index=False)

print("Filtered data Files saved as 'one_time_customers.csv' and 'regular_customers.csv'")