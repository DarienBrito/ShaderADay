/*
Re-visiting fractional part
based on The Book of Shaders
----------------------------
Shader-a-day
Darien Brito, 30, march 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float box(in vec2 st, in vec2 size) {
	size = vec2(0.5) - size * 0.5;
	vec2 uv = smoothstep(size, size + 0.001, st);
	uv *= smoothstep(size, size + 0.001, 1.0 - st);
	return uv.x * uv.y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	// Create tiles
	st *= vec2(5.0);
	// Create some row calculation here
	float i = mod(st.x, 2.0); // Check for even and odd rows
	// Check if even or odd (i is either 1 or 0)
	st.y += step(1.0, i) * 0.5; // offset y based on X information
	// That step is Equivalent to doing:
	// if(i > 1.0) { // Even, offset of 
	// 	st.y += 
	// } else // Odd
	// 	st.y += 0.0;
	st = fract(st);
	float c = box(st, vec2(0.9));
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}