/*
PixelSpirit - The Emperor
--------------------
Shader-a-day
Darien Brito, August 5 2017
*/

uniform vec2 u_resolution;

float box(vec2 st, float s) {
	float b = step(s, st.x) - step(1.0 - s, st.x);
	b *= step(s, st.y) - step(1.0 - s, st.y);
	return b;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(box(st, 0.3));
	color -= box(st, 0.34);
	color += box(st, 0.45);
	gl_FragColor = vec4(vec3(color), 1.0);
}