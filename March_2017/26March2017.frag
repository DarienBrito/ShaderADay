/*
Practising Matrixes
--------------------
Shader-a-day
Darien Brito, 26 March, 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

mat2 scale2d(float scale) {
	return mat2(scale, 0,
				0, scale);	
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	//Translate world to range of -0.5, 0.5
	st -= vec2(0.5);

	// Scale it
	st *= scale2d(1.5);

	// Translate to whatever position if needed
	st += vec2(0.0, 0.0);

	// Rotate it
	st *= rotate2d(sin(u_time) * PI);

	// Spiral 
	float angle = atan(st.y, st.x);
	float l = (length(st) * 4.0) + 0.1 * angle;
	float color = smoothstep(0.4,0.6, sin(l * 10.0));

	// Output
	gl_FragColor = vec4(vec3(color), 1.0);
}