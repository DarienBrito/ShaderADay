/*
Ray marching 101
from a tutorial by xdPixel
Adding normals and shading
See "CalculatingVectors.py" for 
a Python implementation of the calculations involved for 
20 arbitrary position vectors... 
--------------------
Shader-a-day
Darien Brito, 8 May 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float scene(vec3 p) {
	return sphere(p, 3.0);
}

vec3 getNormal( vec3 p ){
	vec3 e = vec3( 0.001, 0.00, 0.00 );
	float deltaX = scene( p + e.xyy ) - scene( p - e.xyy );
	float deltaY = scene( p + e.yxy ) - scene( p - e.yxy );
	float deltaZ = scene( p + e.yyx ) - scene( p - e.yyx );
	return normalize( vec3( deltaX, deltaY, deltaZ ) );    
}

// float trace( vec3 origin, vec3 direction, out vec3 p ) {
// 	float totalDistanceTraveled = 0.0;
// 	for( int i=0; i <32; ++i) {
// 		p = origin + direction * totalDistanceTraveled;
// 		float distanceFromPointOnRayToClosestObjectInScene = scene( p );
// 		totalDistanceTraveled += distanceFromPointOnRayToClosestObjectInScene;
// 		if( distanceFromPointOnRayToClosestObjectInScene < 0.0001 ){
// 			break; 
// 		}
// 		if( totalDistanceTraveled > 10000.0 ) {
// 			totalDistanceTraveled = 0.0000; 
// 			break; 
// 		}
// 	}
// 	return totalDistanceTraveled;
// }

float trace(vec3 origin, vec3 direction, out vec3 p) {
	float currentDistance = 0.0;
	for(int i = 0; i < 32; ++i) {
		// This is important, p is declared outside this function
		// and its value is stored there so we can use the value of
		// p for lighting later...
		p = origin + (direction * currentDistance); 
		float distanceToObj = scene(p);
		currentDistance += distanceToObj;
		// Check if intersection will happen...
		if(distanceToObj < 0.0001) {
			break;
		}
		// Check if we are marching to emptiness...
		if(currentDistance > 10000.0){
			currentDistance = 0.0;
			break;
		}
	}
	return currentDistance;
}

// Standard Blinn lighting model.
// This model computes the diffuse and specular components of the final surface color.
vec3 calculateLighting(vec3 pointOnSurface, vec3 surfaceNormal, vec3 lightPosition, vec3 cameraPosition)
{
	vec3 fromPointToLight = normalize(lightPosition - pointOnSurface);
	float diffuseStrength = clamp( dot( surfaceNormal, fromPointToLight ), 0.0, 1.0 );
	vec3 diffuseColor = diffuseStrength * vec3( 1.0, 0.0, 0.0 ); // Here the color
	vec3 reflectedLightVector = normalize( reflect( -fromPointToLight, surfaceNormal ) );
	vec3 fromPointToCamera = normalize( cameraPosition - pointOnSurface );
	float specularStrength = pow( clamp( dot(reflectedLightVector, fromPointToCamera), 0.0, 1.0), 10.0);
	// Ensure that there is no specular lighting when there is no diffuse lighting.
	specularStrength = min( diffuseStrength, specularStrength );
	vec3 specularColor = specularStrength * vec3( 1.0 );
	vec3 finalColor = diffuseColor + specularColor;
	return finalColor;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st.x  *= u_resolution.x/u_resolution.y; 
	vec3 cameraPos = vec3(0.0, 0.0, -10.0);
	vec3 cameraDir = normalize(vec3(st.x, st.y, 1.0));
	vec3 pointOnSurface; // We use this to store the value calculated in the tracing func
	float distanceToClosestPointInScene = trace(cameraPos, cameraDir, pointOnSurface);

	vec3 color = vec3(0.0);
	// Shade it
	if(distanceToClosestPointInScene > 0.0) {
		// Move our light around on both the x and y axis.
		// (nice trick to specify movement by range instead of doing the math in our heads)
        float lx = mix( -4.5, 4.5, cos(u_time) * 0.5 + 0.5);
        float ly = 3.0 + mix( -1.5, 1.5, sin(u_time * 1.3) * 0.5 + 0.5);
		//float lightRadius = 20.0;
//		vec3 lightPosition = vec3(cos(u_time) * lightRadius, sin(u_time) * lightRadius, -10.0);
		vec3 lightPosition = vec3(lx, ly, -10.0);
		vec3 surfaceNormal = getNormal(pointOnSurface);
		color = calculateLighting(pointOnSurface, surfaceNormal, lightPosition, cameraPos);
	}

	gl_FragColor = vec4(color, 1.0);
}