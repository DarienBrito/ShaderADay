/*
Constructive geometry
Understading signed distance functions
Creating more complex gemoetries from 
distance functions

from a tutorial by Jamie Wong
http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/
--------------------------------------

Shader-a-day
Darien Brito, 
*/

uniform vec2 u_resolution;
uniform float u_time;

#define TYPE 2 // Type of boolean operation for constructive geometries
#define STEPS 32 // Increasing the steps will sharpen the render
#define LOW_THRES 0.0001
#define HI_THRES 100.0
#define EPSILON 0.1

float intersectDist(float distA, float distB) {
    /*
        Ok, so what is going on here? 
        We check which one of the distances is larger
        The only way to get a negative number point (inside the shape)
        when we do max(distA, distB) is if both distances are negative, 
        or in other words, if they intersect!
        I made a diagram in my notebook (see caption intersectSDF)
    */
    return max(distA, distB);
}

float unionDist(float distA, float distB) {
    /*
        When we take the minimum instead, then we see that we will get 
        a negative value if both distances are negative or if we've got
        oposite signs (positive, negative), which in turn will render
        points that are smaller than the biggest geometry, that may not be
        represented by it, hence effectively gluing them together 
    */
    return min(distA, distB);
}

float differenceDist(float distA, float distB) {
    /*
        Alright, here we invert the coordinates of one of the bodies,
        so when it is negative it actually gets positive, effectively 
        cancelling the points of intersection inside the body! 
    */
    return max(distA, -distB);
}


float sphere(vec3 p, float radius) {
	return length(p) - radius;
}

//Cube, from a tutorial by Jamie Wong
//https://www.shadertoy.com/view/Xtd3z7
float cube(vec3 p) {
	// So if all components of d are negative, then p is inside the unit cube
	vec3 d = abs(p) - vec3(1.0, 1.0, 1.0);
	// Assuming p is inside the cube, how far is it from the surface?
    // Result will be negative or zero.

    // Ok, so we are just checking how far from 0 are we, the logic is
    // what's the largest number between d.y and d.y?
    // then what's the largest between that and d.x?
    // Finally, what's the smallest between that and 0.0? (-0.5 is < 0.0 for instance)
    // max in GLSL returns the greater of two values, 
    // So in practise we are just saying, if we are inside the cube,
    // we get a negative number, otherwise, we get 0.0!
	float insideDistance = min(max(d.x, max(d.y, d.z)), 0.0);

	// Assuming p is outside the cube, how far is it from the surface?
    // Result will be positive or zero.
    //float outsideDistance = length(max(d, 0.0));

	// Why does Wong add them in the return? Is not either one or the oner?
	// Let's check...     
    if(insideDistance < 0.0) {
    	return insideDistance;
    } else {
    	float outsideDistance = length(max(d, 0.0));
    	return outsideDistance;
    }
	// Indeed, that's the case. For clarity let's keep it like this,
	// although it is definitely more elegant to just add them as the
	// result is the same ;)
	//return outsideDistance
}

/**
 * Return a transform matrix that will transform a ray from view space
 * to world coordinates, given the eye point, the camera target, and an up vector.
 *
 * This assumes that the center of the camera is aligned with the negative z axis in
 * view space when calculating the ray marching direction. See rayDirection.
 */
mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
    // Based on gluLookAt man page
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f); // Remember the right hand rule
   	// https://en.wikipedia.org/wiki/Cross_product
    return mat4(
        vec4(s, 0.0),
        vec4(u, 0.0),
        vec4(-f, 0.0),
        vec4(0.0, 0.0, 0.0, 1)
    );
}

/*
    These scene functions are here for convenience, as each
    case of constructive geometry is modelled with 
    different parameters ;)
*/

float sceneintersect(vec3 p) {
    /*
        Things can get really interesting like this.
        We can model the shape by changin the scale of the points
        we pass to each geometry. Notice that I've made the radius of 
        the sphere 1.0, so the sizes are proportional. Scaling
        the result of the boolean operation gives also interesing results
    */
	float s = sphere(p * (1.0 - abs(sin(u_time) * 0.15)), 1.0);
	float c = cube(p * 1.1);
    float construct = intersectDist(s, c); 
	return construct;
}

float sceneUnion(vec3 p) {
    float s = sphere(p * (1.0 - abs(sin(u_time) * 0.15)), 1.0);
    float c = cube(p * 1.2);
    float construct = unionDist(s, c); 
    return construct;
}

float sceneDifference(vec3 p) {
    float s = sphere(p * 0.8, 1.0);
    float c = cube(p);
    float construct = differenceDist(c, s); 
    return construct;
}

float scene(vec3 p){
    if(TYPE == 0) {
            return sceneintersect(p);
        } else if (TYPE == 1) {
            return sceneUnion(p);
        } else {
            return sceneDifference(p);
        }   
}

float rayMarch(vec3 origin, vec3 direction, out vec3 p) {
	float depth = 0.0;
	// March along
	for(int i = 0; i < STEPS; i++) {
		p = origin + (depth * direction);
		float dist = scene(p);
		// Check if we are passed location of objects
		if(dist < LOW_THRES){
			break;
		}
		// Move along ray
		depth += dist;
		// Check if we are going to infinity...
		if(dist >= HI_THRES) {
			dist = 0.0;
			break;
		}
	}
	return depth;
}

/**
 * Using the gradient of the SDF, estimate the normal on the surface at point p.
 */
vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        scene(vec3(p.x + EPSILON, p.y, p.z)) - scene(vec3(p.x - EPSILON, p.y, p.z)),
        scene(vec3(p.x, p.y + EPSILON, p.z)) - scene(vec3(p.x, p.y - EPSILON, p.z)),
        scene(vec3(p.x, p.y, p.z  + EPSILON)) - scene(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

/**
 * Lighting contribution of a single point light source via Phong illumination.
 * 
 * The vec3 returned is the RGB color of the light's contribution.
 *
 * k_a: Ambient color
 * k_d: Diffuse color
 * k_s: Specular color
 * alpha: Shininess coefficient
 * p: position of point being lit
 * eye: the position of the camera
 * lightPos: the position of the light
 * lightIntensity: color/intensity of the light
 *
 * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
 */
vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 N = estimateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = dot(L, N);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        // Light not visible from this point on the surface
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        // Light reflection in opposite direction as viewer, apply only diffuse
        // component
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

/**
 * Lighting via Phong illumination.
 * 
 * The vec3 returned is the RGB color of that point after lighting is applied.
 * k_a: Ambient color
 * k_d: Diffuse color
 * k_s: Specular color
 * alpha: Shininess coefficient
 * p: position of point being lit
 * eye: the position of the camera
 *
 * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
 */
vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.4 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    vec3 light1Pos = vec3(cos(u_time) * 4.0,
                          sin(u_time) * 6.0,
                          -10.0);
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);
    
    vec3 light2Pos = vec3(cos(u_time + 3.14) * 4.0,
                          sin(u_time + 3.14) * 6.0,
                          -10.0);
    vec3 light2Intensity = vec3(0.1, 0.7, mix(0.8, 0.99, sin(u_time *0.5)));
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light2Pos,
                                  light2Intensity);    
    return color;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st.x *= u_resolution.x/u_resolution.y;
	// This is basically a "look at" implementation, 
	vec3 cameraPosition = vec3(cos(u_time) * 2.0, sin(u_time) * 2.0, sin(u_time) * 2.0 - 3.0);
	vec3 direction = normalize(vec3(st.xy, -1.0)); // Every point in the pixel grid
	//vec3 direction = normalize(vec3(st.xy / 2, -1.0));
	mat4 viewToWorld = viewMatrix(cameraPosition, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    vec3 worldDir = (viewToWorld * vec4(direction, 0.0)).xyz;

	vec3 pointOnSurface; // Will contain the info calculated in the ray marcher
	float marcher = rayMarch(cameraPosition, worldDir, pointOnSurface);
	// Shading
	vec3 color = vec3(0.0);
	if(marcher > 0.0){
		vec3 lightPosition = vec3(0.0, 0.0, -10.0);
		vec3 ambient = vec3(0.2, 0.2, 0.2);
  	  	vec3 diffusion = vec3(0.6, 0.2, 0.2);
   	 	vec3 specular = vec3(1.0, 1.0, 1.0);
    	float shininess = 10.0;
    	color = phongIllumination(ambient, diffusion, specular, shininess, pointOnSurface, cameraPosition);
	}
	gl_FragColor = vec4(color, 1.0);

}