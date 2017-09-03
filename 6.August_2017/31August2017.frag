/*
The Chariot
--------------------
Shader-a-day
Darien Brito, August 31, 2017

Fuc*ing hell! This was difficul AF!,
could not do it so had to look. 
There's a neat compositing trick in this one that implies cutting the 
screen in 4 parts that then get layered over the final image to produce the 
desired result. Pretty clever!
*/

uniform vec2 u_resolution;
#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

float rect(vec2 st, vec2 size) {
	// This requires a normalized bipolar mapping of the coordinat system
	// i.e st *2. -1. or -0.5;
	return max(abs(st.x/size.x), abs(st.y/size.y));
}

vec2 rotate2d(vec2 st, float angle) {
	return st * mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float stroke(float x, float s, float w) {
	float d = 	smoothstep(s, s+0.001, x+w * .5) - 
				smoothstep(s, s+0.001, x-w * .5);
	return clamp(d, 0., 1.);
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	float s1 = rect(rotate2d((st - 0.5) , PI * 0.25), vec2(0.25));
	float s2 = rect(st - 0.5, vec2(0.25));
	float color = 0.;
	float size = 0.7;
	float bold = 0.1;

	float inv = step(.5, (st.x+st.y)*.5); // This creates a diagonal b/w
	inv = mix(inv, 1.-inv, step(.5,.5+(st.x-st.y)*.5)); // this mirrors that in the y and x axis

	// Comment these lines to find out the trick:
	color += stroke(s1, size, bold);
	color *= 1. - stroke(s2, size, bold * 2.);
	color += stroke(s2, size, bold);

	// Comment these lines to get ride of the intertwined effect
	float bridges = mix(s1, s2, inv); // This remixes the shapes in the inverted axises
	color *= 1. - stroke(bridges, size, bold * 2.); // This creates a mask
	color += stroke(bridges, size, bold); // This overdraws the selected areas over the image

	gl_FragColor = vec4(vec3(color), 1.0);
}