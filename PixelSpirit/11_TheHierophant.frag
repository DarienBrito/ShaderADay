/*
Pixel Spirit - The Hierophant
--------------------
Shader-a-day
Darien Brito, 6 August 2017
*/

#define WHITE 1
#define BLACK 0

uniform vec2 u_resolution;

float box(vec2 st, float s, int mode) {
	float b = step(s, st.x) - step(1.0 - s, st.x);
	b *= step(s, st.y) - step(1.0 - s, st.y);
	b = (mode == BLACK) ? 1. - b : b; 
	return b;
}

float boxStack(vec2 st) {
	// Outer one
	float comp = box(st, 0.1, 0);
	// Inner ones
	comp += box(st, 0.22, 1);
	comp *= box(st, 0.26, 0);
	comp += box(st, 0.3, 1);
	comp *= box(st, 0.34, 0);
	comp += box(st, 0.38, 1);
	comp *= box(st, 0.42, 0);
	comp += box(st, 0.46, 1);
	return comp;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 q = fract(st * 2.0);
	float c = box(st, 0.2, WHITE);
	float d;
	// Outer
	c *= box(st, 0.21, BLACK);
	c += box(st, 0.24, WHITE);
	c *= box(st, 0.26, BLACK);
	// Inner pattern
	d = box(st, 0.3, WHITE); // black mask
	d *= boxStack(q);
	c += d;
	gl_FragColor = vec4(vec3(c), 1.0);
}