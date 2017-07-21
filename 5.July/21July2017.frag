/*

--------------------
Shader-a-day
Darien Brito, 
*/

uniform vec2 u_resolution;
uniform float u_time;

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

float fbm(vec2 st, int depth) {
	float fbm = 0.0;
	float a = 0.5;
	for(int i = 0; i < depth; i++){
		fbm += noise(st) * a;
		st *= 2.0;
		a *= 0.5;
	} 
	return fbm;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float l = length(st - vec2(0.5));


	float n = fbm(st * 45. * fbm(st * 4., 2), 4);
	vec3 c = vec3(cos(n * 3.0 + u_time));
	vec3 color = mix(
		vec3(0.1, 0., 0.), 
		vec3(0.9, 0.8, 0.15), c);
	color *= mix(
		vec3(0., 0.4, 0.1),
		vec3(0.7, 0.5, 1.),
		c);

	color *= l;

	gl_FragColor = vec4(color, 1.0);
}