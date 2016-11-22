/** @namespace */
var CORE  = CORE || {};
CORE.Maps = CORE.Maps || {};

CORE.Maps.loader = new THREE.JSONLoader();
CORE.Maps.mesh 	= [];
CORE.Maps.GroupMesh = [];

CORE.Maps.LoadLobby = function(_scene)
{
	CORE.Maps.loader.load(CORE.Object3D.mp[0].path, function(geometry, materials)
	{
		
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(1, 1);
		geometry.computeVertexNormals();

		CORE.Maps.mesh[0] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide}));
		CORE.Maps.mesh[0].name = 'map0';
		_scene.add(CORE.Maps.mesh[0]);
	});

	for (var i = 0; i < MAPS.Lobby.mesh.length; i++)
	{
		var buf = CORE.LoaderObjects.CloneObject('lobby', MAPS.Lobby.mesh[i].id, MAPS.Lobby.mesh[i].position, MAPS.Lobby.mesh[i].rotation);
		CORE.Maps.GroupMesh.push(buf);
		_scene.add(buf);
	}
}
