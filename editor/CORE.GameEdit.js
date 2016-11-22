/** @namespace */

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var CORE  = CORE || {};
CORE.GameEdit = CORE.GameEdit || {};
CORE.Player = CORE.Player || {};

CORE.GameEdit.renderer 		= new THREE.WebGLRenderer({antialias:true});
CORE.GameEdit.W			= window.innerWidth/2;
CORE.GameEdit.H			= window.innerHeight/2;

CORE.GameEdit.camera 		= new THREE.PerspectiveCamera(60, CORE.GameEdit.W/CORE.GameEdit.H, 0.001, 10000);
CORE.GameEdit.pitchCamera 	= new THREE.Object3D();
CORE.GameEdit.yawCamera 	= new THREE.Object3D();

CORE.GameEdit.scene 		= new THREE.Scene();
CORE.GameEdit.ControlPlayer 	= false;
CORE.GameEdit.stats 		= new Stats();
CORE.GameEdit.rendererStats	= new THREEx.RendererStats()

CORE.GameEdit.manager 		= new THREE.LoadingManager();
CORE.GameEdit.loader 		= new THREE.JSONLoader(CORE.GameEdit.manager);

CORE.GameEdit.LoadFinish 	= false;
CORE.GameEdit.data		= [];
CORE.GameEdit.MapMesh		= [];

CORE.GameEdit.moveForward 	= false;
CORE.GameEdit.moveBackward 	= false;
CORE.GameEdit.moveLeft 		= false;
CORE.GameEdit.moveRight 	= false;
CORE.GameEdit.jamp 		= false;

CORE.GameEdit.prevTime 		= performance.now();
CORE.GameEdit.lastTimeStamp	= 0;

CORE.GameEdit.velocity 		= new THREE.Vector3();

CORE.GameEdit.airborne		= false;
CORE.GameEdit.raycaster		= new THREE.Raycaster();//new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
CORE.GameEdit.raycaster.ray.direction.set(0, -1, 0);
CORE.GameEdit.rays		= [
					new THREE.Vector3( 0, -1,  0),
					new THREE.Vector3( 0,  0,  1),
					new THREE.Vector3( 1,  0,  1),
					new THREE.Vector3( 1,  0,  0),
					new THREE.Vector3( 1,  0, -1),
					new THREE.Vector3( 0,  0, -1),
					new THREE.Vector3(-1,  0, -1),
					new THREE.Vector3(-1,  0,  0),
					new THREE.Vector3(-1,  0,  1)
				];
CORE.GameEdit.frustum		= new THREE.Frustum();

//SETTINGS
CORE.GameEdit.ShadowMap = true;
CORE.GameEdit.player		= {};
CORE.GameEdit.vOffset 		= new THREE.Vector3(0, 1.6, 0.1);

CORE.GameEdit.INIT = function()
{
	CORE.GameEdit.initRenderer();
	CORE.GameEdit.initCamera();
	CORE.GameEdit.initScene();
	CORE.GameEdit.Controls();
	//CORE.GameEdit.renderer.domElement.addEventListener('mousemove', CORE.GameEdit.onDocumentMouseMove, false);
	document.addEventListener('mousemove', CORE.GameEdit.onDocumentMouseMove, false);
	//CORE.GameEdit.renderer.domElement.addEventListener('mousedown', CORE.GameEdit.onDocumentMouseDown, false);
}

CORE.GameEdit.initRenderer = function()
{
	CORE.GameEdit.renderer.setClearColor(0xffffff);
	CORE.GameEdit.renderer.setPixelRatio(window.devicePixelRatio);
	CORE.GameEdit.renderer.setSize(CORE.GameEdit.W, CORE.GameEdit.H);
	CORE.WindowResize(CORE.GameEdit.renderer, CORE.GameEdit.camera, CORE.GameEdit.W, CORE.GameEdit.H);
	CORE.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});
	CORE.GameEdit.renderer.shadowMap.enabled = CORE.GameEdit.ShadowMap;
	
	CORE.GameEdit.rendererStats.domElement.style.position   = 'absolute';
	CORE.GameEdit.rendererStats.domElement.style.left  	= '0px';
	CORE.GameEdit.rendererStats.domElement.style.bottom    	= '0px';
	
	CORE.GameEdit.scene.fog = new THREE.Fog( 0x7c808c, 10.0, 60);
	
	//console.log(CORE.GameEdit.renderer);
}

CORE.GameEdit.initCamera = function()
{
	CORE.GameEdit.camera.rotation.set(0, 0, 0);
	CORE.GameEdit.pitchCamera.add(CORE.GameEdit.camera);

	CORE.GameEdit.yawCamera.position.y = 12;//1.6;
	CORE.GameEdit.yawCamera.add(CORE.GameEdit.pitchCamera);
	CORE.GameEdit.scene.add(CORE.GameEdit.yawCamera);
}

CORE.GameEdit.initScene = function()
{
	var ambientLight = new THREE.AmbientLight(0xffffff);//0x464646
	CORE.GameEdit.scene.add(ambientLight);

	var bulbGeometry = new THREE.SphereGeometry(0.12, 16, 8);
	var bulbMat = new THREE.MeshStandardMaterial({emissive: 0xffffee, emissiveIntensity: 1, color: 0x000000});
	var m = new THREE.Mesh(bulbGeometry, bulbMat);
	m.name = 'light';

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.add(m);
	light.position.set(12, 15, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = CORE.GameEdit.ShadowMap;
	CORE.GameEdit.scene.add(light);
	
	var skyGeometry = new THREE.CubeGeometry(2000, 2000, 2000);
	var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('textures/skybox/19/sky_cube_0'+(i+1)+'.png'),
		side: THREE.BackSide,
		fog: false
	}));
	
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	skyBox.position.y = 900;
	skyBox.frustumCulled = false;
	skyBox.name = "skybox";
	CORE.GameEdit.scene.add(skyBox);
	
	CORE.GameEdit.LoadMap();
	
	//player
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	CORE.GameEdit.player = new THREE.Mesh(geometry, material);
	CORE.GameEdit.player.position.y = 20;
	//CORE.GameEdit.player.position.x = -386;
	CORE.GameEdit.scene.add(CORE.GameEdit.player);
}

CORE.GameEdit.VisibleMaps = function(gObject)
{
	//CORE.GameEdit.camera.updateMatrix(); 
	//CORE.GameEdit.camera.updateMatrixWorld();
	//CORE.GameEdit.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(CORE.GameEdit.camera.projectionMatrix, CORE.GameEdit.camera.matrixWorldInverse));
	
	for (var i = 0; i < gObject.length; i++)
	{
		var d = CORE.GameEdit.yawCamera.position.distanceTo(gObject[i].position);
		var n = gObject[i].name.split("_");
		//gObject[i]
		if (n[0] == 'map1' && d < 150)
		{
			gObject[i].visible = true;
		}
		else if (d < 80 && n[0] != 'map1'/* && CORE.GameEdit.frustum.containsPoint(gObject[i].position)*/)
		{
			gObject[i].visible = true;
		}
		else
		{
			gObject[i].visible = false;
		}
	}
}
var block = false;

CORE.GameEdit.PlayerCollision = function(dt)
{
		// test colision map
		//------------------
		var timeStep = 5;
		var timeLeft = timeStep + 1;
		var birdsEye = 2.0;
		var kneeDeep = 1.0;
		
		timeLeft += dt;
		dt = 5;
		
		while(timeLeft >= dt)
		{
			var time = 0.3, damping = 0.93, gravity = 0.05, tau = 2 * Math.PI;
			
			CORE.GameEdit.raycaster.ray.direction.copy(CORE.GameEdit.rays[0]);
			CORE.GameEdit.raycaster.ray.origin.copy(CORE.GameEdit.player.position);
			CORE.GameEdit.raycaster.ray.origin.y += birdsEye;
					
			var hits = CORE.GameEdit.raycaster.intersectObjects(CORE.GameEdit.MapMesh, true);
			CORE.GameEdit.airborne = true;
			//check colision obj
			if((hits.length > 0) && (hits[0].face.normal.y > 0))
			{
				var actualHeight = hits[0].distance - birdsEye;
				// collision: stick to the surface if landing on it
				if((CORE.GameEdit.velocity.y <= 0) && (Math.abs(actualHeight) < kneeDeep))
				{
					CORE.GameEdit.player.position.setY(CORE.GameEdit.player.position.y - actualHeight);
					CORE.GameEdit.velocity.y = 0;//Math.max(0, CORE.GameEdit.velocity.y);
					CORE.GameEdit.airborne = false;
					CORE.GameEdit.jamp = true;
				}
			}
			
			if (CORE.GameEdit.airborne)
				CORE.GameEdit.velocity.y -= gravity;
			timeLeft -= dt;
		}
		block = false;
		for (var i = 1; i < CORE.GameEdit.rays.length; i++)
		{
			CORE.GameEdit.raycaster.ray.direction.copy(CORE.GameEdit.rays[i]);
			var buf = new THREE.Vector3(0, 0, 0);
			buf.copy(CORE.GameEdit.player.position);
			buf.y += 1;
			CORE.GameEdit.raycaster.ray.origin.copy(buf);
			var hits = CORE.GameEdit.raycaster.intersectObjects(CORE.GameEdit.MapMesh);
			//check distance
			if (hits.length > 0 && hits[0].distance <= 0.7)
			{
				// Yep, this.rays[i] gives us : 1 => up, 2 => up-left, 3 => left, ...
				if (i === 1 || i === 2 || i === 8)
				{
					//block = true;
				}
				else if (i === 4 || i === 5 || i === 6)
				{
					//block = true;
				}
				else
				{
					//block = false;
				}
				
				if (i === 2 || i === 3 || i === 4)
				{
				}
				else if (i === 6 || i === 7 || i === 8)
				{
				}
      			}
		}
}
CORE.GameEdit.LoadedCopy = false;
CORE.GameEdit.LoadedCall = false;
CORE.GameEdit.AnimationFrame = function(timeStamp)
{
	//requestAnimationFrame(CORE.GameEdit.AnimationFrame);
	var timeElapsed = CORE.GameEdit.lastTimeStamp ? timeStamp - CORE.GameEdit.lastTimeStamp : 0; CORE.GameEdit.lastTimeStamp = timeStamp;

	if (CORE.GameEdit.LoadFinish)
	{
		if (!CORE.GameEdit.LoadedCall)
		{
			CORE.GameEdit.LoadedCopy = true;
			CORE.GameEdit.LoadedCall = true;
		}
		CORE.GameEdit.VisibleMaps(CORE.GameEdit.MapMesh);
	}
	
	if (CORE.GameEdit.LoadedCopy)
	{
		CORE.GameEdit.LoadedCopy = false;
		CORE.GameEdit.LoadObjsCopy();
	}
	
	if (CORE.GameEdit.ControlPlayer == true && CORE.GameEdit.LoadFinish == true)
	{
		CORE.GameEdit.player.rotation.y = CORE.GameEdit.yawCamera.rotation.y;
		
		var relativeOffset = new THREE.Vector3(CORE.GameEdit.vOffset.x, CORE.GameEdit.vOffset.y, CORE.GameEdit.vOffset.z);
		var Offset = relativeOffset.applyMatrix4(CORE.GameEdit.player.matrixWorld);
		CORE.GameEdit.yawCamera.position.set(Offset.x, Offset.y, Offset.z);

		CORE.GameEdit.PlayerCollision(timeElapsed);
		
		var time = performance.now();
		var delta = (time - CORE.GameEdit.prevTime) / 1000;
		
		CORE.GameEdit.velocity.setX(CORE.GameEdit.velocity.x - CORE.GameEdit.velocity.x * 10.0 * delta);
		CORE.GameEdit.velocity.setZ(CORE.GameEdit.velocity.z - CORE.GameEdit.velocity.z * 10.0 * delta);
		//if (CORE.GameEdit.airborne)
		//	CORE.GameEdit.velocity.setY(CORE.GameEdit.velocity.y - 2.8 * 1.0 * delta);
		
		if (CORE.GameEdit.moveForward && !block) CORE.GameEdit.velocity.z -= 70.0 * delta;
		if (CORE.GameEdit.moveBackward) CORE.GameEdit.velocity.z += 70.0 * delta;
		if (CORE.GameEdit.moveLeft) CORE.GameEdit.velocity.x -= 70.0 * delta;
		if (CORE.GameEdit.moveRight) CORE.GameEdit.velocity.x += 70.0 * delta;
					
		CORE.GameEdit.player.translateX(CORE.GameEdit.velocity.x * delta);
		CORE.GameEdit.player.translateY(CORE.GameEdit.velocity.y * delta);
		CORE.GameEdit.player.translateZ(CORE.GameEdit.velocity.z * delta);

		CORE.GameEdit.prevTime = time;

		if (CORE.GameEdit.player.position.y < - 30)
		{
			CORE.GameEdit.player.position.setY(20);
			CORE.GameEdit.velocity.multiplyScalar(0);
		}
		
		/*CORE.GameEdit.camera.updateMatrix(); 
		CORE.GameEdit.camera.updateMatrixWorld();
		CORE.GameEdit.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(CORE.GameEdit.camera.projectionMatrix, CORE.GameEdit.camera.matrixWorldInverse));
		
		if (CORE.GameEdit.frustum.containsPoint(CORE.GameEdit.MapMesh[15].position))
		{
			//console.log(CORE.GameEdit.MapMesh[15].name + ": true");
			console.log(CORE.GameEdit.MapMesh[15].name + ": " +CORE.GameEdit.frustum.intersectsObject(CORE.GameEdit.MapMesh[15]));
			
		}*/
	}
	requestAnimationFrame(CORE.GameEdit.AnimationFrame);
	CORE.GameEdit.Render();
	
}

CORE.GameEdit.Render = function()
{
	CORE.GameEdit.stats.update();
	CORE.GameEdit.rendererStats.update(CORE.GameEdit.renderer);
	//CORE.GameEdit.renderer.clear();
	//CORE.GameEdit.renderer.clearDepth();
	CORE.GameEdit.renderer.render(CORE.GameEdit.scene, CORE.GameEdit.camera);
}

CORE.GameEdit.onDocumentMouseMove = function()
{
	if (CORE.GameEdit.ControlPlayer === false)
		return;
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	var PI2 = Math.PI / 1;
	var PI3 = Math.PI / 1;

	CORE.GameEdit.yawCamera.rotation.y -= movementX * 0.002;
	CORE.GameEdit.pitchCamera.rotation.x -= movementY * 0.002;
	//CORE.GameEdit.pitchCamera.quaternion.normalize();

	CORE.GameEdit.pitchCamera.rotation.x = Math.max(- PI3/2, Math.min(PI3/2, CORE.GameEdit.pitchCamera.rotation.x));
	//CORE.GameEdit.camera.updateProjectionMatrix();
}

CORE.GameEdit.loader.manager.onLoad = function()
{
	CORE.GameEdit.LoadFinish = true;
}

CORE.GameEdit.loader.manager.onProgress = function(item, loaded, total)
{
	var v = Math.round(loaded*100/total).toFixed(0);
	//console.log(v);
}
// loaders maps
CORE.GameEdit.LoadMap = function()
{
	CORE.GameEdit.data = MAPS.Map1.mesh;

	for (var i = 0; i < CORE.Object3D.mps[1].length; i++)
	{
		CORE.GameEdit.LoadSquare(CORE.Object3D.mp[CORE.Object3D.mps[1][i]].path, CORE.Object3D.mp[CORE.Object3D.mps[1][i]].name, CORE.Object3D.mp[CORE.Object3D.mps[1][i]].position);
	}
	
	for (var i = 0; i < CORE.GameEdit.data.length; i++)
	{
		CORE.GameEdit.LoadObjs(CORE.GameEdit.data[i].id, CORE.GameEdit.data[i].position, CORE.GameEdit.data[i].rotation);
	}
}

CORE.GameEdit.i = 0;

CORE.GameEdit.idObj = [];
CORE.GameEdit.idObjCopy = [];

CORE.GameEdit.LoadObjsCopy = function()
{

	//CORE.GameEdit.idObjCopy
	for (var i = 0; i < CORE.GameEdit.idObjCopy.length; i++)
	{
		if (CORE.GameEdit.idObjCopy[i] != undefined)
		{
			var mesh = new THREE.Mesh(CORE.GameEdit.ObjMesh[CORE.GameEdit.idObjCopy[i].id].geometry, CORE.GameEdit.ObjMesh[CORE.GameEdit.idObjCopy[i].id].material);
			mesh.name = CORE.GameEdit.i + '.' + CORE.GameEdit.idObjCopy[i].id;
			CORE.GameEdit.i++;
			mesh.position.copy(CORE.GameEdit.idObjCopy[i].p);
			mesh.rotation.x = CORE.GameEdit.idObjCopy[i].r.x;
			mesh.rotation.y = CORE.GameEdit.idObjCopy[i].r.y;
			mesh.rotation.z = CORE.GameEdit.idObjCopy[i].r.z;
			mesh.visible = false;
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			CORE.GameEdit.MapMesh.push(mesh);
			CORE.GameEdit.scene.add(mesh);
		}
	}
	
}

CORE.GameEdit.ObjMesh = [];

CORE.GameEdit.LoadObjs = function(id, p, r)
{
		//проверяем на повторность тест версия
	var index = CORE.GameEdit.idObj.lastIndexOf(id);
	CORE.GameEdit.idObj.push(id);
	
	if (index == -1)
	{
		CORE.GameEdit.loader.load(CORE.Object3D.obj[id].path, function(geometry, materials)
		{
			var texture = materials[0].map;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
			texture.repeat.set(1, 1);
			geometry.computeVertexNormals();
			geometry.sortFacesByMaterialIndex();
	
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
	
			var faceMaterial = new THREE.MeshFaceMaterial(materials);
			var mesh = new THREE.Mesh(geometry, faceMaterial);
			CORE.GameEdit.i++;
			mesh.position.copy(p);
			mesh.rotation.x = r.x;
			mesh.rotation.y = r.y;
			mesh.rotation.z = r.z;
			mesh.visible = false;
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			CORE.GameEdit.scene.add(mesh);
			CORE.GameEdit.MapMesh.push(mesh);
			CORE.GameEdit.ObjMesh[id] = mesh;
		});
	}
	else
	{
		var buf = {
		id: id,
		i: index,
		p: p,
		r: r
		};
		CORE.GameEdit.idObjCopy.push(buf);
		
	}
}

CORE.GameEdit.LoadSquare = function(patch, name, pos)
{
	CORE.GameEdit.loader.load(patch, function(geometry, materials)
	{
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(1, 1);
		geometry.computeVertexNormals();
		geometry.mergeVertices();
		geometry.sortFacesByMaterialIndex();
		
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
		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		var mesh = new THREE.Mesh(geometry, /*new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide})*/faceMaterial);
		mesh.position.copy(pos);
		mesh.name = name;
		var n = name.split("_");
		mesh.visible = false;
		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();
		if (n[1] == 'c3')
		{
			mesh.visible = true;
		}
		CORE.GameEdit.MapMesh.push(mesh);
		CORE.GameEdit.scene.add(mesh);
	});
}

CORE.GameEdit.Controls = function()
{
	var onKeyDown = function(event)
	{
		switch(event.keyCode)
		{
			case 38: // up, w
			case 87:
			{
				CORE.GameEdit.moveForward = true;
				break;
			}
			case 37: // left, a
			case 65:
			{
				CORE.GameEdit.moveLeft 	= true;
				break;
			}
			case 40: // down, s
			case 83:
			{
				CORE.GameEdit.moveBackward = true;
				break;
			}
			case 39: // right, d
			case 68:
			{
				CORE.GameEdit.moveRight = true;
				break;
			}
			case 32:
			{
				//if (!CORE.GameEdit.airborne && !CORE.GameEdit.jamp)
				//	CORE.GameEdit.jamp  = true;
				if (CORE.GameEdit.jamp === true) CORE.GameEdit.velocity.y += 10.0;
					CORE.GameEdit.jamp = false;
				break;
			}
		}
	
	};

	var onKeyUp = function(event)
	{
		switch(event.keyCode)
		{
			case 38: // up, w
			case 87:
			{
				CORE.GameEdit.moveForward = false;
				break;
			}
			case 37: // left, a
			case 65:
			{
				CORE.GameEdit.moveLeft 	= false;
				break;
			}
			case 40: // down, s
			case 83:
			{
				CORE.GameEdit.moveBackward = false;
				break;
			}
			case 39: // right, d
			case 68:
			{
				CORE.GameEdit.moveRight = false;
				break;
			}
			/*case 32:
			{
				CORE.GameEdit.jamp  = false;
				break;
			}*/
		}
	};


	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
}