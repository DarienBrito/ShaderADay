/*
Matrices
--------------------
Shader-a-day
Darien Brito, 25, March, 2017
*/

// Translation by moving the whole coordinate system via vectors

#define PI 3.141592653
uniform float u_time;
uniform vec2 u_resolution;

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

mat2 scale2d(vec2 scale) {
	return mat2(scale.x, 0,
				0, scale.y);
}

float box(in vec2 st, in vec2 size) {
	size = vec2(0.5) - size * 0.5;
	vec2 uv = smoothstep(size, size + 0.001, st);
	uv *= smoothstep(size, size + 0.001, 1.0 - st);
	return uv.x * uv.y;
}

float cross(in vec2 st, in float size) {
	return box(st, vec2(0.5, 0.15) * size) + box(st, vec2(0.15, 0.5) * size);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	//Move space to 0.0 position as center (0.0, 1.0) - 0.5 = (-0.5, 0.5)
	// Hence, (0,0) becomes center
	st -= vec2(0.5); 
	
	//scale 
	st = scale2d(vec2(4.0)) * st;

	//rotate space
	st = rotate2d(sin(u_time) * PI) * st;
	//move it back to the original place, so from (-0.5, 0.5) to (0.0, 1.0)
	st += vec2(0.5);

//	vec2 translate = vec2(cos(u_time), sin(u_time));

	//st += translate * 0.25;

	float color = cross(st, 0.5);
	gl_FragColor = vec4(vec3(color), 1.0);
}



