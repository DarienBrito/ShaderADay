/*

17 March, 2017
---------------
Flashy light, practising mix and distance

*/

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14156592

float rectangleWave(float x) {
	float val = 0.0;
	if (x > 0.0) {
		val = 1.0;
	} else {
		val = 0.0;
	}
	return val;
}

float shapingOne(float x, float e) {
	return 1.0 - pow(abs((sin(x * PI * 1.0) * 2.0 )- 1.0), e); // Mapped to 0.0 - 1.0
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	vec3 colorA = vec3(0.2, 0.67, 0.89);
	vec3 colorB = vec3(0.67, 0.55, 0.33); 
	
	// Try mixing it in diferent ways

	//float pct = sin(abs(u_time));
	//float pct = abs(sin(u_time * PI));
	//float pct = rectangleWave(sin(u_time * PI * 2.0));
	float pct = shapingOne(u_time, 1.0);

	// Mix colors based on a percentage
	vec3 color = mix(colorA, colorB, pct);
	color *=  1.0 - distance(st, vec2(0.5, 0.5));
	color = smoothstep(0.25, 0.75, color);
	gl_FragColor = vec4(color, 1.0);
}