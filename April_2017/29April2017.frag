/*
FBM composites (from a tutorial by Inigo Quilez)
https://www.youtube.com/watch?v=emjuqqyq_qc
--------------------
Shader-a-day
Darien Brito, April 29 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st) {
	return fract(sin(dot(st, vec2(15.13123, 45.56251))) * 45666.12);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	// Create grid to spread out our noise
	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	// Create our hermite cubic interpolation
	vec2 h = f * f * (3.0 - 2.0 * f);
	// Do our bilinear interpolation:
	return 	mix(a, b, h.x) + 
			(c - a) * h.y * (1.0 - h.x) +
			(d - b) * h.x * h.y;
}

//Rotation matrix proportional to the sides of a right triangle
mat2 m = mat2(0.8, 0.6, -0.6, 0.8); 

// A more detailed version of FBM
// Inigo makes this create some subtle enhancements to the fb,
float fbm(vec2 st) {
	float n = 0.0;
	n += noise(st) * 0.5000; st *= m*2.01;
	n += noise(st) * 0.2500; st *= m*2.02;
	n += noise(st) * 0.1250; st *= m*2.03;
	n += noise(st) * 0.0625; st *= m*2.04;
	n /= 0.9375; // Normalize to exactly match values
	return n;
}

void main() {
	// we need to transform to -1.0, 1.0 to get polar coordinates
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st.x *= u_resolution.x/u_resolution.y;
	float r = sqrt(dot(st,st)); // same as doing lenght() in a 0.0 to 1.0 coordinate system
	float a = atan(st.y, st.x); // Get polar coordiantes

	vec3 color = vec3(1.0);

	if(r < 0.8) {
		color = vec3(0.2, 0.3, 0.4);

		float f = fbm(st * 5.0);
		color = mix(color, vec3(0.2, 0.5, 0.4), f);

		f = fbm(vec2(r * 6.0, a * 20.0));
		color = mix(color, vec3(1.0), f);

		f = smoothstep(0.2, 0.25, r);
		color *= f;

	}



	gl_FragColor = vec4(color, 1.0);
}