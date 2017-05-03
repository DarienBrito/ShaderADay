/*
Recapitulation (patterns)
--------------------
Shader-a-day
Darien Brito, May 1 2017
*/

#define PI 3.1415926589

uniform vec2 u_resolution;
uniform float u_time;

vec2 tile(vec2 st, float a) {
	return fract(st * a);
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
	st = tile(st, 3.0);
	st -= vec2(0.5);

	float c = length(st);
	float a = atan(st.y, st.x);
	float sides = 10.0;
	c += sin(a * sides +  PI * 0.5) * 0.3;
	

	c = smoothstep(0.4, doubleCubicSeatWithLinearBlend(cos(u_time), 0.4, 0.7) * 0.2 + 0.5, c);
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);
}

