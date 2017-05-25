/*
Not much time to do a proper shader!
Here a random stroboscopic light, is all 
I had time to do this day :P
-----------------------		
Shader-a-day
Darien Brito, 24 May, 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

float hash(float x) {
	return fract(sin(x) * 1e4);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(hash(u_time * 0.1));
	gl_FragColor = vec4(color, 1.0);
}