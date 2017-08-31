/*
The oak - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 17 August 2017 
*/

#define PI 3.141592653589

uniform vec2 u_resolution;

float box(vec2 st, vec2 s) {
	float c = step(s.x, st.x) * 1.0 - step(1.0 - s.x, st.x);
	c *= step(s.y, st.y) * 1.0 - step(1.0 - s.y, st.y);
	return c;
}

mat2 rotate2d(float angle) {
	return mat2(
			cos(angle), -sin(angle),
			sin(angle), cos(angle)
		);
}

float binarySquare(vec2 st, float s, float m) {
	float c1 = box(st, vec2(s)); 
	float c2 = 1.0 - box(st, vec2(s + m));
	return float(c1 * c2);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st *= rotate2d(PI * 0.25);
	st += 0.5;

	float c = binarySquare(st, 0.25, 0.025);
	float d = 0.1;
	c += binarySquare(st + vec2(-d, d), 0.35, 0.025);
	d = 0.125;
	c *= 1.0 - binarySquare(st + vec2(-d, d), 0.35, 0.05);
	c += binarySquare(st + vec2(-d, d), 0.378, 0.02);

	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}