/*
Re-capitulation of shaping functions
--------------------
Shader-a-day
Darien Brito, May5 2017
*/

uniform vec2 u_resolution;
uniform float u_time;
#define OCTAVES 5

float quadraticBezier (float x, vec2 a){
  // adapted from BEZMATH.PS (1993)
  // by Don Lancaster, SYNERGETICS Inc. 
  // http://www.tinaja.com/text/bezmath.html

  float epsilon = 0.00001;
  a.x = clamp(a.x,0.0,1.0); 
  a.y = clamp(a.y,0.0,1.0); 
  if (a.x == 0.5){
    a += epsilon;
  }
  
  // solve t from x (an inverse operation)
  float om2a = 1.0 - 2.0 * a.x;
  float t = (sqrt(a.x*a.x + om2a*x) - a.x)/om2a;
  float y = (1.0-2.0*a.y)*(t*t) + (2.0*a.y)*t;
  return y;
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 st) {
  float n = 0.0;
  float a = 0.5;
  float s = 2.0;
  for(int i = 0; i < OCTAVES; i++) {
    n += snoise(st) * a;
    st *= s;
    a *= 0.5;
  }
  return n;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution;
  st.x *= u_resolution.x/u_resolution.y; // For correct resolution scaling

  // Mirroring
  st.x = (st.x > 0.5) ? st.x : 1.0 - st.x; // Reflect if x > 0.5
  st.y = (st.y > 0.5) ? st.y : 1.0 - st.y; // Reflect if x > 0.5

  // Displace our coordinate map
  float dScale = 2.0; // Displacement scale for coordinate map
  st.x += fbm(st * dScale + vec2(0.0));
  st.y += fbm(st * dScale + vec2(5.0, 2.3)); 

  // Apply a shaping function to color our screen
  float xRange = 1.0/u_resolution.x; // get normalized x range;
  vec2 cp = vec2(cos(u_time), sin(u_time)) * 0.5 + 0.5;
  float l = quadraticBezier(st.x, cp);
  float color = smoothstep(l, l + xRange, st.y); // Map the bezier curve along y

  gl_FragColor = vec4(vec3(color), 1.0);
}