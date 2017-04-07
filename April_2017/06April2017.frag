/*
Re-learning noise
Re-doing by reasoning what I've learned so it sticks!
I'm mostly interested in noise processes, so it is important
for me to fully grasp it
--------------------
Shader-a-day
Darien Brito, 6 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x) {
	return fract(sin(x) * 1e4); // scientific notation for 10000
}

float random2D(vec2 st) {
	return fract(sin(dot(st, vec2(21.1512, 243.2314))) * 1e4);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	float numCells = 10.0;
	
	/* 
	Since it is pseudo-random, the same integer value will repeat for the 
	given region according to index, hence returning the same color until
	a new integer appears.
	*/
	//vec2 index = floor(st * numCells);

	
	/*
	Venturing into exploration, we see how we can affect distribution
	using other functions:
	*/
	float limit = 5.0;
	float aperture = (sin(u_time) * 0.5 + 0.5) * limit;
	vec2 index = smoothstep(limit - aperture, limit + aperture, st * numCells);


	float val2D = random2D(index);
	gl_FragColor = vec4(vec3(val2D), 1.0);
}