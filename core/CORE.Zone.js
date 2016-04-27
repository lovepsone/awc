/** @namespace */
var CORE  = CORE || {};
CORE.Zone = CORE.Zone || {};

CORE.Zone.loader = new THREE.JSONLoader();
CORE.Zone.mesh 	= null;
CORE.Zone.GroupMesh = [];

CORE.Zone.Load = function(_name, _scene)
{
	CORE.Zone.loader.load('meshes/zone/' + _name, function(geometry, materials)
	{
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(10, 10);
		geometry.computeVertexNormals();

		CORE.Zone.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide}));
		CORE.Zone.mesh.name = _name;
		//mesh.receiveShadow = shadow;
		CORE.Zone.GroupMesh.push(CORE.Zone.mesh);
		_scene.add(CORE.Zone.mesh);
	});
}