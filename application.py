from datapackage import Package
import pandas as pd
from flask import Flask, render_template, Response
import io
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from scipy.integrate import odeint
import matplotlib.pyplot as plt
from flask import jsonify
import json



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
    title = 'CoronaSim'
    return render_template('index.html', title=title)

@app.route('/index.html')
def html_page():
    title = 'CoronaSim'
    return render_template('index.html', title=title)

@app.route('/diffeq.html')
def diffeq_html():
    title = 'Differential Equations'
    return render_template('diffeq.html', title=title)

@app.route('/elements.html')
def elements_html():
    return render_template('elements.html')

@app.route('/plot.png')
def plot_png():
    fig = create_figure(0.5, 0.33)
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')

@app.route('/data/<float:b>/<float:k>')
def return_ode_solution(b, k):
    # print(str(b) + " " + str(k))
    sol = get_sol(b,k)
    return jsonify(sol.tolist())

def get_sol(b, k):
    n = 327200000
    y0 = [1, 1.27 * (10 ** -6), 0]
    t = np.linspace(0, 140, 365)
    sol = odeint(sir, y0, t, args=(b,k))
    sol = sol * n
    return sol

def create_figure(b, k):
    sol = get_sol(b,k)

    fig = plt.figure()
    plt.plot(t, sol[:,0], 'b', label='susceptible')
    plt.plot(t, sol[:,1], 'r', label='infected')
    plt.plot(t, sol[:,2], 'g', label='recovered')
    plt.legend(loc='best')
    plt.xlabel('t')
    plt.ylabel('People (Hundred Millions)')
    plt.grid()
    return fig

def sir(y, t, b, k):
    s, i, r = y
    dydt = [-b*s*i, b*s*i - k*i, k*i]
    return dydt

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
