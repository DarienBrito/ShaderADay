/*
PixelSpirit - The Wall
--------------------
Shader-a-day
Darien Brito, August 4 2017
*/

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float dif = 0.05;
	float c = step(0.5 - dif, st.x);
	c *= 1.0 - step(0.5 + dif, st.x);
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0); 
}
