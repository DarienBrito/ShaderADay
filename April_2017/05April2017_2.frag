/*
2D random
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 5 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

// dot() returns the dot product of 2 vectors:
// a · b = ax × bx + ay × by
// or
// a · b = |a| × |b| × cos(θ)
// Both operations lead to the same result
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st *= 100.0;
	vec2 i = floor(st); // Get integer parts 
	vec2 f = fract(st); // Get fractional parts
	
	float color = random(i);
	gl_FragColor = vec4(vec3(color), 1.0);
}
