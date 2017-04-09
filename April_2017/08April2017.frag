/*
More fun with noise (simetries I)
--------------------
Shader-a-day
Darien Brito, 8 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float hash(float x) {
	return fract(sin(x) * 102141.15);
}

float random(vec2 st) {
	return fract(sin(dot(st, vec2(15.13123, 45.56251))) * 45666.12);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	// Create grid to spread out our noise
	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	// Create our hermite cubic interpolation
	vec2 h = f * f * (3.0 - 2.0 * f);
	// Do our bilinear interpolation:
	return 	mix(a, b, h.x) + 
			(c - a) * h.y * (1.0 - h.x) +
			(d - b) * h.x * h.y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;

	float d = length(st);
	float a = atan(st.y, st.x);
	float n = noise(st * 4.0);

	float detail = sin(u_time) * 0.1 + 0.4;

	// Shaping
	n = sin(n * 60.0);
	n += d;
	n += cos(a * 32.0 + u_time) * detail;
	n = pow(n, 4.0); // darken 

	vec3 color = vec3(n);
	gl_FragColor = vec4(color, 1.0);
}