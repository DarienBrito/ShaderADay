/*
Patterns
--------------------
Shader-a-day
Darien Brito, April 2, 2017
*/


uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359
#define HALF_PI 1.570796326795
#define TWO_PI 6.28318530718

vec2 tile(vec2 st, float a) {
	return fract(st * a);
}

float shape(vec2 st, float numSides) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/numSides;
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(0.4, 0.41, d);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

mat2 scale2d(float size) {
	return mat2(size, 0,
				0, size);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= vec2(0.5);
	st *= rotate2d(u_time * 0.5);
	st += vec2(0.5);

	st = tile(st, 8.0);
	st = st - vec2(0.5);
	
	float d = mod(st.y, 2.0);
	st.x += step(1.0, d) * -0.125;

	float s = shape(st, (sin(u_time) * 3.0 + 3.0) + 4.0);

	gl_FragColor = vec4(vec3(s), 1.0);
}