import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shape } from 'three';

// SCENE SET UP:
// the scene in which everything will be rendered to.
const scene = new THREE.Scene();

// camera which is used to view 3d objects.
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

// there must be a method to render everything, here we are using canvas which we are query selecting "bg" our background.
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

// setting the pixels ration of renderer based off of device pixel ratio.
// renderer will also have a width / height based off of the device window size.
// camera.postion is set to whatever we want, in this case, 30.
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

// with the render parameters set, lets render things using our scene, and camera.
renderer.render( scene, camera );

// this function will help move our camera as we scroll, as well as move other 3D objects dynamically.
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    earth.rotation.x += 0.05;
    earth.rotation.y += 0.075;
    earth.rotation.z += 0.05;

    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera

// OBJECTS:
// this is a geometry shape that THREE.js has as default (we can also use outsourced 3d objects if we want for example from Blender)
// geometry is our shape, while material is the skin to that shape. torus is the shape and skin together as a single object.
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
// const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } );    // basic render doesn't react to light
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347} );    // basic render doesn't react to light
const torus = new THREE.Mesh( geometry, material );

// lets attatch the torus object to our scene.
scene.add(torus);

// function to help generate many stars for my scene.
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    const star = new THREE.Mesh( geometry, material );
    const [x, y, z] = Array(3).fill().map(() => 
        THREE.MathUtils.randFloatSpread( 100 ) 
    )
    star.position.set(x, y, z);
    scene.add(star);
}
// 200 Arrays that I will fill, and for each I will call the addStar, which fills x,y,z with random numbers between -100 to 100.
Array(200).fill().forEach(addStar);

// we can also add texture mapping onto objects, lets try a simple one on a cube.
const cubeTexture = new THREE.TextureLoader().load('squareTexture.jfif');
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial( {map: cubeTexture } )
);
scene.add(cube);

// notice in this example we also have 'normalMap' which allows light to bounce off of density mapTextures which gives an illusion of depth on texture maps.
const earthSurface = new THREE.TextureLoader().load('earth.jpg');
const earthDepth = new THREE.TextureLoader().load('earthElevation.jpg');
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial( {
        map: earthSurface,
        normalMap: earthDepth
    } )
);
scene.add(earth);
// you can reposition any object by simply redefining their position like so (using either = or set, they do the same thing):
earth.position.z = 30;
earth.position.setX( -10);

// LIGHTING:
// Point light for lighting a focused area.
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(25, 25, 25);
const pointLight2 = new THREE.PointLight(0xB1000D);
pointLight2.position.set(500, 75, 50);

// Ambient light for lighting all surfaces of an area.
const ambientLight = new THREE.AmbientLight(0xffffff);

// lets attatch our light sources to our scene without this, our scene would be very dark!
scene.add(pointLight, ambientLight);

// HELPFUL TOOLS:
// useful tools/helpers : lightHelper for camera/lighting, and gridHelper for orientation/space awareness.
// define the light helper which is an object that shows the light source which is the light variable itself passed as an argument.
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

// add light helper and grid helper to our scene.
scene.add(lightHelper, gridHelper);

// CONTROLS:
// this controls our perspective by listening to domElement or mouse movements and than updates things accordingly.
const controls = new OrbitControls(camera, renderer.domElement);

//Add a background image.
// TextureLoader can have a callback function to implement loaders if needed.
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// this is a loop animation function that repeatedly renders our scene and camera.
function animate() {
    requestAnimationFrame( animate );

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();

    // render our scene and camera.
    renderer.render( scene, camera );
}

// call animate function.
animate();