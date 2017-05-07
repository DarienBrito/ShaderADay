/*
Making circles
--------------------
Shader-a-day
Darien Brito, 24_mar_2017
*/

uniform float u_time;
uniform vec2 u_resolution;

// This one I'm messing around with, same principle though...
float circle1(vec2 st, float size) {
	float c = distance(st, vec2(0.5)) * size;
	return smoothstep(0.495, 0.5,c);
}

// Identic result
float circle2(vec2 st, float size) {
	return smoothstep(0.495, 0.5, length(st - vec2(0.5, 0.5)) * size);
}

// Yet another option...
float circle3(vec2 st, float size) {
	vec2 q = st - vec2(0.5, 0.5);
	return smoothstep(0.495, 0.5, sqrt(q.x * q.x + q.y * q.y) * size);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c = circle1(st, sin(u_time * 2.0) * 0.1 + 1.5);

	gl_FragColor = vec4(vec3(c), 1.0);
}