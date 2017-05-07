/*
Noise Experiments
--------------------
Shader-a-day
Darien Brito, 9 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
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
	vec2 q = st - 0.5;

	float a = atan(q.y, q.x);
	float pos = cos(gradientNoise(st * 10.0) * 4.9);
	float freq = 40.0;
	pos += sin(a * freq + u_time) * 0.25;
	pos = pow(pos, 0.5);

	vec3 color = 1.0 - vec3(pos, pos * sin(u_time)*.5+.5, pos * cos(u_time)*.5+.5);
	gl_FragColor = vec4(color, 1.0);
}