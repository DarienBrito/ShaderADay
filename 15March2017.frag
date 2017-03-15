/*
15 March, 2017
---------------
Practising functions. Trigonometry is a wonderful thing.
Need to learn more of it!

Good read btw: Preface/ What is OpenGL?
Worth the time to know more about the history of OpenGL and GLSL
*/

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 center = vec2(0.5, 0.5);

	float rFreq = 2.0;
	float r = distance(vec2(sin((st.y * PI * rFreq) + (u_time * 0.5)), cos(st.x * PI * rFreq)), center);

	float gFreq = 3.0;
	vec2 gVec = vec2(cos((st.x * PI * gFreq) + (PI * 0.5)), sin(st.y * PI * gFreq));
	float g = distance(gVec, center);
	g = sin(g * PI + u_time);
	g = smoothstep(0.5, 0.51, g);

	float b = sin(distance(st, center) + (u_time * 2.0)) * 0.5 + 0.5;
	gl_FragColor = vec4(vec3(r, g, b), 1.0);
}