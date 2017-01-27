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
CORE.GameEdit.canJump		= false;

CORE.GameEdit.time 		= Date.now();

CORE.GameEdit.velocity 		= new THREE.Vector3();


CORE.GameEdit.frustum		= new THREE.Frustum();

//SETTINGS
CORE.GameEdit.ShadowMap = true;
CORE.GameEdit.vOffset 		= new THREE.Vector3(0, 1.6, 0.1);

CORE.GameEdit.worldPhisics	= {};
CORE.GameEdit.BodyPhisics	= {};
CORE.GameEdit.materialPhisics	= {};

CORE.GameEdit.groundMaterial	= {};

var quat = new THREE.Quaternion();

CORE.GameEdit.INIT = function()
{
	CORE.GameEdit.initPhisics();
	CORE.GameEdit.initRenderer();
	CORE.GameEdit.initCamera();
	CORE.GameEdit.initScene();
	CORE.GameEdit.Controls();
	//CORE.GameEdit.renderer.domElement.addEventListener('mousemove', CORE.GameEdit.onDocumentMouseMove, false);
	document.addEventListener('mousemove', CORE.GameEdit.onDocumentMouseMove, false);
	//CORE.GameEdit.renderer.domElement.addEventListener('mousedown', CORE.GameEdit.onDocumentMouseDown, false);
}

CORE.GameEdit.initPhisics = function()
{
        // Setup our world
	CORE.GameEdit.worldPhisics = new CANNON.World();
	CORE.GameEdit.worldPhisics.quatNormalizeSkip = 0;
	CORE.GameEdit.worldPhisics.quatNormalizeFast = false;
		
        var solver = new CANNON.GSSolver();
	//CORE.GameEdit.worldPhisics.defaultContactMaterial.contactEquationStiffness = 1e7;
	//CORE.GameEdit.worldPhisics.defaultContactMaterial.contactEquationRelaxation = 4;
        solver.iterations = 10;
        solver.tolerance = 0.0;
                
        var split = true;
        if(split)
		CORE.GameEdit.worldPhisics.solver = new CANNON.SplitSolver(solver);
	else
		CORE.GameEdit.worldPhisics.solver = solver;
			
	CORE.GameEdit.worldPhisics.gravity.set(0,-10,0);
	CORE.GameEdit.worldPhisics.broadphase = new CANNON.NaiveBroadphase();
	
	//
	CORE.GameEdit.groundMaterial = new CANNON.Material("groundMaterial");
        // Adjust constraint equation parameters for ground/ground contact
	var ground_ground_cm = new CANNON.ContactMaterial(CORE.GameEdit.groundMaterial, CORE.GameEdit.groundMaterial,
	{
		friction: 1.0,
		restitution: 0.0,
		contactEquationStiffness: 1e8,
		contactEquationRelaxation: 10,
		frictionEquationStiffness: 1e8,
		frictionEquationRegularizationTime: 3,
        });
	// Add contact material to the world
	CORE.GameEdit.worldPhisics.addContactMaterial(ground_ground_cm);
	//
	/*
	// Create a slippery material (friction coefficient = 0.0)
	CORE.GameEdit.materialPhisics = new CANNON.Material("slipperyMaterial"{friction:0.3});
	var physicsContactMaterial = new CANNON.ContactMaterial(CORE.GameEdit.materialPhisics, CORE.GameEdit.materialPhisics, 0, 0.0);
	// We must add the contact materials to the world
	CORE.GameEdit.worldPhisics.addContactMaterial(physicsContactMaterial);
	*/
	var mass = 80, radius = 0.5;
	var sphereShape = new CANNON.Sphere(radius); 


	CORE.GameEdit.BodyPhisics = new CANNON.Body({ mass: mass,  material: CORE.GameEdit.groundMaterial});
	CORE.GameEdit.BodyPhisics.addShape(sphereShape);
	CORE.GameEdit.BodyPhisics.allowSleep = true;
	CORE.GameEdit.worldPhisics.allowSleep = true;
	CORE.GameEdit.BodyPhisics.sleepSpeedLimit = 3.0;
	CORE.GameEdit.BodyPhisics.sleepTimeLimit = 1;
	//CORE.GameEdit.BodyPhisics.inertia = new CANNON.Vec3(0, 0 ,0);
	//CORE.GameEdit.BodyPhisics.invInertia = new CANNON.Vec3(0, 0 ,0);
	CORE.GameEdit.BodyPhisics.position.set(0,2,0);
	CORE.GameEdit.BodyPhisics.linearDamping = 0.9;
	CORE.GameEdit.worldPhisics.addBody(CORE.GameEdit.BodyPhisics)

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

	CORE.GameEdit.yawCamera.position.y = 2;//1.6;
	CORE.GameEdit.yawCamera.add(CORE.GameEdit.pitchCamera);
	
	var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
	var upAxis = new CANNON.Vec3(0,1,0);

	CORE.GameEdit.BodyPhisics.addEventListener("collide", function(e)
	{

		var contact = e.contact;
		// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
		// We do not yet know which one is which! Let's check.
		if(contact.bi.id == CORE.GameEdit.BodyPhisics.id)  // bi is the player body, flip the contact normal
			contact.ni.negate(contactNormal);
		else
			contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

		// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
		if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            		CORE.GameEdit.canJump = true;
            		
	});

	CORE.GameEdit.velocity = CORE.GameEdit.BodyPhisics.velocity;
	CORE.GameEdit.scene.add(CORE.GameEdit.yawCamera);
	//console.log(CORE.GameEdit.BodyPhisics);
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
	{
		var texture = new THREE.TextureLoader().load('textures/skybox/19/sky_cube_0'+(i+1)+'.png');
		materialArray.push(new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide, fog: false}));
	}
	
	var skyMaterial = new THREE.MultiMaterial( materialArray );
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	skyBox.position.y = 900;
	skyBox.frustumCulled = false;
	skyBox.name = "skybox";
	console.log(skyBox);
	CORE.GameEdit.scene.add(skyBox);
	
	CORE.GameEdit.LoadMap();
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
CORE.GameEdit.LoadedCopy = false;
CORE.GameEdit.LoadedCall = false;

var inputVelocity = new THREE.Vector3();
var euler = new THREE.Euler();
var velocityFactor = 0.2;

var a = 0;
CORE.GameEdit.AnimationFrame = function()
{
	//requestAnimationFrame(CORE.GameEdit.AnimationFrame);
	
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
		CORE.GameEdit.worldPhisics.step(1/60);
		var delta = (Date.now() - CORE.GameEdit.time);

	//CORE.GameEdit.BodyPhisics.inertia.set(0,0,0); //= new CANNON.Vec3(0, 0 ,0);
	//CORE.GameEdit.BodyPhisics.invInertia.set(0,0,0); //= new CANNON.Vec3(0, 0 ,0);
	
		inputVelocity.set(0,0,0);
		delta *= 0.1;
		if (CORE.GameEdit.moveForward) inputVelocity.z = -velocityFactor * delta;
		if (CORE.GameEdit.moveBackward) inputVelocity.z = velocityFactor * delta;
		if (CORE.GameEdit.moveLeft) inputVelocity.x = -velocityFactor * delta;
		if (CORE.GameEdit.moveRight) inputVelocity.x = velocityFactor * delta;

		// Convert velocity to world coordinates
		euler.x = CORE.GameEdit.pitchCamera.rotation.x;
		euler.y = CORE.GameEdit.yawCamera.rotation.y;
		euler.order = "XYZ";
		quat.setFromEuler(euler);
		inputVelocity.applyQuaternion(quat);
		//quat.multiplyVector3(inputVelocity);

		// Add to the object
		CORE.GameEdit.velocity.x += inputVelocity.x;
		CORE.GameEdit.velocity.z += inputVelocity.z;

		CORE.GameEdit.yawCamera.position.copy(CORE.GameEdit.BodyPhisics.position);



		var px = CORE.GameEdit.yawCamera.position.x/2 + 245;
		var py = CORE.GameEdit.yawCamera.position.z/2 + 245;
		$("#player").css('left', px + 'px');
		$("#player").css('top', py + 'px');			
	}
	requestAnimationFrame(CORE.GameEdit.AnimationFrame);
	CORE.GameEdit.Render();
	CORE.GameEdit.time = Date.now();
	
}

CORE.GameEdit.Render = function()
{
	CORE.GameEdit.stats.update();
	CORE.GameEdit.rendererStats.update(CORE.GameEdit.renderer);
	//CORE.GameEdit.renderer.clear();
	//CORE.GameEdit.renderer.clearDepth();
	CORE.GameEdit.renderer.render(CORE.GameEdit.scene, CORE.GameEdit.camera);
}

CORE.GameEdit.onDocumentMouseMove = function(event)
{
	if (CORE.GameEdit.ControlPlayer == false)
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
		CORE.GameEdit.LoadObjs(CORE.GameEdit.data[i].id, CORE.GameEdit.data[i].position, CORE.GameEdit.data[i].rotation, CORE.GameEdit.data[i].collision);
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
			
			if(CORE.GameEdit.idObjCopy[i].c == true)
			{
				CORE.GameEdit.LoadGrid(CORE.GameEdit.ObjMesh[CORE.GameEdit.idObjCopy[i].id].geometry, CORE.GameEdit.idObjCopy[i].p, mesh.quaternion);
			}
			CORE.GameEdit.scene.add(mesh);
		}
	}
	
}

CORE.GameEdit.ObjMesh = [];

CORE.GameEdit.LoadObjs = function(id, p, r, c)
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
	
			var faceMaterial = new THREE.MultiMaterial(materials);
			var mesh = new THREE.Mesh(geometry, faceMaterial);
			CORE.GameEdit.i++;
			mesh.position.copy(p);
			mesh.rotation.x = r.x;
			mesh.rotation.y = r.y;
			mesh.rotation.z = r.z;
			mesh.visible = false;
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			
			if (c == true)//collision
			{
				CORE.GameEdit.LoadGrid(geometry, p, mesh.quaternion);
			}
			
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
		r: r,
		c: c
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
		var faceMaterial = new THREE.MultiMaterial(materials);
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
		CORE.GameEdit.LoadGrid(geometry, pos, new THREE.Quaternion());
		CORE.GameEdit.MapMesh.push(mesh);
		CORE.GameEdit.scene.add(mesh);
	});
}
var a = 1;
CORE.GameEdit.LoadGrid = function(geometry, pos, qrot)
{
		var vertices = [];
		var faces = [];
		
		// Get vertices
		for (var j = 0; j < geometry.vertices.length; ++j)
		{
			vertices.push(geometry.vertices[j].x, geometry.vertices[j].y, geometry.vertices[j].z);
		}

		// Get faces
		for (j = 0; j < geometry.faces.length; ++j)
		{
			faces.push(geometry.faces[j].a, geometry.faces[j].b, geometry.faces[j].c);
		}

		var GridMesh = new CANNON.Trimesh(vertices, faces);
		
		var Body = new CANNON.Body({mass: 0, material: CORE.GameEdit.groundMaterial});
		Body.position = new CANNON.Vec3(pos.x, pos.y, pos.z);
		
		Body.quaternion.copy(qrot);
		Body.addShape(GridMesh);
		CORE.GameEdit.worldPhisics.addBody(Body);
}
var mHide = false;
CORE.GameEdit.Controls = function()
{
	var onKeyDown = function(event)
	{
		switch(event.keyCode)
		{
			case 38: // up, w
			case 87:
			{
				CORE.GameEdit.BodyPhisics.wakeUp();
				CORE.GameEdit.moveForward = true;
				break;
			}
			case 37: // left, a
			case 65:
			{
				CORE.GameEdit.BodyPhisics.wakeUp();
				CORE.GameEdit.moveLeft 	= true;
				break;
			}
			case 40: // down, s
			case 83:
			{
				CORE.GameEdit.BodyPhisics.wakeUp();
				CORE.GameEdit.moveBackward = true;
				break;
			}
			case 39: // right, d
			case 68:
			{
				CORE.GameEdit.BodyPhisics.wakeUp();
				CORE.GameEdit.moveRight = true;
				break;
			}
			case 32:
			{
                		if ( CORE.GameEdit.canJump === true )
                		{
                			CORE.GameEdit.BodyPhisics.wakeUp();
					CORE.GameEdit.velocity.y = 30;
				}
				CORE.GameEdit.canJump = false;
				break;
			}
			case 81:
			{
				if (!mHide)
				{
					mHide = true;
					$("#Map").show();
				}
				else
				{
					mHide = false;
					$("#Map").hide();
				}
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