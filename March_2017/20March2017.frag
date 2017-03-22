uniform float u_time;
uniform vec2 u_resolution;

// Rework of Inigo Quilez excercise

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 c = st - vec2(0.5, 0.5);

	float o = length(c) * 1.2;	
	float freq = 8.0;
	o += 0.05 * cos(atan(c.y, c.x) * freq + (u_time * 2.0));

	// Flower
	float t = 0.3;
	float flower = smoothstep(t, t+0.001, o);
	
	// Inner circle
	float t2 = sin(u_time) * 0.0 + 0.1;
	float circle = 1.0 - smoothstep(t2, t2+0.001, length(c)); 

	// Stick
	float r = 0.02;
	r +=  exp(-80.0 * st.y);
	float stick = 1.0 - (1.0 - smoothstep(r, r + 0.001,  abs((c.x * 0.5) + sin(c.y) * 0.1))) * 
	(1.0 - smoothstep(0.35, 0.351, st.y)); ; // erase the upper part of it

	vec3 color = vec3((flower+circle) * stick);
	gl_FragColor = vec4(color, 1.0);
}