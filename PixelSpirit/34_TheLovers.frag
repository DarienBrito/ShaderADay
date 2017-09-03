/*
The Lovers
--------------------
Shader-a-day
Darien Brito, 27 August, 2017
*/


#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;

	/*
	This information is useful to make the heart:
	https://blog.demofox.org/2013/10/12/converting-to-and-from-polar-spherical-coordinates-made-easy/

	Polar coordinates have two components: 
	– a distance 
	- an angle 
	and represent a point in 2d space.
	The distance is called the radial coordinate, or the radius 
	and the angle is called the angular coordinate or polar angle.
	*/

float heart(vec2 st) {

	// We need to map from cartesian to polar to be able to do the heart
	st = st + vec2(0., 0.1); // Center our heart
	float angle = atan(st.y, st.x); // polar angle
	float r = length(st) * 4.; // radial coordinate
	// so now that we can get our direction vector, 
	// we just need to multiply it by the radius. 
	// So… to convert from polar to rectangular (cartesian) coordinates, you do this:
	float x = cos(angle) * r; 
	float y = sin(angle) * r; 
	// Now we can draw a heart like:
	float sx = 0.6;
	float sy = 1.1;
	return x*x + pow(y*sy - sqrt(abs(x*sx)), 2.) - 1.;
}

float stroke(float x, float s, float w) {
	float d = 	step(s, x+w * .5) - 
				step(s, x-w * .5);
	return clamp(d, 0., 1.);
}

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s-0.001, s, d);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= vec2(0.5, 0.5); 
	float color = 1.0 - step(0.25, heart(st));
	color *= 1.0 - shape(st, 3, 0.05);
	color += shape(st, 3, 0.04);
	gl_FragColor = vec4(vec3(color), 1.0);
}