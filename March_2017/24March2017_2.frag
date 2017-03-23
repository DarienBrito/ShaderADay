/*
Using distance fields
From "The book of shaders"
--------------------
Shader-a-day
Darien Brito, 24_mar_2017
*/

uniform float u_time;
uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	// get aspect right (use in case our canvas is not square)
	// if using glslViewer (where canvas is square) this line is not needed
	//st.x *= u_resolution.x/u_resolution.y; 

	// Initialize variables
	vec3 color = vec3(0.0);
	float d = 0.0;

	st = st * 2.0 - 1.0; // remap to -1 to 1
	// N x is -1 to 1, abs makes 2 copies of values from 0 to 1, from the total
	// Same for y. That's why we have now 4 "copies" of the same thing
	d = length( abs(st) - 0.3);
	
	// Create a squarish pattern (makes sense if you follow along step by step)
	//d = length( max(abs(st) - 0.3, 0.0));

	float n = 4.0;
	d = fract(d * n - u_time); // fractioning that into n pieces and animating

	// Create an outline
	//d = step(0.3, d) * step(d, 0.5);

	// Create a smoothed outline
	d = smoothstep(0.3, 0.4, d) * smoothstep(0.8, 0.9, d);

	gl_FragColor = vec4(vec3(d), 1.0);
}