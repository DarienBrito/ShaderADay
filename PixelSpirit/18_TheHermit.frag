/*
The Hermit - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 10 August
*/

uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s, s + 0.01, d);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2. - 1.;
	
	vec2 q = st + vec2(0., 0.45);
	q.y = (q.y > 0.5) ?  q.y : 1.0 - q.y;
	float c1 = shape(q, 3, 0.4);

	vec2 k = st + vec2(0., 0.1);
	float c2 = shape(k, 3, 0.25);
	gl_FragColor = vec4(vec3(abs(c1 - c2)), 1.0);
}