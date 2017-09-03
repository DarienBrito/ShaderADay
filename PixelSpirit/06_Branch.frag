/*
PixelSpirit - Branch
--------------------
Shader-a-day
Darien Brito, August 5 2017
*/

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float dif = 0.04;
	float color = 1.0 - smoothstep(dif, dif+0.001, st.y - st.x);
	color -= 1.0 - smoothstep(-dif, -dif+0.001, st.y - st.x);
	gl_FragColor = vec4(vec3(color), 1.0);
}