#ifdef GL_ES
precision mediump float
#endif 

#define PI 3.141592
#define TWO_PI 6.283184

uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution; // Normalized
	/* A 5hz normalized sinewave with phase being modulated by time
	
	If we want to see waves of any of these 2 colors, equivalent to the 
	hz input, then we then have to use TWO_PI (2 periods) 
	i.e hz = 5.0 results in 5 black waves and 5 white waves (10 waves), 
	because obviously we oscillate between black and white at that rate.
	*/
	float hz = 5.0;
	float x = sin((st.x * TWO_PI) * hz + u_time) * 0.5 + 0.5;
	float y = smoothstep(x - 0.01, x + 0.01, st.y);
	vec3 color = vec3(y); 	 	
	gl_FragColor = vec4(color, 1.0);
}
