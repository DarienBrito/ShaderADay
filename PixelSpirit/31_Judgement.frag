/*
Judgement
--------------------
Shader-a-day
Darien Brito, August 24, 2017
*/
uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

float raysSDF(vec2 st, int N) {
	st -= .5;
	return fract((atan(st.y, st.x) / TWO_PI) * float(N));
}

float box(in vec2 st, in vec2 size) {
	size = vec2(0.5) - size * 0.5;
	vec2 uv = smoothstep(size, size + 0.001, st);
	uv *= smoothstep(size, size + 0.001, 1.0 - st);
	return uv.x * uv.y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c = 0.;
	
	float rays = step(0.25, raysSDF(st, 23));
	float div = step(0.5, st.y);
	c += rays;
	c = mix(c, 1.0 - c, step(0.5, st.y));

	float mask = box(st, vec2(0.2));
	c *= 1.0 - mask;
	c += box(st, vec2(0.15));

	gl_FragColor = vec4(vec3(c), 1.0);
}