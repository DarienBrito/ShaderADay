/*
The Diamond - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 9 August
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

float zebraTriangle(vec2 st) {
	float color = shape(st, 3, 0.1);
	color += 1.0 - shape(st, 3, 0.125);
	color *= shape(st, 3, 0.15);
	color += 1.0 - shape(st, 3, 0.175);
	color *= shape(st, 3, 0.2);
	return color;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2. - 1.;
	st += vec2(0., 0.5);
	
	vec2 q = st;
	q.y = (q.y > 0.5) ?  q.y : 1.0 - q.y;
	float c1 = zebraTriangle(q - vec2(0., 0.6));
	gl_FragColor = vec4(vec3(c1), 1.0);
}