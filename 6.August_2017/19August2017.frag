/*
The Empress
--------------------
Shader-a-day
Darien Brito, August 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float shape(vec2 st, float s, int numSides) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s-0.002, s, d);
}

float shrinkingPentagons1(vec2 st) {
	float color = shape(st, 0.65, 5);
	color *= (1.0 - shape(st, 0.55, 5));
	color += shape(st, 0.45, 5);
	color *= (1.0 - shape(st, 0.35, 5));
	color += shape(st, 0.25, 5);
	color *= (1.0 - shape(st, 0.15, 5));
	color += shape(st, 0.05, 5);
	return color;
}

float shrinkingPentagons2(vec2 st) {
	float color = shape(st, 0.44, 5);
	color *= (1.0 - shape(st, 0.34, 5));
	color += shape(st, 0.24, 5);
	color *= (1.0 - shape(st, 0.14, 5));
	color += shape(st, 0.04, 5);
	return color;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	float color = 1.0 - shrinkingPentagons1(st);
	st *= rotate2d(PI);
	color += shrinkingPentagons2(st);
	color = 1.0 - color;
	gl_FragColor = vec4(vec3(color), 1.0);
}