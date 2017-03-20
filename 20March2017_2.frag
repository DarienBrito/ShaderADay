uniform float u_time;
uniform vec2 u_resolution;

// Some kind of sunny b&W

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 c = st - vec2(0.5, 0.5);

	float o = length(c) * 1.2;	
	float freq = 8.0;
	o += 2.0 * cos(atan(c.y, c.x) * freq + (u_time * 2.0));

	float t = 1.0;
	float flower = smoothstep(t, t+0.001, o);
	
	float t2 = sin(u_time) * 0.01 + 0.15;
	float circle = 1.0 - smoothstep(t2, t2+0.001, length(c)); 

	vec3 color = vec3(flower + circle);
	gl_FragColor = vec4(color, 1.0);
}