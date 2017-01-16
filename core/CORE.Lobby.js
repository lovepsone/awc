var CORE = CORE || {};
CORE.Lobby = CORE.Lobby || {};

CORE.Lobby.Start 	= false;
CORE.Lobby.end 		= false;

CORE.Lobby.loader 	= new THREE.JSONLoader();
CORE.Lobby.pMixer 	= {};
CORE.Lobby.action	= {};
CORE.Lobby.Sounds	= [];

CORE.Lobby.INT = function(_scene, _camera)
{
	CORE.Lobby.LoadMap(_scene);
	CORE.Sky.Load(_scene);
	CORE.Lobby.LoadPlayerMesh(_scene);
	_camera.position.set(3, 2.5, 4);
	_camera.lookAt(new THREE.Vector3(0.4, 0, -0.8));

	CORE.Paricle.Fire(_scene, new THREE.Vector3(1.3, 0.3, 0.70), new THREE.Vector3(0, 0, 0), 2.6);
	CORE.Light.FireLight(_scene, "fLobyy", new THREE.Vector3(1.3, 0.3, 0.70));
	
	for (var i = 0; i < 6; i++)
	{
		if (i == 0)
		{
			CORE.Sounds.LoadAudio(_scene, i, i, 1, true, new THREE.Vector3(0, 0, 0));
		}
		else
		{
			CORE.Sounds.LoadAudio(_scene, i, i, 0.5, false, new THREE.Vector3(0, 0, 0));
		}
	}
}

CORE.Lobby.LoadMap = function(_scene)
{
	CORE.Lobby.loader.load(CORE.Object3D.mp[0].path, function(geometry, materials)
	{
		
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(1, 1);
		geometry.computeVertexNormals();

		CORE.Maps.mesh[0] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide}));
		CORE.Maps.mesh[0].name = 'MapLobby';
		_scene.add(CORE.Maps.mesh[0]);
	});
	
	for (var i = 0; i < MAPS.Lobby.mesh.length; i++)
	{
		CORE.Lobby.LoadStaticMesh(_scene, MAPS.Lobby.mesh[i].id, MAPS.Lobby.mesh[i].position, MAPS.Lobby.mesh[i].rotation, MAPS.Lobby.mesh[i].scale);
	}
}

CORE.Lobby.LoadStaticMesh = function(_scene, id, p, r, s)
{
	CORE.Lobby.loader.load(CORE.Object3D.obj[id].path, function(geometry, materials)
	{
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(1, 1);
		geometry.computeVertexNormals();

		for (var j = 0; j < materials.length; j++)
		{
			materials[j].map.wrapS = THREE.RepeatWrapping;
			materials[j].map.wrapT = THREE.RepeatWrapping;
			materials[j].map.anisotropy = 4;
			materials[j].needsUpdate = true;

			if (materials[j].name == 'alpha_map')
			{
				materials[j].map.repeat.set(1, 1);
				materials[j].transparent = true;
				materials[j].alphaMap.wrapS = THREE.RepeatWrapping;
				materials[j].alphaMap.wrapT = THREE.RepeatWrapping;
				materials[j].side = THREE.DoubleSide;
				materials[j].alphaTest = 0.5;
			}
			else if (materials[j].name == 'duable_map')
			{
				materials[j].map.repeat.set(1, 1);
				materials[j].side = THREE.DoubleSide;
			}
			else if (materials[j].name == 'prop_fake_occ_S')
			{
				materials[j].visible = false;
			}
		}

		var faceMaterial = new THREE.MultiMaterial(materials);
		var mesh = new THREE.Mesh(geometry, faceMaterial);
		mesh.name = id;
		mesh.position.copy(p);
		mesh.scale.copy(s);
		mesh.rotation.x = r.x;
		mesh.rotation.y = r.y;
		mesh.rotation.z = r.z;
		_scene.add(mesh);
	});
}

CORE.Lobby.LoadPlayerMesh = function(_scene)
{
	CORE.Lobby.loader.load("meshes/players/player_lobby_1.js", function(geometry, materials)
	{
		geometry.computeVertexNormals();
		//geometry.computeBoundingBox();
		for (var j = 0; j < materials.length; j++)
		{
			materials[j].skinning = true;
		}
		
		var mesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
		mesh.name = 'PlayerLobby';
		mesh.position.set(0.4, 0, -0.8);
		mesh.rotation.set(0, Math.PI + Math.PI/4, 0);
		CORE.Lobby.pMixer = new THREE.AnimationMixer(mesh);
		CORE.Lobby.action = CORE.Lobby.pMixer.clipAction(geometry.animations[0], mesh);
		CORE.Lobby.action.play(CORE.Lobby.pMixer);

		_scene.add(mesh);
	});
}

CORE.Lobby.loader.manager.onLoad = function()
{
}

CORE.Lobby.Update = function(delta)
{
	CORE.Lobby.pMixer.update(0.75*delta);
	CORE.Paricle.Update(delta);
}
