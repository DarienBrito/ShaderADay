uniform float u_time;
uniform vec2 u_resolution;

/*

A nice pattern

*/

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 q = st - vec2(0.5, 0.5);

	float r = 0.1;
	float freq = 4.0;
	float phase = u_time;
	float amplitude = 0.2;
	r += amplitude * cos(atan(q.y, q.x) * freq + phase);
	float c = smoothstep(r, r + 0.01, length(q));

	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}