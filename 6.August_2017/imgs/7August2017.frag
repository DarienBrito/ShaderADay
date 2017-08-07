/*
Pixel Spirit - The Temple
--------------------
Shader-a-day
Darien Brito, August 7 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;

float shape(vec2 st, float numSides, float s, float angle) {
	float a = atan(st.y, st.x) + angle;
	float r = TWO_PI/numSides;
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s, s + 0.001, d);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;
	float t1 = shape(st, 3., 0.1, PI * 1.5);
	float t2 = shape(st, 3., 0.05, PI * 0.5);
	gl_FragColor = vec4(vec3(t1 - t2), 1.0);
}