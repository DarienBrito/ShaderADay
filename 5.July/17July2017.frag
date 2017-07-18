/*
Wavy swirls
Coming back from a long silence...
--------------------
Shader-a-day
Darien Brito, July 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution; 
	float a = atan(st.y, st.x);
	float c = length(st - vec2(0.5)) * 2.;
	float f = 6.0;
	float v = sin(c * a * f + u_time);
	vec3 color = smoothstep(0.5, 0.51, vec3(v + 0.9 * abs(sin(u_time)) ));
	gl_FragColor = vec4(color, 1.0);
}