from datapackage import Package
import pandas as pd
from flask import Flask, render_template


# package = Package('https://datahub.io/core/covid-19/datapackage.json')

# # print list of all resources:
# print(package.resource_names)

# countries_data = []
# data = pd.DataFrame()
# # Extract the country aggregated data and store into DataFrame "data"
# for resource in package.resources:
#     if resource.descriptor['datahub']['type'] == 'derived/csv':
#         #print(pd.DataFrame(resource.read()))
#         print(resource.name)
#         if resource.name == 'time-series-19-covid-combined_csv':
#             countries_data = resource.read()
#             data = pd.DataFrame(countries_data)

# data.columns = ['Data', 'Country/Region', 'Province/State', 'Lat', 'Long', 'Confirmed', 'Recovered', 'Deaths']
# print(data)


# #Begin Preprocessing of aggregated country data
# data = data.drop(columns=['Lat', 'Long', 'Province/State'])
# data = data[data['Country/Region']=='US']
# #print(data)


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/html')
def html_page():
    title = 'CoronaSim'
    return render_template('index.html', title=title)


