/*-------------------------------------
A porting of Golan Levin's functions
Polynomial Shaping Functions
Darien Brito, 2017

A collection of polynomial functions for shaping, 
tweening, and easing signals in the range [0...1]. 

Functions include:

Blinn-Wyvill Approximation to the Raised Inverted Cosine
Double-Cubic Seat
Double-Cubic Seat with Linear Blend
Double-Odd-Polynomial Seat
Symmetric Double-Polynomial Sigmoids
Quadratic Through a Given Point

http://www.flong.com/texts/code/shapers_poly/
--------------------------------------*/

uniform vec2 u_resolution;
uniform float u_time;

// Plotter
float plotter(vec2 st, float x) {
	return 	smoothstep(x - 0.01, x, st.y) -
			smoothstep(x, x + 0.01, st.y);
}

//Blinn-Wyvill Approximation to the Raised Inverted Cosine
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

float doubleCubicSeat (float x, float a, float b){
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  float y = 0.0;
  if (x <= a){
    y = b - b*pow(1.0-x/a, 3.0);
  } else {
    y = b + (1.0-b)*pow((x-a)/(1.0-a), 3.0);
  }
  return y;
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

float doubleOddPolynomialSeat (float x, float a, float b, float n){
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 

  float p = 2.0*n + 1.0;
  float y = 0.0;
  if (x <= a){
    y = b - b*pow(1.0-x/a, p);
  } else {
    y = b + (1.0-b)*pow((x-a)/(1.0-a), p);
  }
  return y;
}

float doublePolynomialSigmoid (float x, float a, float b, float n){
  float y = 0.0;
  if (mod(n, 2.0) == 0.0){ 
    // even polynomial
    if (x<=0.5){
      y = pow(2.0*x, n)/2.0;
    } else {
      y = 1.0 - pow(2.0*(x-1.0), n)/2.0;
    }
  } 
  else { 
    // odd polynomial
    if (x<=0.5){
      y = pow(2.0*x, n)/2.0;
    } else {
      y = 1.0 + pow(2.0*(x-1.0), n)/2.0;
    }
  }

  return y;
}

float quadraticThroughAGivenPoint (float x, float a, float b){

  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  float A = (1.0-b)/(1.0-a) - (b/a);
  float B = (A*(a*a)-b)/a;
  float y = A*(x*x) - B*(x);
  y = min(1.0,max(0.0,y)); 
  
  return y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float sineMov = sin(u_time) * 0.5 + 0.5;
	
	// Test functions:

	//float y = blinnWyvillCosineApproximation(st.x);
	//float y = doubleCubicSeat(st.x, 0.4, 0.7 * sineMov);
	//float y = doubleCubicSeatWithLinearBlend(st.x, 0.4, 0.7 * sineMov);
	//float y = doubleOddPolynomialSeat(st.x, 0.4, 0.7, sineMov);
	//float y = doublePolynomialSigmoid(st.x, 0.9, 0.7, sineMov * 10.0);
	float y = quadraticThroughAGivenPoint(st.x, 0.5, sineMov);

	float p = plotter(st, y);
	vec3 color = vec3(y);
	color = ((1.0 - p) * color) + (p * vec3(1.0, 0.0, 0.0));
	gl_FragColor = vec4(vec3(color), 1.0);
}