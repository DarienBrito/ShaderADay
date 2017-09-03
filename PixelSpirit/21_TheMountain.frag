/*
The mountain - Pixel Spirit
--------------------
Shader-a-day
Darien Brito, 13 August
*/

uniform vec2 u_resolution;

#define PI 3.141592653589

float box(vec2 st, vec2 s) {
	float c = step(s.x, st.x) * 1.0 - step(1.0 - s.x, st.x);
	c *= step(s.y, st.y) * 1.0 - step(1.0 - s.y, st.y);
	return c;
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.;
	st *= rotate2d(PI * 0.25);
	st += 0.5;

	float sb1 = box(st + vec2(0.17, 0.15), vec2(0.33));
	float sb2 = box(st + vec2(-0.17, -0.15), vec2(0.33));
	float b = 1.0 - box(st, vec2(0.25));
	float color = clamp((sb1 + sb2) * b, 0., 1.0);
	color +=  box(st, vec2(0.27));

	gl_FragColor = vec4(vec3(color), 1.0);
}

