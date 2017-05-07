/*
Random
--------------------
Shader-a-day
Darien Brito, 4 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float v) {
	return fract(sin(v) * 100000.0);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float color = random(st.x);
	gl_FragColor = vec4(vec3(color), 1.0);
}