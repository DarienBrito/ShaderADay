/*
2D noise
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 7 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x){
	return fract(sin(x) * 10273.0);
} 

float random(vec2 st){
	return fract(sin(dot(st, vec2(12.5125, 42.55125))) * 107264.0);
}

float box(in vec2 st, in vec2 size) {
	size = vec2(0.5) - size * 0.5;
	vec2 uv = smoothstep(size, size + 0.001, st);
	uv *= smoothstep(size, size + 0.001, 1.0 - st);
	return uv.x * uv.y;
}

float noise2D(vec2 st) {
	// Take integer and fractional parts of the UV
	vec2 iPart = floor(st);
	vec2 fPart = fract(st);
	// Create the four corners of the canvas
	float a = random(iPart);
	float b = random(iPart + vec2(1.0, 0.0));
	float c = random(iPart + vec2(0.0, 1.0));
	float d = random(iPart + vec2(1.0, 1.0));
	// The cubic interpolation (a curve)
	vec2 u = fPart * fPart * (3.0 - 2.0 * fPart); 
	// return noise!
	// We use the corners of our canvas to diseminate our values
	return 	mix(a, b, u.x) + 
			(c - a) * u.y * (1.0 - u.x) +
			(d - b) * u.x * u.y;
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(0.0);

	vec2 pos = vec2(st * 5.0 + vec2(0.0, u_time));
	//color = vec3(box(st, vec2(noise2D(pos))));
	color = vec3(noise2D(pos));
	gl_FragColor = vec4(color, 1.0);
}