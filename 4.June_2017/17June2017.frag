uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float angle) {
	return mat2(
			vec2(cos(angle), -sin(angle)),
			vec2(sin(angle), cos(angle))
		);
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

float fbm(vec2 st) {
	float amp = .5;
	float s = 2.0;
	float n = 0.;
	for(int i = 0; i < 5; i++){
		n += noise(st) * amp;
		amp *= .5;
		st *= s;
	}
	return n;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st.x *= u_resolution.x/u_resolution.y;
	st *= rotate2d(u_time * 0.125);

	float c = smoothstep(.2, .8, sin(st.y * st.x * 120. + u_time));
	c *= 10.;
	vec3 color = vec3(c);

	vec3 n = vec3(fbm(st * 4.0), .3, 0.2);
	gl_FragColor = vec4(n, 1.0);
}