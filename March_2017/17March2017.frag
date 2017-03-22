/*

17 March, 2017
---------------
Trippy patterns using fractional parts for repetition

*/

uniform float u_time;
uniform vec2 u_resolution;
#define PI 3.14159265

// This function allows for repetitions on both axises
// The principle is rather simple... First expand beyond normalized range.
// Then take the fractional part. As a result, you get repetitions!
vec2 rep(vec2 st, float n) {
	return fract(st * n);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	// Split screen in 4 (2 vectors * 2)
	st = rep(st, 2.0);
	// A circular pattern achieved with the distance function
	float color = distance(vec2(st.x, st.y), vec2(0.5, 0.5));
	// take the fractional part of that * sine
	color = fract(color * (sin((u_time * 0.1) * PI) * 5.0 + 7.0) + u_time);
	// Refine edges
	color = smoothstep(0.3, 0.9, color);
	
	// This loop is merely to add some finer detail to it...
	float val = 1.0;
	for(int i = 0; i < 3; i++){
	 	color = fract(color * val);
	 	val += 1.0;
	}

	gl_FragColor = vec4(vec3(color, sin(color * PI), sin(color * PI)), 1.0);
}