/*
PixelSpirit - Strength
--------------------
Shader-a-day
Darien Brito, August 4 2017
*/

#define PI 3.141592653589

uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c = step(sin(st.y * PI*2.) * 0.125 + 0.5, st.x);
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}