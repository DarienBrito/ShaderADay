/*

17 March, 2017
---------------
Exercise from "The book of shaders"

*/

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

// Plotter
float plotter(vec2 st, float x) {
	return 	smoothstep(x - 0.01, x, st.y) -
			smoothstep(x, x + 0.01, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 colorA = vec3(0.15, 0.765, 0.45);
	vec3 colorB = vec3(0.77, 0.1, 0.233);
	
	vec3 color = vec3(0.0);
	vec3 pct = vec3(st.x);

	pct.r = smoothstep(0.0, 1.0, st.x);
	pct.g = sin(st.x * PI + u_time);
	pct.b = step(0.1, cos(st.x * 20.0 - u_time));

	color = mix(colorA, colorB, pct);

	//color = mix(color, vec3(1.0, 0.0, 0.0), plotter(st, pct.r));
	//color = mix(color, vec3(0.0, 1.0, 0.0), plotter(st, pct.g));
	//color = mix(color, vec3(0.0, 0.0, 1.0), plotter(st, pct.b));

	gl_FragColor = vec4(color, 1.0);
}