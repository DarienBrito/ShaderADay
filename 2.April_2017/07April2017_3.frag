/*
Noisy Pattern	
--------------------
Shader-a-day
Darien Brito, 7 April 2017 
*/

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWOPI 6.283185307178

float hash(float x) {
	return fract(sin(x) * 105364.0);
}

float random2D(vec2 st){
	return fract(sin(dot(st, vec2(12.5151, 30.4185))) * 43363.0);
}

float noise(vec2 st) {
	//Get integer and floating parts
	vec2 i = floor(st);
	vec2 f = fract(st);

	// Design the grid to convert from 1D to 2D
	float a = random2D(i); //Bottom left
	float b = random2D(i + vec2(1.0, 0.0)); //Bottom right
	float c = random2D(i + vec2(0.0, 1.0)); //Top Left
	float d = random2D(i + vec2(1.0, 1.0)); //Top Right

	// Get the Hermite function
	vec2 h = f * f * (3.0 - 2.0 * f);
	// Spread the noise bilinearly
	return 	mix(a, b, h.x) +  
			(c - a) * h.y * (1.0 - h.x) + 
			(d - b) * h.x * h.y;
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;

	float zoom = sin(u_time * 0.5) * 200.0 + 210.0; // 10-410 range
	
	// Create shape
	float sides = 3.0;
	float uv = length(st * zoom);
	uv += sin(atan(st.y, st.x) * sides + u_time) * TWOPI;
	vec2 pos = vec2(uv * rotate2d(u_time * 0.01));

	float n = noise(pos + u_time);
	n = pow(n, 2.0); //Sharpen blacks

	vec3 color = vec3(n);
	gl_FragColor = vec4(color, 1.0);
}