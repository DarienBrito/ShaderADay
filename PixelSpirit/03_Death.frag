/*
PixelSpirit - Death
--------------------
Shader-a-day
Darien Brito, August 4 2017
*/

#define PI 3.141592653589
uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c = step(1.0 - st.x, st.y + sin(st.y - 0.5) * 0.5);
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}