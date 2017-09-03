/*
The sun

I really dislike the original and did not want to reproduce it.
so here's my version of it.

// use this in the color operations if you want to obtain the original:
// color -= abs(1.0 - c);
--------------------
Shader-a-day
Darien Brito, 22 August, 2017
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

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1. - smoothstep(s, s + 0.001, d);
}

// I just learned also this neat trick to create the outlines...
float stroke(float x, float s, float w) {
	float d = 	step(s, x+w * .5) - 
				step(s, x-w * .5);
	return clamp(d, 0., 1.);
}

float circle(vec2 st) {
	return length(st - 0.5);
}



void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2. - 1.;
	vec3 color = vec3(0.);
	vec2 xy = vec2(0.);
	float c = 0.;
	float s = 0.125;
	float offset = 0.25;

	xy = st * rotate2d(HALF_PI*0.5 * 0.);
	xy.y -= offset;
	c = 1.0 - shape(xy, 3, s);
	c +=  shape(xy, 3, s -0.01);
	color += 1.0 - c;

	for(int i = 1; i < 8; i++) {
		xy = st * rotate2d(HALF_PI*0.5 * float(i));
		xy.y -= offset;
		c *= 1.0 - shape(xy, 3, s);
		c +=  shape(xy, 3, s -0.01);
		color += 1.0 - c;
	}

	color += shape(st, 8, 0.05);
	color *= 1.0 - shape(st, 8, 0.04);

	gl_FragColor = vec4(clamp(color, 0., 1.), 1.0);

}



