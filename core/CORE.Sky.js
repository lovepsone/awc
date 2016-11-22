/** @namespace */
var CORE  = CORE || {};
CORE.Sky = CORE.Sky || {};

CORE.Sky.loader = new THREE.JSONLoader();
CORE.Sky.Loaded = false;
//времмено

CORE.Sky.Load = function(_scene)
{
	var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);
	var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('textures/skybox/2/sky_cube_0'+(i+1)+'.png'),
		side: THREE.BackSide
	}));

	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.position.y = 2400;
	skyBox.rotation.y = Math.PI/4;
	_scene.add(skyBox);
}