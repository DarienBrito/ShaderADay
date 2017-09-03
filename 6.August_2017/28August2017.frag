/*
The magician
--------------------
Shader-a-day
Darien Brito, August 28 2017

THIS ONE WAS VERY HARD TO GET, so I had to
look how to make the switching of the overlay...
*/

uniform vec2 u_resolution;

float stroke(float x, float s, float w) {
	float d = 	smoothstep(s, s+0.001, x+w * .5) - 
				smoothstep(s, s+0.001, x-w * .5);
	return clamp(d, 0., 1.);
}

float circle(vec2 st) {
	return length(st - 0.5);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float color = 0.;
	float dif = .1;
	vec2 off = vec2(0.15, 0.);
	float bold = 0.04;
	// switch mixing mode (had to look at this!)
	st.x = mix(st.x, 1. - st.x, step(0.5, st.y));
	// masks
	float c1 = circle(st + off);
	float c2 = circle(st - off);
	// ops
	color += stroke(c1, 0.25, bold);
	color *= 1.-stroke(c2, 0.25, bold * 2.);
	color += stroke(c2, 0.25, bold);

	gl_FragColor = vec4(vec3(color), 1.0);
}