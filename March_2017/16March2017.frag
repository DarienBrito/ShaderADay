/*

16 March, 2017
---------------
Some elliptical motion

*/

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926535

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 center = vec2(0.5, 0.5);
	float r = 0.3;
	float s = 1.0;
	float scale = abs(sin(u_time) * 0.1 + 0.4);
	vec2 mov = vec2(st.x + (cos(u_time * s) * r), st.y + (sin(u_time * s) * r));
	float color = distance(mov, center) * (1.0/scale); // multiply by the inverse of reciprocal
	color = sin(smoothstep(0.5, 0.51, color) * PI + u_time);
	gl_FragColor = vec4(vec3(color), 1.0);
}