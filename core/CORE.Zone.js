/** @namespace */
var CORE  = CORE || {};
CORE.Zone = CORE.Zone || {};

CORE.Zone.manager =  THREE.LoadingManager();
CORE.Zone.loader = new THREE.JSONLoader(/*CORE.Zone.manager*/);
CORE.Zone.mesh 	= null;
CORE.Zone.GroupMesh = [];

CORE.Zone.meshLobby = [];
CORE.Zone._meshLobby = ['lobby_zone', 'barricades_1', 'vagon_1', 'hide', 'bonfire', 'three_1', 'stone_1'];

CORE.Zone.Objects = [];
CORE.Zone.ObjTotal = 0;

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

CORE.Zone.LoadLobby = function(_scene)
{
	for (var i = 0; i < CORE.Zone._meshLobby.length; i++)
	{
		CORE.Zone.loader.load('meshes/lobby/'+CORE.Zone._meshLobby[i]+'.js', function(geometry, materials)
		{
			for (var j = 0; j < materials.length; j++)
			{
				materials[j].map.wrapS = THREE.RepeatWrapping;
				materials[j].map.wrapT = THREE.RepeatWrapping;
				materials[j].map.anisotropy = 4;
				materials[j].needsUpdate = true;
				if (materials[j].name == 'trees_elka_S' || materials[j].name == 'prop_mask_setka_S')
				{
					materials[j].map.repeat.set(1, 1);
					materials[j].transparent = true;
					materials[j].alphaMap.wrapS = THREE.RepeatWrapping;
					materials[j].alphaMap.wrapT = THREE.RepeatWrapping;
					materials[j].side = THREE.DoubleSide;
					materials[j].alphaTest = 0.5;
					//materials[j].opacity = 0.5;
				}
			}
			var faceMaterial = new THREE.MeshFaceMaterial(materials);
			geometry.computeVertexNormals();
	
			var mesh = new THREE.Mesh(geometry, faceMaterial);
			mesh.name = CORE.Zone._meshLobby[i];
			if (j == 0)
			{
				mesh.receiveShadow = CORE.Conf.Shadow;
			}
			else
			{
				mesh.receiveShadow = CORE.Conf.Shadow;
				mesh.castShadow = CORE.Conf.Shadow;
			}
			CORE.Zone.GroupMesh.push(mesh);
			//CORE.Zone.mesh.name = _name;
			//mesh.receiveShadow = true;
			//CORE.Zone.GroupMesh.push(CORE.Zone.mesh);
			_scene.add(mesh);
		});
	}
	CORE.Zone.LoadSkyBox(_scene);
}

CORE.Zone.LoadSkyBox = function(_scene)
{
	var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);
	var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('textures/skybox/2/sky_cube_'+i+'.png'),
		side: THREE.BackSide
	}));

	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.position.y = 2400;
	skyBox.rotation.y = Math.PI/4;
	_scene.add(skyBox);
}