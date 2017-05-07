/*
Tiling patterns
--------------------
Shader-a-day
Darien Brito, April 1, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359

float box(vec2 st, vec2 size) {
	size = vec2(0.5) - size * 0.5;
	vec2 uv = smoothstep(size, size + 0.05, st);
	uv *= smoothstep(size, size + 0.05, 1.0 - st);
	return uv.x * uv.y;
}

vec2 tile(vec2 st, float n) {
	return fract(st * n);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float sineMod(float f, float a, float o) {
	return sin(u_time * f) * a + o;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5; // Move coords to -0.5 to 0.5 range
	st *= rotate2d(u_time * 0.25); // Rotate 45 degrees
	st += 0.5; //Place coords back to 0.0 1.0
	st = tile(st, 8.0); // tile it
	float shape = box(st, vec2(.8) * sineMod(0.5, 0.4, 0.6)); // draw our shaphe
	vec3 color = vec3(sineMod(0.5, 0.5, 0.5), sineMod(0.3, 0.5, 0.5), sineMod(0.6, 0.5, 0.5)); // apply color...
	color *= shape;
	gl_FragColor = vec4(color, 1.0);
}