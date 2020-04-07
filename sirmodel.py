from scipy.integrate import odeint
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.figure import Figure


def sir(y, t, b, k):
    s, i, r = y
    dydt = [-b*s*i, b*s*i - k*i, k*i]
    return dydt

b = 0.7
k = 0.33
n = 327200000
y0 = [1, 1.27 * (10 ** -6), 0]
t = np.linspace(0, 140, 300)
sol = odeint(sir, y0, t, args=(b,k))
sol = sol * n

fig = plt.figure()
plt.plot(t, sol[:,0], 'b', label='susceptible')
plt.plot(t, sol[:,1], 'r', label='infected')
plt.plot(t, sol[:,2], 'g', label='recovered')
plt.legend(loc='best')
plt.xlabel('t')
plt.ylabel('People (Hundred Millions)')
plt.grid()
plt.show()



