// Check for mobile devices
#ifdef GL_ES
precision mediump float
#endif

#define PI 3.14159265

uniform vec2 u_resolution; 
uniform float u_time;

float sinewave(float axis, float freq, float phase, float amp, float add) {
	float c = (sin((axis * freq) + phase) * amp) + add;
	return c;
}

void main() {
	float freq = 80.0;
	vec2 st = gl_FragCoord.xy/u_resolution; //normalize
	float color = sinewave(st.x, freq, 0.0, 0.5, 0.5);
 	color += sinewave(st.y, freq, u_time * 12.0, 0.5, 0.0);
 	gl_FragColor = vec4(0.0, 0.0, color, 1.0);
}