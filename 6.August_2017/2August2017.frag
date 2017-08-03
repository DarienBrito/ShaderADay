/*
PixelSpirit - Temperance
--------------------
Shader-a-day
Darien Brito, August 4 2017
*/

#define PI 3.141592653589

uniform vec2 u_resolution;

float blinnWyvillCosineApproximation (float x){
  float x2 = x*x;
  float x4 = x2*x2;
  float x6 = x4*x2;
  
  float fa = ( 4.0/9.0);
  float fb = (17.0/9.0);
  float fc = (22.0/9.0);
  float y = fa*x6 - fb*x4 + fc*x2;
  return y;
}

float sineStrip(vec2 st, float d, float a, float o) {
	// d is width, a is amp, o is offset
	float dif = 0.03;
	float c = step(sin(st.y * PI*2.)*a  - d, st.x - o);
	c *= 1.0 - step(sin(st.y * PI*2.)*a + d, st.x - o);

	//float c = step(blinnWyvillCosineApproximation(1.0 - st.y) * 0.15  - d, st.x - o);
	//c *= 1.0 - step(blinnWyvillCosineApproximation(1.0 - st.y) * 0.15 + d, st.x - o)
	return c;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float w = 0.03;
	float a = 0.075;
	float c = 0.;
	float separation = 0.15;
	for(int i = 0; i < 3; i++) {
		c += sineStrip(st, w, a, 0.4 + float(i) * separation);
	}
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0); 
}
