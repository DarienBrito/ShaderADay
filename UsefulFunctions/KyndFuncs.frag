/*-------------------------------------
A porting-tweaking of Kynd's Shaping Functions
Darien Brito, 2017

http://www.flickr.com/photos/kynd/9546075099/

There's a file in grapher in the repository
that shows these functios as well (kynd1)
--------------------------------------*/

#define PI 3.141592
uniform vec2 u_resolution;
uniform float u_time;

//-------- Tools ----------//
float plotter(vec2 st, float x) {
	return 	smoothstep(x - 0.01, x, st.y) -
			smoothstep(x, x + 0.01, st.y);
}

float sineMovement(float s, float a) {
	return (sin(PI + (u_time * s)) * 0.5 + 0.5) * a; // From 0 to a
}

//-------- Functions----------// (mapped to 0 - 1)

float shapingOne(float x, float e) {
	return 1.0 - pow(abs((x * 2.0 )- 1.0), e); // Mapped to 0.0 - 1.0
}

float shapingTwo(float x, float e, float f) {
	return pow(cos(((PI * x) * f) - PI / 2.0), e);
}

float shapingThree(float x, float e, float f) {
	return 1.0 - pow(abs(sin(((PI * x) * f) + (PI * 0.5))), e);
} 

float shapingFour(float x, float e, float f) {
	// This one is not exactly right but I like mine!
	return pow(min(cos(((PI * x) - (PI * 0.5)) * f), 1.0 - abs(x)), e);
}

float shapingFive(float x, float e) {
	return 1.0 - pow(max(0.1, abs((2.0 * PI * x) - PI) - 2.0), e);
}

//-------- Main ----------//
void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	
	// Try the functions
	float y = shapingOne(st.x, sineMovement(1.0, 1.0));
	//float y = shapingTwo(st.x, sineMovement(1.0, 3.5), 2.0); // 2 periods
	//float y = shapingThree(st.x , sineMovement(1.0, 0.5), 3.0); // 3 periods
	//float y = shapingFour(st.x, sineMovement(1.0, 0.5), 3.0); // interesting on many periods
	//float y = shapingFive(st.x, sineMovement(1.0, 0.6));

	vec3 color = vec3(y);
	float p = plotter(st, y);
	color = (1.0 - p) * color + (p * vec3(0.0, 1.0, 0.0));
	gl_FragColor = vec4(vec3(color), 1.0);
}