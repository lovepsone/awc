/** @namespace */
var CORE  = CORE || {};
CORE.MainEditor = CORE.MainEditor || {};

CORE.MainEditor.renderer 	= new THREE.WebGLRenderer({antialias:true});
CORE.MainEditor.Control 	= {};
CORE.MainEditor.Control2	= {};
CORE.MainEditor.camera 		= new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.001, 10000);

CORE.MainEditor.scene = new THREE.Scene();
CORE.MainEditor.clock = new THREE.Clock();
CORE.MainEditor.stats = new Stats();
CORE.MainEditor.rendererStats = new THREEx.RendererStats()
CORE.MainEditor.prevTime = performance.now();
CORE.MainEditor.loader = new THREE.JSONLoader();

CORE.MainEditor.raycaster = new THREE.Raycaster();
CORE.MainEditor.mouse = new THREE.Vector2();
CORE.MainEditor.Objects = [];
CORE.MainEditor.SELECTED = null;
CORE.MainEditor.data = [];
CORE.MainEditor.MapMesh = [];
CORE.MainEditor.i = 0;
CORE.MainEditor.LoadMapId = 0;
//SETTINGS
CORE.MainEditor.ShadowMap = true;
var light;

CORE.MainEditor.INIT = function()
{

	CORE.MainEditor.initRenderer();
	CORE.MainEditor.initCamera();
	CORE.MainEditor.initScene();

	CORE.MainEditor.renderer.domElement.addEventListener('mousemove', CORE.MainEditor.onDocumentMouseMove, false);
	CORE.MainEditor.renderer.domElement.addEventListener('mousedown', CORE.MainEditor.onDocumentMouseDown, false);
}

CORE.MainEditor.initRenderer = function()
{
	CORE.MainEditor.renderer.setClearColor(0xffffff);
	CORE.MainEditor.renderer.setPixelRatio(window.devicePixelRatio);
	CORE.MainEditor.renderer.setSize(window.innerWidth, window.innerHeight);
	//CORE.MainEditor.renderer.physicallyCorrectLights = true;
	//CORE.MainEditor.renderer.toneMapping = THREE.ReinhardToneMapping;
	//CORE.MainEditor.renderer.gammaInput = true;
	//CORE.MainEditor.renderer.gammaOutput = true;
	CORE.WindowResize(CORE.MainEditor.renderer, CORE.MainEditor.camera);
	CORE.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});
	CORE.MainEditor.renderer.shadowMap.enabled = CORE.MainEditor.ShadowMap;
}

CORE.MainEditor.initCamera = function()
{
	CORE.MainEditor.camera.position.set(8, 2, -3);
	CORE.MainEditor.camera.rotation.set(0, 0, 0);
	CORE.MainEditor.camera.lookAt(new THREE.Vector3(0, 0, 1));

	var ambientLight = new THREE.AmbientLight(0xffffff);//0x464646
	CORE.MainEditor.scene.add(ambientLight);

	var bulbGeometry = new THREE.SphereGeometry(0.12, 16, 8);
	var bulbMat = new THREE.MeshStandardMaterial({emissive: 0xffffee, emissiveIntensity: 1, color: 0x000000});
	var m = new THREE.Mesh(bulbGeometry, bulbMat);
	m.name = 'light';

	light = new THREE.DirectionalLight(0xffffff, 1);
	light.add(m);
	light.position.set(12, 15, 0);
	light.target.position.set(0, 0, 0);
	//light.castShadow = CORE.Conf.Shadow;
	CORE.MainEditor.scene.add(light);
/**/

	CORE.MainEditor.Control = new THREE.OrbitControls(CORE.MainEditor.camera, CORE.MainEditor.renderer.domElement);
	//CORE.MainEditor.Control.enableDamping = true;
	//CORE.MainEditor.Control.dampingFactor = 0.45;
	CORE.MainEditor.Control.keyPanSpeed = 200.0;
	//CORE.MainEditor.Control.enableZoom = false;

	CORE.MainEditor.Control2 = new THREE.TransformControls(CORE.MainEditor.camera, CORE.MainEditor.renderer.domElement);
	//CORE.MainEditor.Control2.addEventListener('change', render );
	CORE.MainEditor.scene.add(CORE.MainEditor.Control2);

	window.addEventListener('keydown', function(event)
	{

		switch(event.keyCode)
		{
			case 65: //a
				if (HANDLER.Interface.SelObj)
				{
					CORE.MainEditor.raycaster.setFromCamera(CORE.MainEditor.mouse, CORE.MainEditor.camera);
					var intersects = CORE.MainEditor.raycaster.intersectObjects(CORE.MainEditor.MapMesh);
					if (intersects.length > 0)
					{
						//console.log(intersects[0]); distance
						if (HANDLER.Interface.RandAxis.prop("checked"))
						{
							if ($("#RandAxisX").prop("checked"))
							{
								var x = Math.random() * (3.14 - 0) + 0;
								CORE.MainEditor.LoadObj($("select#objects").val(), x, 0, 0, intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
							}
							else if ($("#RandAxisY").prop("checked"))
							{
								var y = Math.random() * (3.14 - 0) + 0;
								CORE.MainEditor.LoadObj($("select#objects").val(), 0, y, 0, intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
							}
							else if ($("#RandAxisZ").prop("checked"))
							{
								var z = Math.random() * (3.14 - 0) + 0;
								CORE.MainEditor.LoadObj($("select#objects").val(), 0, 0, z, intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
							}
						}
						else
						{
							CORE.MainEditor.LoadObj($("select#objects").val(), 0, 0, 0, intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
						}
					}
				}
				break;
			case 81: // Q
				CORE.MainEditor.Control2.setSpace(CORE.MainEditor.Control2.space === "local" ? "world" : "local");
				break;
			case 17: // Ctrl
				CORE.MainEditor.Control2.setTranslationSnap(100);
				CORE.MainEditor.Control2.setRotationSnap(THREE.Math.degToRad(15));
				break;
			case 87: // W
				CORE.MainEditor.Control2.setMode("translate");
				break;
			case 69: // E
				CORE.MainEditor.Control2.setMode("rotate");
				break;
			case 82: // R
				CORE.MainEditor.Control2.setMode("scale");
				break;
			case 187:
			case 107: // +, =, num+
				CORE.MainEditor.Control2.setSize(CORE.MainEditor.Control2.size + 0.1);
				break;
			case 189:
			case 109: // -, _, num-
				CORE.MainEditor.Control2.setSize(Math.max(CORE.MainEditor.Control2.size - 0.1, 0.1));
				break;
			case 46:
				{
					if (SELECTED != null)
					{
						CORE.MainEditor.scene.remove(SELECTED);
						CORE.MainEditor.Control2.detach();
						var buf = [];
						
						for (var i = 0; i < CORE.MainEditor.Objects.length; i++)
						{
							if (SELECTED.name != CORE.MainEditor.Objects[i].name)
							{
								buf.push(CORE.MainEditor.Objects[i]);
							}
						}
						CORE.MainEditor.Objects = buf;
						SELECTED = null
					}
				}
				break;
		}
	});
	window.addEventListener('keyup', function(event)
	{
		switch(event.keyCode)
		{
			case 17: // Ctrl
				CORE.MainEditor.Control2.setTranslationSnap(null);
				CORE.MainEditor.Control2.setRotationSnap(null);
				break;
		}
	});
}

CORE.MainEditor.initScene = function()
{
	var skyGeometry = new THREE.CubeGeometry(2000, 2000, 2000);
	var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('textures/skybox/19/sky_cube_0'+(i+1)+'.png'),
		side: THREE.BackSide
	}));

	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.position.y = 400;
	//skyBox.rotation.y = Math.PI/4;
	CORE.MainEditor.scene.add(skyBox);
}

CORE.MainEditor.AnimationFrame = function()
{
	CORE.MainEditor.Control.update();
	CORE.MainEditor.Control2.update();
	requestAnimationFrame(CORE.MainEditor.AnimationFrame);
	CORE.MainEditor.Render();
}

CORE.MainEditor.Render = function()
{
	CORE.MainEditor.stats.update();
	CORE.MainEditor.renderer.clear();
	CORE.MainEditor.renderer.clearDepth();
	CORE.MainEditor.renderer.render(CORE.MainEditor.scene, CORE.MainEditor.camera);
}

CORE.MainEditor.onWindowResize = function()
{
	CORE.MainEditor.camera.aspect = window.innerWidth / window.innerHeight;
	CORE.MainEditor.camera.updateProjectionMatrix();
	CORE.MainEditor.renderer.setSize(window.innerWidth, window.innerHeight);
}

CORE.MainEditor.onDocumentMouseMove = function(event)
{
	event.preventDefault();

	CORE.MainEditor.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	CORE.MainEditor.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

CORE.MainEditor.onDocumentMouseDown = function(event)
{
	event.preventDefault();
	CORE.MainEditor.raycaster.setFromCamera(CORE.MainEditor.mouse, CORE.MainEditor.camera);
	var intersects = CORE.MainEditor.raycaster.intersectObjects(CORE.MainEditor.Objects);
	if (intersects.length > 0 && !HANDLER.Interface.FixedAxis.prop("checked"))
	{
		SELECTED = intersects[0].object;
		CORE.MainEditor.Control2.attach(SELECTED);
		var name_m = SELECTED.name;
		var buf = name_m.split("."); 
		$("#Err").val(locObj[buf[1]] + ' [guid=' + buf[0] + ']');
	}

}

CORE.MainEditor.LoadMap = function(id)
{
	CORE.MainEditor.LoadMapId = id;
	var _map = CORE.MainEditor.scene.getObjectByName('map');

	if (_map != undefined)
	{
		CORE.MainEditor.i = 0;
		CORE.MainEditor.Objects = [];
		for (var i = 0; i < CORE.MainEditor.scene.children.length; i++)
		{
			var t = CORE.MainEditor.scene.children[i].name;
			if (t != '')
			{
				CORE.MainEditor.scene.remove(CORE.MainEditor.scene.children[i]);
			}
		}
		CORE.MainEditor.scene.remove(_map);
	}

	if (id >= CORE.Object3D.mp.length)
	{
		$("#Err").val('Error: This map is not!');
		return;
	}

	if(id == 0)
	{
		CORE.MainEditor.data = MAPS.Lobby.mesh;
	}
	else if (id == 1)
	{
		CORE.MainEditor.data = MAPS.Map1.mesh;
	}

	for (var i = 0; i < CORE.Object3D.mps[id].length; i++)
	{
		CORE.MainEditor.LoadSquare(CORE.Object3D.mp[CORE.Object3D.mps[id][i]].path, CORE.Object3D.mp[CORE.Object3D.mps[id][i]].name, CORE.Object3D.mp[CORE.Object3D.mps[id][i]].position);
	}
	// всреммено скрыл
	/*for (var i = 0; i < CORE.MainEditor.data.length; i++)
	{
		CORE.MainEditor.LoadObjs(CORE.MainEditor.data[i].id, CORE.MainEditor.data[i].position, CORE.MainEditor.data[i].rotation, CORE.MainEditor.data[i].scale);
	}*/
}

CORE.MainEditor.LoadSquare = function(patch, name, pos)
{
	CORE.MainEditor.loader.load(patch, function(geometry, materials)
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
				//materials[j].opacity = 0.7;
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
			else if (materials[j].name == 'trees_fuflo_S' || materials[j].name == 'prop_fake_kollision_S')
			{
				materials[j].visible = false;
			}
		}
		var faceMaterial = new THREE.MultiMaterial(materials);
		var mesh = new THREE.Mesh(geometry, /*new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide})*/faceMaterial);
		if (CORE.MainEditor.LoadMapId == 0)
		{
			mesh.name = 'map';
		}
		else if (CORE.MainEditor.LoadMapId == 1)
		{
			mesh.name = name;
		}
		mesh.position.copy(pos);
		$("input:checkbox[name=hm]").each(function()
		{
			var chec = $(this), t = chec.val();
			var n = name.split("_");
			if (t == n[1])
			{
				if (chec.prop("checked"))
				{
					mesh.visible = true;
				}
				else
				{
					mesh.visible = false;
				}
			}
		});
		CORE.MainEditor.MapMesh.push(mesh);
		CORE.MainEditor.scene.add(mesh);
	});
}

CORE.MainEditor.LoadObj = function(id, rx, ry, rz, px, py, pz)
{
	if (id >= CORE.Object3D.obj.length)
	{
		$("#Err").val('Error: This object is not!');
		return;
	}

	CORE.MainEditor.loader.load(CORE.Object3D.obj[id].path, function(geometry, materials)
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
				//materials[j].opacity = 0.7;
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
		mesh.name = CORE.MainEditor.i + '.' + id;
		CORE.MainEditor.i++;
		mesh.rotation.x = rx;
		mesh.rotation.y = ry;
		mesh.rotation.z = rz;
		mesh.position.set(px, py, pz);
		CORE.MainEditor.scene.add(mesh);
		CORE.MainEditor.Objects.push(mesh);
	});
}

CORE.MainEditor.LoadObjs = function(id, p, r, s)
{
	CORE.MainEditor.loader.load(CORE.Object3D.obj[id].path, function(geometry, materials)
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
				//materials[j].opacity = 0.5;
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
		mesh.name = CORE.MainEditor.i + '.' + id +'.' + CORE.Object3D.obj[id].collision;
		CORE.MainEditor.i++;
		mesh.position.copy(p);
		mesh.scale.copy(s);
		mesh.rotation.x = r.x;
		mesh.rotation.y = r.y;
		mesh.rotation.z = r.z;
		CORE.MainEditor.scene.add(mesh);
		CORE.MainEditor.Objects.push(mesh);
	});
}

CORE.MainEditor.LoadGrass = function(count, w, h)
{
	var grassCount = count;
	var objGrass = [173, 174, 175, 176, 177, 178, 179, 180];
	
	var worldWidth = w, worldDepth = h, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;	
	// грузим траву, рандомно
	for (var i = 0; i < grassCount; i++)
	{
		var id = Math.floor(Math.random() * (objGrass.length - 0)) + 0;
		
		CORE.MainEditor.loader.load(CORE.Object3D.obj[objGrass[id]].path, function(geometry, materials)
		{
				var texture = materials[0].map;
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
				texture.repeat.set(1, 1);
				geometry.computeVertexNormals();
				
				for (var j = 0; j < materials.length; j++)
				{
					materials[j].map.wrapS = materials[j].map.wrapT = THREE.RepeatWrapping;
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
				}
				var faceMaterial = new THREE.MultiMaterial(materials);
				var mesh = new THREE.Mesh(geometry, faceMaterial);
				mesh.name = CORE.MainEditor.i + '.' + objGrass[id];
				CORE.MainEditor.i++;
				mesh.position.x = Math.random() * worldWidth - worldHalfWidth;
				mesh.position.z = Math.random() * worldDepth - worldHalfDepth;
				mesh.rotation.y = Math.random() * Math.PI;
				CORE.MainEditor.scene.add(mesh);
				CORE.MainEditor.Objects.push(mesh);
		});
	}
}