/*
PixelSpirit - Justice
--------------------
Shader-a-day
Darien Brito, August 4 2017
*/

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c = step(0.5, st.x);
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}