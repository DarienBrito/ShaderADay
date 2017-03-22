#ifdef GL_ES
precision mediump float
#endif 

#define PI 3.141592

uniform vec2 u_resolution;
uniform float u_time;

float plot(float theInput, float limit, float theStep) {
	return 	smoothstep(limit - theStep, limit + theStep, theInput);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution; // Normalized
	
	// Really understanding smoothstep:

	// The function takes a real number x as input and 
	// outputs 0 if x is less than or equal to the left edge, 
	// 1 if x is greater than or equal to the right edge, and smoothly 
	// interpolates between 0 and 1 otherwise

	// In other words:
	// Y is my input in this case
	// 0 if Y <= X - theStep
	// 1 if Y >= X + theStep
	// Interpolate anything in-between:

	vec3 color = vec3(plot(st.y, st.x, 0.001)); 	 	
	gl_FragColor = vec4(color, 1.0);
}