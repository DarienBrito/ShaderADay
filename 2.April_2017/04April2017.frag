/*
Truchet Tiles
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 4, April, 2017
*/

#define PI 3.14159265358979
uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate2d(vec2 st, float angle) {
	st -= vec2(0.5);
	st *= mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
	st += vec2(0.5);
	return st;
}

vec2 tile(vec2 st, vec2 dim) {
	return fract(st * dim);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st = tile(st, vec2(2.0));

	st *= 4.0; // inner tiling
	
	// Is crucial to understand this fully:
	// Nice clever trick.
	float index = 0.0;
	index += step(1.0, mod(st.x, 2.0)); // get 0 or 1 in X
	index += step(1.0, mod(st.y, 2.0)) * 2.0; // Get 2, 3 ----> 0 + 0, 1 + 0, 0 + 2, 2 + 1

	/*
	0 | 1
	-----
	2 | 3
	*/

	st = fract(st);

	float speed = 0.25;
	if(index == 1.0) {
		st = rotate2d(st, PI * 0.5 + (u_time * speed));
	} else if (index == 2.0) {
		st = rotate2d(st, PI * -0.5 + (u_time * speed));
	} else if (index == 3.0) {
		st = rotate2d(st, PI + (u_time * speed));
	} else {
		st = rotate2d(st, (u_time * speed));
	}


	st = tile(st, vec2(2.0, 2.0));
	float color = smoothstep(st.x, st.x + 0.01, st.y);

	gl_FragColor = vec4(vec3(color), 1.0);
}