/*
Iñigo Quilez  tutorial - palm tree excercise
https://www.youtube.com/watch?v=0ifChJ0nJfM
*/

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 q = st - vec2(0.4, 0.5);

	// Make a gradient between orange and yellow using y aixs. 
	// sqrt is there to push orange values further down and yellows up
	vec3 c = mix(vec3(1.0, 0.4, 0.2), vec3(1.0, 1.0, 0.4), sqrt(st.y));	

	float freq = 10.0;
	float phase = 1.0;
	float r = 0.12 + (0.11 * cos(atan(q.y, q.x) * freq + phase + 20.0 * q.x));

	// sharphen our circle
	c *= smoothstep(r, r + 0.001, length(q));

	r = 0.015;
	r += 0.005 * cos(100.0 * q.y);
	r += exp(-40.0 * st.y);
	// Here do the weird smmothstep operations to get rid of the part we dont need
	c *= 1.0 - (1.0 - smoothstep(r, r + 0.001, abs(q.x + -1.0 * sin(q.y * 2.0) * 0.3))) * (1.0 - smoothstep(0.5, 0.51, st.y));

	gl_FragColor = vec4(c, 1.0);
}