/*
Shape modulated by noise
from "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, April 9, 2017
*/
uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float gradientNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
 	st -= 0.5;
    
    float r = length(st) * 2.0;
    float a = atan(st.y,st.x);
    float f = 0.15;
    f += sin(a * 50.0) * cos(gradientNoise(st + u_time * 0.2) * 3.0);
    float c = 1.-smoothstep(f,f+0.007,r);


	gl_FragColor = vec4(vec3(c), 1.0);
}