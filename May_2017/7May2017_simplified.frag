/*
Studying these beautiful shader by Silexars
https://www.shadertoy.com/view/XsXXDn
http://www.pouet.net/prod.php?which=57245
--------------------
Shader-a-day
Darien Brito, 7 May 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st.x *= u_resolution.x/u_resolution.y;	
	vec2 uv = st; // Keep a copy of original coordinate system
	st -= 0.5; // Move st to center
	float l = length(st); // Get lengths(creates a circular gradient)
	// Modulate a sinewave with the abs of a sine 
	// See my grapher equation called "7May2017"
	// Or see the image transform_7May2017
	float transform = sin(u_time) * abs(sin(l * 10. - u_time * 2.));
	uv += st/l * transform;
	uv -= 0.5;
	vec3 color = vec3(length(uv));
	gl_FragColor = vec4(color, 1.0);

}