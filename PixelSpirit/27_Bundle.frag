/*
Bundle
--------------------
Shader-a-day
Darien Brito, 20 August, 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s - 0.001, s, d);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st *= rotate2d(PI * 0.5);
	float color = shape(st, 6, 0.45);
	color *= 1.0 - shape(st, 6, 0.38);
	// smaller hexagons
	float o = 0.145;
	float a = 0.13;
	color += shape(st + vec2(-o * 0.5, a), 6, 0.1);
	color += shape(st + vec2(-o * 0.5, -a), 6, 0.1);
	color += shape(st + vec2(o, 0.), 6, 0.1);

	gl_FragColor = vec4(vec3(color), 1.0);
}