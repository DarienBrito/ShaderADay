/*
The temple
--------------------
Shader-a-day
Darien Brito, August 5 2017
*/

#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795
#define PI 3.141592653589

uniform vec2 u_resolution;

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s-0.001, s, d);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2. -1.;
	float color = 0.;

	st -= vec2(0., 0.1);
	vec2 xy = (st * rotate2d(PI));
	float t1 = shape(xy, 3, 0.4);
	float t2 = 1.-shape(st, 3, 0.2);

	color += t1;
	color *= t2;


	gl_FragColor = vec4(vec3(color), 1.0);
}