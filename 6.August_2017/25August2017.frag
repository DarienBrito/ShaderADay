/*
Wheel of Fortune
--------------------
Shader-a-day
Darien Brito, August 25, 2017
*/

uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

float raysSDF(vec2 st, int N) {
	st -= .5;
	float phase = 0.2;
	return fract((atan(st.y, st.x) / TWO_PI + phase) * float(N));
}

vec2 rotate2d(vec2 st, float angle) {
	st -= 0.5;
	vec2 r = mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle)) * st;
	return r += 0.5;
}

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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c = 0.;

	c = 1.0 - step(0.2, raysSDF(st, 8));
	c *= 1.0 - step(0.2, length(st - 0.5));
	c += stroke(starSDF(rotate2d(st, PI * 0.125), 8, 0.0), 0.5, 0.1);

	float mask = step(0.2, starSDF(rotate2d(st, PI * 0.125), 8, 0.0));
	c *= mask;
	c += stroke(starSDF(rotate2d(st, PI * 0.125), 8, 0.0), 0.15, 0.025);
	
	gl_FragColor = vec4(vec3(c), 1.0);
}