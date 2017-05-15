import numpy as np
import math

def length(p):
	return math.sqrt(sum(pow(i, 2.0) for i in p))

'''
	------------- MODEL -------------
	
    vec3 e = vec3( 0.001, 0.00, 0.00 );
    float deltaX = map( p + e.xyy ) - map( p - e.xyy );
    float deltaY = map( p + e.yxy ) - map( p - e.yxy );
    float deltaZ = map( p + e.yyx ) - map( p - e.yyx );
    return normalize( vec3( deltaX, deltaY, deltaZ ) );
'''

def getNormal(p):
	#In GLSL we can swizle e = (0.001, 0.0, 0.0)
	#the equivalent in Python would be:
	e1 = np.array([0.001, 0.00, 0.00]) # e.xyy
	e2 = np.array([0.00, 0.001, 0.00]) # e.yxy
	e3 = np.array([0.001, 0.001, 0.00]) # e.yyx
	deltaX = length(p + e1) - length(p - e1)
	deltaY = length(p + e2) - length(p - e2)
	deltaZ = length(p + e3) - length(p - e3)
	vector = np.array([deltaX, deltaY, deltaZ])
	return np.linalg.norm(vector)


p = np.array([0.0, 0.0, -10.0])
print(getNormal(p))

# Get 20 3D vectors
testPoints = np.random.rand(20, 3)

for i, a in enumerate(testPoints):
	print("{}: {}".format(i, getNormal(a)))
