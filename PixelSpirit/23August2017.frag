/*
The star

I really dislike the original and did not want to reproduce it.
so here's my version of it.

// use this in the color operations if you want to obtain the original:
// color -= abs(1.0 - c);
--------------------
Shader-a-day
Darien Brito, 23 August, 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

// It was impossible for me to crack down how to make the star!
// so, I had to look... 
float starSDF(vec2 st, int V, float s) {
	st = st * 2. -1.;
	float a = atan(st.y, st.x) / TWO_PI;
	float seg = a * float(V);
	a = ((floor(seg) + 0.5)/float(V) + 
	mix(s, -s, step(.5, fract(seg)))) * TWO_PI;
	return abs(dot(vec2(cos(a), sin(a)), st));
}

float stroke(float x, float s, float w) {
	float d = 	step(s, x+w * .5) - 
				step(s, x-w * .5);
	return clamp(d, 0., 1.);
}

// This one is way more elegant than what I had, so let's just copy it here
float raysSDF(vec2 st, int N) {
	st -= .5;
	return fract((atan(st.y, st.x) / TWO_PI) * float(N));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2. - 1.;
	vec2 xy = vec2(0.);
	vec3 c = vec3(0.);
	float s = 0.125;
	float offset = 0.25;
	// Rays 
	c += stroke(raysSDF(st + 0.5, 8), 0.5, 0.2);
	// Star
	float mask = starSDF(st + 0.5, 6, 0.33333);
	c *= step(0.55, mask);
	c += 1.0 - step(0.5, mask);
	c -= stroke(starSDF(st + 0.5, 6, 0.33333), 0.43, 0.05);
	c -= stroke(starSDF(st * rotate2d(PI*0.5) + 0.5, 6, 0.33333), 0.22, 0.05);
	gl_FragColor = vec4(clamp(c, 0., 1.), 1.0);
}



