/*
Pixel Spirit - Hope
--------------------
Shader-a-day
Darien Brito, 6 August 2017
*/

uniform vec2 u_resolution;

float circle(vec2 st, float r){
	return smoothstep(r, r + 0.002, length(st - .5));
}

float stripe(vec2 st) {
	return 1.0 - step(0.5, st.x + st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float c1 = (1.0 - circle(st + vec2(0.1, 0.0), 0.2));
	float c2 = 1.0 - circle(st + vec2(-0.1, 0.0), 0.2);
	float c = c1 * c2;
	float split = stripe(st - 0.25);
	float color = mix(c, 1.-c, split); // another way to mix/invert
	gl_FragColor = vec4(vec3(color), 1.0);
}