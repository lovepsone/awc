var CORE = CORE || {};
CORE.Lobby = CORE.Lobby || {};

CORE.Lobby.endLoad 		= false;
CORE.Lobby.loader 		= new THREE.JSONLoader();
CORE.Lobby.pMixer 		= {};
CORE.Lobby.action		= {};
CORE.Lobby.RndSondLast		= 1;
CORE.Lobby.Sounds		= [];
CORE.Lobby.GroupStaticMesh 	= [];
CORE.Lobby.raycaster		= new THREE.Raycaster();
CORE.Lobby.Camera		= {};
CORE.Lobby.MoveCamera		= {m1: false, m2: false, d:0, sPosition: new THREE.Vector3(3, 2.5, 4), lPosition: new THREE.Vector3(0.4, 0, -0.8)};	
CORE.Lobby.Glow			= {_id:[161, 707, 543, 704, 617], locale: null, v3: new THREE.Vector3(), block: false};
CORE.Lobby.mouse		= {v2: new THREE.Vector2(), ClickId: 0};

CORE.Lobby.INT = function(_scene, _camera)
{
	CORE.Lobby.LoadMap(_scene);
	CORE.Sky.Load(_scene);
	CORE.Lobby.LoadPlayerMesh(_scene);
	CORE.Lobby.Camera = _camera;
	CORE.Lobby.Camera.position.copy(CORE.Lobby.MoveCamera.sPosition);
	CORE.Lobby.Camera.lookAt(CORE.Lobby.MoveCamera.lPosition);

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

	document.addEventListener('mousemove', function(event)
	{	
		event.preventDefault();
		CORE.Lobby.mouse.v2.x = (event.clientX / CORE.Main.Width) * 2 - 1;
		CORE.Lobby.mouse.v2.y = - (event.clientY / CORE.Main.Height) * 2 + 1;
		
		CORE.Lobby.raycaster.setFromCamera(CORE.Lobby.mouse.v2, CORE.Lobby.Camera);
		var intersects = CORE.Lobby.raycaster.intersectObjects(CORE.Lobby.GroupStaticMesh);
		if (intersects.length > 0 && CORE.Lobby.endLoad && CORE.Lobby.Glow.block == false)
		{
			var intersected = intersects[0].object;
			var id = CORE.Lobby.CheckGlowStaticObject(intersected.name);

			if (id > 0)
			{
				for (var i = 0; i < CORE.Lobby.Glow._id.length; i++)
				{
					if (CORE.Lobby.Glow._id[i] != id)
					{
						var mesh = _scene.getObjectByName("glow"+CORE.Lobby.Glow._id[i]);
						mesh.visible = false;
					}
				}
				HANDLER.Interface.glow.text(CORE.Lobby.Glow.locale);
				HANDLER.Interface.glow.show();
				document.body.style.cursor = 'pointer';
				CORE.Lobby.mouse.ClickId = id;
				var mesh = _scene.getObjectByName("glow"+id);
				mesh.visible = true;
			}
			else
			{
				CORE.Lobby.mouse.ClickId = 0;
				for (var i = 0; i < CORE.Lobby.Glow._id.length; i++)
				{
					var mesh = _scene.getObjectByName("glow"+CORE.Lobby.Glow._id[i]);
					mesh.visible = false;
				}
				HANDLER.Interface.glow.hide();
				document.body.style.cursor = 'auto';
			}
			
		}
		else if (CORE.Lobby.Glow.block == true)
		{
			document.body.style.cursor = 'auto';
			for (var i = 0; i < CORE.Lobby.Glow._id.length; i++)
			{
				var mesh = _scene.getObjectByName("glow"+CORE.Lobby.Glow._id[i]);
				mesh.visible = false;
			}
		}
		
	}, false);
	
	document.addEventListener('click', function(event)
	{
		event.preventDefault();

		if (CORE.Lobby.mouse.ClickId > 0 && CORE.Lobby.Glow.block == false)
		{
			HANDLER.Interface.glow.hide();
			
			var mesh = _scene.getObjectByName("glow"+CORE.Lobby.mouse.ClickId);
			CORE.Lobby.Glow.v3.copy(mesh.position);
			CORE.Lobby.MoveCamera.d = (CORE.Lobby.Glow.v3.x - CORE.Lobby.Camera.position.x)/(CORE.Lobby.Glow.v3.z - CORE.Lobby.Camera.position.z);
			CORE.Lobby.MoveCamera.m1 = true;
		
			switch(CORE.Lobby.mouse.ClickId)
			{
				case 161: CORE.Lobby.Camera.lookAt(mesh.position);
					break;
				case 707: CORE.Lobby.Camera.lookAt(mesh.position);
					break;
				case 543: CORE.Lobby.Camera.lookAt(mesh.position);
					break;
				case 704: CORE.Lobby.Camera.lookAt(mesh.position);
					break;
				case 617: CORE.Lobby.Camera.lookAt(mesh.position);
					CORE.Paricle.lScreenAttenuation(_scene, 2, CORE.Lobby.Camera.position, 0.02);
					break;
			}
			CORE.Lobby.Glow.block = true;
		}
		
	}, false);
}

CORE.Lobby.CameraMove = function(delta)
{
	var d = Math.sqrt(Math.pow((CORE.Lobby.Camera.position.x - CORE.Lobby.Glow.v3.x), 2) + Math.pow((CORE.Lobby.Camera.position.z - CORE.Lobby.Glow.v3.z), 2));

	if (d > 1.5 && CORE.Lobby.MoveCamera.m1 == true && CORE.Paricle.ScreenAttenuation.isEndBlack == false)
	{
		CORE.Lobby.Camera.translateZ(-CORE.Lobby.MoveCamera.d*delta);
	}
	else if (d <= 1.5 && CORE.Lobby.MoveCamera.m1 == true)
	{
		HANDLER.Interface.flobby.show();
		CORE.Lobby.MoveCamera.m1 = false;
	}
	else if (CORE.Lobby.MoveCamera.m2 == true)
	{
		if (CORE.Lobby.Camera.position.x < CORE.Lobby.MoveCamera.sPosition.x)
		{
			CORE.Lobby.Camera.translateZ(2*delta);
		}
		else
		{
			CORE.Lobby.MoveCamera.m2 = false;
			CORE.Lobby.Glow.block = false;
			CORE.Lobby.Camera.lookAt(CORE.Lobby.MoveCamera.lPosition);
		}
		
	}

}

CORE.Lobby.CheckGlowStaticObject = function(id)
{
	var result = 0;
	switch(id)
	{
		case 161: result = 161; // storage
			  CORE.Lobby.Glow.locale = LOCALE.RU.Lobby[0];
			break;
		case 707: result = 707; // Inventory
			  CORE.Lobby.Glow.locale = LOCALE.RU.Lobby[1];
			break;
		case 543: result = 543; // Auction
			  CORE.Lobby.Glow.locale = LOCALE.RU.Lobby[2];
			break;
		case 704: result = 704; // Personal computer
			  CORE.Lobby.Glow.locale = LOCALE.RU.Lobby[3];
			break;
		case 617: result = 617; // In the gaming world
			  CORE.Lobby.Glow.locale = LOCALE.RU.Lobby[4];
			break;
	}
	return result;
}

CORE.Lobby.CreateGlowStaticObject = function(_scene, id, g, p, r, s)
{
	var glowMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{ 
			"c":   { type: "f", value: 1.0 },
			"p":   { type: "f", value: 1.4 },
			glowColor: { type: "c", value: new THREE.Color(0xffff00) },
			viewVector: { type: "v3", value: CORE.Main.camera.position }
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	var glowMesh = new THREE.Mesh(g, glowMaterial);
	glowMesh.visible = false;
	glowMesh.name = "glow"+id;
	glowMesh.position.copy(p);
	glowMesh.rotation.x = r.x;
	glowMesh.rotation.y = r.y;
	glowMesh.rotation.z = r.z;
	glowMesh.scale.copy(s);
	_scene.add(glowMesh);
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

		if (CORE.Lobby.CheckGlowStaticObject(id) > 0)
		{
			CORE.Lobby.CreateGlowStaticObject(_scene, id, geometry, p, r, s);
		}

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
		CORE.Lobby.GroupStaticMesh.push(mesh);
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

CORE.Lobby.RndSounds = function(min, max, maxsounds)
{
	if (!CORE.Sounds.isPlay(CORE.Lobby.RndSondLast))
	{
		var val = Math.floor(Math.random() * (max - min)) + min;
		if (val <= maxsounds)
		{
			CORE.Lobby.RndSondLast = val;
			CORE.Sounds.Play(CORE.Lobby.RndSondLast);
		}
	}
	
}

CORE.Lobby.Update = function(delta)
{
	if (CORE.Lobby.endLoad)
	{
		CORE.Lobby.pMixer.update(0.75*delta);
		CORE.Paricle.Update(delta);
		CORE.Lobby.CameraMove(6*delta);
		//CORE.Lobby.RndSounds(1, 35, 5);
	}
}
