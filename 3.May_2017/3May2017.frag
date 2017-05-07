/*
Improvising something
--------------------
Shader-a-day
Darien Brito, May 3 2017
*/

#define PI 3.141592653589

uniform float u_time;
uniform vec2 u_resolution;

float square(in vec2 st, float size, float offsetX, float offsetY) {
	float c = step(size, st.x + offsetX) - step(1.0 - size, st.x + offsetX);
	c *= step(size, st.y + offsetY) - step(1.0 - size, st.y + offsetY);
	return c;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st = fract(st * 5.0);

	float xSplit = step(0.75, st.x);
	float ySplit = step(0.75, st.y);

	float c = square(st, 0.35, 
		cos(u_time * PI) * xSplit, 
		cos(u_time * PI + (PI * 0.5)) * ySplit);

	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}