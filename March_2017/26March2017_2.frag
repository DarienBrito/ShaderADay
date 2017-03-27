/*

A kind of organism with matrices
--------------------------------
Shader-a-day
Darien Brito, 26 March, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;
#define PI 3.14159265359

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

mat2 scale2d(float scale) {
	return mat2(scale, 0,
				0, scale);
}

float box(in vec2 st, in vec2 size) {
	size = vec2(0.5) - size * 0.5;
	vec2 uv = smoothstep(size, size + 0.001, st);
	uv *= smoothstep(size, size + 0.001, 1.0 - st);
	return uv.x * uv.y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	
	// Translate center to 0.0
	st -= vec2(0.5, 0.5);

	// Scale
	st *= scale2d(PI);

	// Rotate matrix
	st *= rotate2d(u_time * 1.5);

	// Translate center to 0.5 again
	st += vec2(0.5, 0.5);

	// Draw squares
	float color = 0.0;
	for(int i = 0; i < 4; i++){
		float index = float(i);
		color += box(st + vec2(0.1 * index, 0.5), vec2(0.1 - (index * 0.025)));
	}
	// Add smooth circle
	color += (1.0 - length(st) * 3.5);

	// Output
	gl_FragColor = vec4(vec3(color), 1.0);
}