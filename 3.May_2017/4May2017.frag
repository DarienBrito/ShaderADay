/*
Remembering transforms
--------------------
Shader-a-day
Darien Brito, May 4 2017
*/


#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;
uniform float u_time;

float shape(vec2 st, int numSides) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(0.4, 0.41, d);
}

mat2 scale2d(float size) {
	return mat2(size, 0,
				0, size);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float doubleCubicSeatWithLinearBlend (float x, float a, float b){
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  b = 1.0 - b; //reverse for intelligibility.
  
  float y = 0.0;
  if (x<=a){
    y = b*x + (1.0-b)*a*(1.0-pow(1.0-x/a, 3.0));
  } else {
    y = b*x + (1.0-b)*(a + (1.0-a)*pow((x-a)/(1.0-a), 3.0));
  }
  return y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;
	st *= rotate2d(u_time * -1.0);

	// This is just a function to be used by the scale matrix
	float sineMov = sin(u_time * 0.5) * 0.25;
	float maxSize = 4.0;
	float a = maxSize / 0.5;
	float s = doubleCubicSeatWithLinearBlend(sin(u_time * 0.5) * a, 0.25, 0.75 * sineMov);
	st *= scale2d(s);
	float c = shape(st, 3);

	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}