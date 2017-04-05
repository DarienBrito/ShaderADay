/*
Ikeda-like-pattern
Simplified version to understand
--------------------
Shader-a-day
Darien Brito, April 5 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(in float x) {
	return fract(sin(x) * 1e4); 
}

float random(in vec2 st) {
	return fract(sin(dot(
		st, vec2(12.4515, 32.123))) * 1e4);
}

float noisePattern(float x, float freq, float t) {	   
	return step(.8, random(floor(x * freq)-floor(t)) ); // Not as easy as it looks like...

}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float cols = 2.0;
	float t = u_time * 30.0;

	if(fract(st.y * cols * 0.5) > 0.5){
		t *= -1.0;
	}
	float color = noisePattern(st.x, 20.0, t);
	gl_FragColor = vec4(vec3(color), 1.0);
}