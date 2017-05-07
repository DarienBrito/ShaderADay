/*
Noise Patterns (2)
--------------------
Shader-a-day
Darien Brito, April 8, 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 st) {
	return fract(sin(dot(st, vec2(41.21512, 73.23124))) * 1214.74632);
}

float valueNoise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	vec2 h = f*f*(3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return 	mix(a, b, h.x) + 
			(c - a) * h.y * (1.0 - h.x) +
			(d - b) * h.x * h.y;
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle), 
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;

	float r = valueNoise(st * TWO_PI);
	st *= rotate2d(r + (u_time * 0.1));
	
	float p = valueNoise(st * 8.0);
	p *= sin(atan(st.y, st.x) * 50.0);

	vec3 color = vec3(p);
	gl_FragColor = vec4(color, 1.0);
}