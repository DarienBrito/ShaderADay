/*
2D noise
Messing around...
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

// Based on Morgan Mcguire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise2D(vec2 st) {
	// Take integer and fractional parts of the UV
	vec2 iPart = floor(st);
	vec2 fPart = fract(st);
	// Create the four corners of the canvas
	float a = random(iPart);
	float b = random(iPart + vec2(1.0, 0.0));
	float c = random(iPart + vec2(0.0, 1.0));
	float d = random(iPart + vec2(1.0, 1.0));

	// Hermite Curve.
    // The formula 3f^2 - 2f^3 generates an S curve between 0.0 and 1.0.
    // The cubic interpolation (a curve, same as smoothstep)
	// See how this interpolation curve affects the image. MAGICAL!
	vec2 u = fPart * fPart * ((sin(u_time) * 1.5 + 1.5) - 2.0 * fPart); 
	
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
	float zoom = 10.0;
	st -= vec2(0.5);
	
	vec2 pos = vec2(st * zoom);
	pos *= rotate2d(noise2D(pos + vec2(0.0,u_time)));
	float n = noise2D(sin(pos + u_time) * zoom + zoom); //0.0 to 8.0

	color = vec3(n);
	gl_FragColor = vec4(color, 1.0);

}