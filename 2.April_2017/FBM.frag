/*
FBM 
In essence, FBM is a summation of noise 
on different octaves and amplitudes
--------------------
Shader-a-day
Darien Brito, 
*/

uniform vec2 u_resolution;
uniform float u_time;


float random(vec2 st) {
	return fract(sin(dot(st, vec2(31.1311,54.1451))) * 125151.0);
}

float noise(vec2 st) {
	vec2 f = fract(st);
	vec2 i = floor(st);
	vec2 h = f*f*(3.0 - 2.0 * f);

	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	return  mix(a, b, h.x) +
			(c - a) * h.y * (1.0 - h.x) +
			(d - b) * h.x * h.y;
}

// fbm is actually very simple! This is
// a dumb but very clear way of building it:
float fbmDumbClear(vec2 st) {
	float n = 0.0;
	float a = 0.5; //Amplitude
	n += noise(st) * a;
	
	st *= 2.0; // One octave higher
	a *= 0.5; // Lower amplitude (fractal)
	n += noise(st) * a; 
	
	st *= 2.0; // Two octaves higher
	a *= 0.5; // Lower amplitude (fractal)
	n += noise(st) * a;
	
	st *= 2.0; // 3 octaves higher
	a *= 0.5; // Lower amplitude (fractal)
	n += noise(st) * a;
	
	st *= 2.0; // 4 octaves higher
	a *= 0.5; // Lower amplitude (fractal)
	n += noise(st) * a;

	return n;
}

// This would be the compact version
float fbm(vec2 st) {
	float n = 0.0;
	float amp = 0.5;
	int octaves = 8;
	
	for (int i = 0; i < octaves; i++) {
		n += noise(st) * amp;
		st *= 2.0;
		amp *= 0.5;
	}

	return n;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st.x *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(fbm(st * 4.0));
	gl_FragColor = vec4(color, 1.0);
}