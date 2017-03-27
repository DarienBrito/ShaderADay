uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359
#define HALF_PI 1.570796326795
#define TWOPI 6.28318530718

float shape(vec2 st, int numSides, float size) {
	float a = atan(st.y, st.x) + (PI * 0.5);
	float r = TWOPI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(size, size + 0.01, d);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	//st = st * 2.0 - 1.0;
	st *= 3.0;
	st = fract(st);
	st = st - 0.5;

	float color = shape(st, 4, 0.3);
	float index = floor(st.x); // Get index? Would this work?

	if(int(index) > 1) {
		color *= 0.0;
	} else{
		color *= 1.0;
	}

	gl_FragColor = vec4(vec3(color), 1.0);
}