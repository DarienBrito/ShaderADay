/*
The stone - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 12 August
*/

uniform vec2 u_resolution;
#define PI 3.141592653589

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float box(vec2 st, vec2 s) {
	float c = step(s.x, st.x) * 1.0 - step(1.0 - s.x, st.x);
	c *= step(s.y, st.y) * 1.0 - step(1.0 - s.y, st.y);
	return c;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st *= rotate2d(radians(45.));
	st += 0.5;
	float color = box(st, vec2(0.2));
	color *= 1.0 - box(st, vec2(0., 0.485));
	color *= 1.0 - box(st, vec2(0.485, 0.));
	gl_FragColor = vec4(vec3(color), 1.0);
}