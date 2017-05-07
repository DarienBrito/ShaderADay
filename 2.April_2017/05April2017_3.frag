/*
Random 2D
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 5 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x) {
	return fract(sin(x) * 10000.0);
}

float random2D(vec2 st) {
	return fract(sin(dot(st, 
		vec2(122.12, 31.311))) * 10212.43 );
}

vec2 truchetPattern(in vec2 st, in float index) {
	index = fract(((index - 0.5) * 2.0));
	if (index > 0.75) {
		st = vec2(1.0) - st;
	} else if (index > 0.5) {
		st = vec2(1.0 - st.x, st.y);
	} else if (index > 0.25) {
		st = 1.0 - vec2(1.0 - st.x, st.y);
	}
	return st;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st *= 10.0;
	vec2 iPos = floor(st);
	vec2 fPos = fract(st);
	vec2 tile = truchetPattern(fPos, random2D(iPos));
	float color = 	smoothstep(tile.x - 0.1, tile.x, tile.y) -
					smoothstep(tile.x, tile.x + 0.1, tile.y);
	gl_FragColor = vec4(vec3(color), 1.0);
}