import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from random import randint

df = pd.DataFrame.from_csv("tags.csv")
df['1'] = np.random.randint(10, 65, df.shape[0])
df['2'] = np.random.randint(10, 65, df.shape[0])
df['3'] = np.random.randint(10, 65, df.shape[0])
df['4'] = np.random.randint(10, 65, df.shape[0])
df['5'] = np.random.randint(10, 65, df.shape[0])
df['6'] = np.random.randint(10, 65, df.shape[0])
df['7'] = np.random.randint(10, 65, df.shape[0])
df['8'] = np.random.randint(10, 65, df.shape[0])
df['9'] = np.random.randint(10, 65, df.shape[0])
df['10'] = np.random.randint(10, 65, df.shape[0])
df['11'] = np.random.randint(10, 65, df.shape[0])
df['12'] = np.random.randint(10, 65, df.shape[0])
print(df)

df.to_csv('tag_table.csv')