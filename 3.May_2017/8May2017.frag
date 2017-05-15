/*
Ray marching 101
from a tutorial by xdPixel
--------------------
Shader-a-day
Darien Brito, 8 May 2017
*/

/*
How many steps are we gonna march along the ray.
More steps means better quality, but longer computation time
*/
#define STEPS 32
uniform vec2 u_resolution;

// A simple geometry
float sphere( vec3 p, float radius) {
	return length(p) - radius;
}

// The function that defines the scene
float map(vec3 p) {
	return sphere(p, 3.0);
}

/*
We travel across the ray with increments that are equal to the 
dsitance from current ray point and the geometry.
*/
float trace(vec3 origin, vec3 direction) {
	float totalDistanceTraveled = 0.0;
	// March along the ray
	for(int i = 0; i < STEPS; i++) {
		vec3 p = origin + direction * totalDistanceTraveled;
		float distanceFromPointOnRayToClosestObjectInScene = map(p);
		totalDistanceTraveled += distanceFromPointOnRayToClosestObjectInScene;

		// Check if distance is close enough to assume intersection and, if so, jump out the loop!
		if(distanceFromPointOnRayToClosestObjectInScene < 0.001) {
			break;
		}
		// Give limit for checking, beyond this point,
		// we are probably marching to empty space, so we can jump out the loop!
		if(totalDistanceTraveled > 10000.0) {
			totalDistanceTraveled =0.0;
			break;
		}
	}
	return totalDistanceTraveled; // Will return a number equal to the distance from origin to the geometry in question
}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	uv.x *= u_resolution.x/u_resolution.y; 

	// Place ourselves 10 units far from point of origin vec3(.0, .0, .0)
	vec3 cameraPos = vec3(0.0, 0.0, -10.0);
	// Use UV map as direction 
	vec3 cameraDir = normalize(vec3(uv.x, uv.y, 1.0));
	// Do our tracing and get the distance from cameraPosition to object
	float distanceToClosestPointInScene = trace(cameraPos, cameraDir);
	// The number we get will exceed 1.0, in this case, we will just get white if that happens of course.
	vec3 color = vec3(distanceToClosestPointInScene);
	gl_FragColor = vec4(color, 1.0);
}