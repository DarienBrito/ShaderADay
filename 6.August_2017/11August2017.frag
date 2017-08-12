/*
Intuition - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 11 August
*/

uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s, s + 0.002, d);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0; 
	st *= rotate2d(PI * 0.18);

	vec2 q = st;
	vec2 r = st;
	vec2 offset1 = vec2(0.2, 0.3);
	vec2 offset2 = vec2(-0.2, 0.3);
	float rotationFactor = 0.167;

	q += offset1;
	q *= rotate2d(PI * rotationFactor);

	r += offset2;
	r *= rotate2d(PI * -rotationFactor);

	float c1 = shape(st, 3, 0.25);
	float c2 = 1.0 - shape(q, 3, 0.2);
	float c3 = 1.0 - shape(r, 3, 0.2);

	gl_FragColor = vec4(vec3(c1 * (c2 * c3)), 1.0);
}