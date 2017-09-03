/*
Pixel Spirit - The Tower
--------------------
Shader-a-day
Darien Brito, 6 August 2017
*/

uniform vec2 u_resolution;

float line(float axis, float s) {
	return step(0.5 - s, axis) - step(0.5 + s, axis);
}

float rect(vec2 st, vec2 size){
	float r = step(0.5 - size.x, st.x) - step(0.5 + size.x, st.x); 
	r *= step(0.5 - size.y, st.y) - step(0.5 + size.y, st.y); 
	return r;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 q = st - 0.25;
	float l = line(q.x + q.y, 0.01);
	float r = rect(st, vec2(0.1, 0.25));
	float color = abs(l - r); 
	gl_FragColor = vec4(vec3(color), 1.0);
}

