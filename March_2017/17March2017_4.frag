/*

17 March, 2017
---------------
Excersise from "The book of Shaders"
- Can you make a rainbow?
- Create a colorful flag using step()

*/

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	// First of all, what is a rainbow? 
	// All the colors from red to violet...

	/*
	vec3 colorA = vec3(1.0, 0.0, 0.0); // Red
	vec3 colorB = vec3(0.43529411764706, 0.0, 1.0); //Violet
	//vec3 color = mix(colorA, colorB, abs(sin(u_time * PI)));

	vec3 color = vec3(0.0);
	color.r = (st.x * 0.57) + 0.43; // 0 - 1 need to make it 0.43 - 1 
	color.g = 0.0; // Green remains 0.0
	color.b = st.x;
	// How do I make all the other colors in between?
	color = smoothstep(0.0, 1.0, color);
	mmm.....
	*/

	// Ok, I've found a way! Not perfect, but close enough?
	vec3 color = vec3(0.0);
	color.r = sin(st.x * PI + (PI * 0.25));
	color.g = sin(st.x * PI);
	color.b = sin(st.x * PI - (PI * 0.5));
	color = smoothstep(0.0, 1.0, color);
	// The flag
	//color = step(PI * 0.25, color);

	gl_FragColor = vec4(color, 1.0);
}