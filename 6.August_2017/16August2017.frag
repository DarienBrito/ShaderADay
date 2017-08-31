/*
The shadow - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 16 August 2017 
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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st *= rotate2d(PI * 0.25);
	st += 0.5;
	vec3 color = vec3(0.);

	float d = 0.05;
	float c1 = box(st + vec2(d), vec2(0.25)); 
	float c2 = box(st + vec2(-d), vec2(0.25));
	color = vec3(abs(c1 - c2));

	gl_FragColor = vec4(color, 1.0);
}