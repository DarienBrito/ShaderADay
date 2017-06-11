uniform float uTime;

vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(1210.3,303.9)),dot(p,vec2(909.12,1030.3))); return fract(sin(p)*31337.7); }

vec3 voronoi( vec2 p )
{
    vec2 gridP = floor(p);
    vec2 fracP = fract(p);

	vec3 result = vec3( 8 );
	float totalDistance = 0.;
    for(int x = -1; x <= 1; x++) {
		for(int y = -1; y <= 1; y++) {
			vec2 offset = vec2(float(x), float(y));
			vec2 gridRnd = hash( gridP + offset );
			vec2 rnd = (offset - fracP) + .5 + (0.5 * sin((gridRnd + uTime * .05) * 42.12));
			float distance = dot(rnd, rnd);
			if (distance < result.x) {
				result = vec3(distance, rnd);
				totalDistance = dot(rnd-fracP, rnd-fracP);
			}
		}
	}
	return vec3(
		result.x,
		sqrt(result.y*result.y + result.z * result.z),
		totalDistance
	);
}

out vec4 fragColor;
void main()
{
	vec3 vor = voronoi(vUV.st*10.);
	vec3 color = vec3(0.5 + 0.5*cos( vor.y*5. + vec3(0,0,-6.) ));	
	color *= clamp(1.0 - 0.4 * vor.x, 0, 1);
	color -= (1.0 - smoothstep(0, 0.01, vor.x));
	color.rbg += 1.-smoothstep(0, 0.005, vor.x);
	
	fragColor = vec4(color,1);
}
	