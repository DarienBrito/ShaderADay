/*
Re-learning noise
Remaking yesterday's excercise to make sure it sticks!
--------------------
Shader-a-day
Darien Brito, 6 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x) {
	return fract(sin(x) * 1e4);
}

float random(vec2 st){
	return fract(sin(dot(st, vec2(124.2364, 65.3163))) * 1e4);
}

float randomPattern(float x, float f, float s) {
	// So, we get a range of integer numbers = x*f 
	// and then substract an integer number from that (s)
 	return step(0.8, random( floor(x * f) - floor(s) )); 
 }

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	// How to make each column unique?
	float cols = 2.0;
	float speed = u_time * 10.0;	

	if( fract(st.y * cols * 0.5) > 0.5 ) {
		speed *= -1.0; // Invert motion
	}

	float density = 400.0;
	float pattern = randomPattern(st.x, density, speed);

	vec3 color = vec3(pattern * random(st.x), pattern * random(st.y), pattern * random(1.0- st.x));

	gl_FragColor = vec4(color, 1.0);
}