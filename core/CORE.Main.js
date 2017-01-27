/** @namespace */
var CORE  = CORE || {};
CORE.Main = CORE.Main || {};

CORE.Main.Width			= window.innerWidth;
CORE.Main.Height		= window.innerHeight;
CORE.Main.StartLoadMap		= false;
CORE.Main.renderer 		= new THREE.WebGLRenderer({antialias:true});
CORE.Main.ControlPlayer 	= false;
CORE.Main.camera 		= new THREE.PerspectiveCamera(60, CORE.Main.Width/CORE.Main.Height, 0.001, 9000);
CORE.Main.cameraType		= 1;

CORE.Main.pitchCamera 		= new THREE.Object3D();
CORE.Main.yawCamera 		= new THREE.Object3D();
CORE.Main.yawCameraOffsetY	= 1.65;
CORE.Main.VectorCameraOffset 	= new THREE.Vector3(0, 2.5, 2.5);

CORE.Main.scene = new THREE.Scene();
CORE.Main.stats = new Stats();
CORE.Main.prevTime = performance.now();

CORE.Main.time			= Date.now();
CORE.Main.clock 		= new THREE.Clock();


var light;
// loader objects
CORE.Main.LoadObjects = false;

CORE.Main.INIT = function()
{
	CORE.Network.INT();
	CORE.Lobby.INT(CORE.Main.scene, CORE.Main.camera);
	CORE.Light.INT(CORE.Main.scene, CORE.Network.time.h);
	CORE.Sounds.INT(CORE.Main.camera);
	CORE.Main.initRenderer();
	//CORE.Main.initCamera();
	//CORE.Main.initScene();
	//CORE.Main.initPlayers();
	//CORE.Zone.Load('zone.js', CORE.Main.scene);
	//CORE.Zone.LoadLobby(CORE.Main.scene);
	//CORE.Particle.Fire(CORE.Main.scene);
	//window.addEventListener('resize', CORE.Main.onWindowResize, false);
}

CORE.Main.initRenderer = function()
{
	CORE.Main.renderer.setClearColor(0x000000);
	CORE.Main.renderer.setPixelRatio(window.devicePixelRatio);
	CORE.Main.renderer.setSize(CORE.Main.Width, CORE.Main.Height);
	//CORE.Main.renderer.physicallyCorrectLights = true;
	//CORE.Main.renderer.toneMapping = THREE.ReinhardToneMapping;
	//CORE.Main.renderer.gammaInput = true;
	//CORE.Main.renderer.gammaOutput = true;
	//CORE.WindowResize(CORE.Main.renderer, CORE.Main.camera);
	//CORE.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});
	//CORE.Main.renderer.shadowMap.enabled = CORE.Conf.Shadow;
}

CORE.Main.initCamera = function()
{
	/*if (CORE.Main.cameraType == 1)
		CORE.Main.CameraControls();*/
	/**/

	CORE.Main.camera.position.set(7, 5, 7);
	//CORE.Main.camera.rotation.set(0, 0, 0);
	CORE.Main.camera.lookAt(new THREE.Vector3(0, 2, 0));

	//var ambientLight = new THREE.AmbientLight(0x464646);/*d2d2d2*/
	//CORE.Main.scene.add(ambientLight);

	/*var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
				dirLight.color.setHSL( 0.1, 1, 0.95 );
				dirLight.position.set( -1, 1.75, 1 );
				dirLight.position.multiplyScalar( 50 );
	CORE.Main.scene.add( dirLight );
				dirLight.castShadow = true;
				dirLight.shadow.mapSize.width = 2048;
				dirLight.shadow.mapSize.height = 2048;*/
				
	/*var bulbGeometry = new THREE.SphereGeometry(0.12, 16, 8);
	var bulbMat = new THREE.MeshStandardMaterial({emissive: 0xffffee, emissiveIntensity: 1, color: 0x000000});

	light = new THREE.DirectionalLight(0xffffff, 1);
	light.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
	//light.position.set(-12, 30, 16);
	light.target.position.set(0, 0, 0);
	light.castShadow = CORE.Conf.Shadow;
	CORE.Main.scene.add(light);*/

/**/

}

CORE.Main.CameraControls = function()
{
	CORE.Main.camera.rotation.set(0, 0, 0);
	CORE.Main.pitchCamera.add(CORE.Main.camera);

	CORE.Main.yawCamera.position.y = CORE.Main.yawCameraOffsetY;
	CORE.Main.yawCamera.add(CORE.Main.pitchCamera);
	CORE.Main.scene.add(CORE.Main.yawCamera);
}

CORE.Main.initScene = function()
{
	/*var axisHelper = new THREE.AxisHelper(1);
	axisHelper.position.set(-1, 0, -2);
	CORE.Main.scene.add(axisHelper);*/
}

CORE.Main.onMouseMove = function(event)
{
	if (CORE.Main.ControlPlayer === false)
		return;
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	var PI2 = Math.PI / 2;
	var PI3 = Math.PI / 3;

	if (CORE.Player.mesh && CORE.Main.cameraType == 2)
	{

		if (CORE.Player.Weap1)
		{
			CORE.Player.mesh.rotation.y -= movementX * 0.002;
			//CORE.Player.mesh.rotation.x -= movementY * 0.002;
			//CORE.Player.mesh.skeleton.bones[14].rotation.z += movementY * 0.002;
			//CORE.Player.mesh.skeleton.bones[14].rotation.z = Math.max(- PI3/2, Math.min(PI3/2, CORE.Player.mesh.skeleton.bones[14].rotation.z)); 
			CORE.Player.mesh.rotation.x = Math.max(- PI2, Math.min(PI2, CORE.Player.mesh.rotation.x));
		}
		else
		{
			CORE.Player.mesh.rotation.y -= movementX * 0.002;
			//CORE.Player.mesh.rotation.x -= movementY * 0.002;
			//CORE.Player.mesh.skeleton.bones[14].rotation.z += movementY * 0.002;
			//CORE.Player.mesh.skeleton.bones[14].rotation.z = Math.max(- PI3, Math.min(PI3/2, CORE.Player.mesh.skeleton.bones[14].rotation.z)); 
			CORE.Player.mesh.rotation.x = Math.max(- PI2, Math.min(PI2, CORE.Player.mesh.rotation.x));
		}
	}
	else if (CORE.Main.cameraType == 1)
	{
		CORE.Main.yawCamera.rotation.y -= movementX * 0.002;
		CORE.Main.pitchCamera.rotation.x -= movementY * 0.002;
		CORE.Main.pitchCamera.quaternion.normalize();

		if (CORE.Player.Weap1)
		{
			CORE.Player.mesh.skeleton.bones[14].rotation.z += movementY * 0.002;
			CORE.Player.mesh.skeleton.bones[14].rotation.z = Math.max(- PI3/2, Math.min(PI3/2, CORE.Player.mesh.skeleton.bones[14].rotation.z)); 
		}
		CORE.Main.pitchCamera.rotation.x = Math.max(- PI3/2, Math.min(PI3/2, CORE.Main.pitchCamera.rotation.x));
		CORE.Main.camera.updateProjectionMatrix();
	}
}

CORE.Main.DisposeMouseMove = function()
{
	document.removeEventListener('mousemove', CORE.Main.onMouseMove, false);
}

document.addEventListener('mousemove', CORE.Main.onMouseMove, false);


CORE.Main.AnimationFrame = function()
{
	requestAnimationFrame(CORE.Main.AnimationFrame);
	if (CORE.Network.Auth)
		CORE.Main.Render();
}

CORE.Main.UpdateNetWork = function(_delta)
{
	if (CORE.Player.mesh)
	{
		CORE.Network.setDataPlayer(CORE.Player.mesh);
		CORE.Network.SMG_PLAYER();

		for (var i = 0; i < CORE.Network.players.length; i++)
		{
			if (CORE.Network.players[i] != null && CORE.Network.players[i].id != CORE.Network.player.id)
			{
				var check = 'm_' + CORE.Network.players[i].login;
				var _player = CORE.Main.scene.getObjectByName(check);
				if (_player == undefined)
				{
					CORE.Network.LoadNewPlayer(i, check, CORE.Main.scene);
				}
				else
				{
					_player.position.set(CORE.Network.players[i].position.x, CORE.Network.players[i].position.y, CORE.Network.players[i].position.z);
					_player.rotation.y = CORE.Network.players[i].rot_y;
					CORE.Network.Anim.Update(i, _delta, _player);
					_player.skeleton.bones[14].rotation.z = CORE.Network.players[i].bones.bip01_spine2.rotation.z; // временно пока z
				}
			}
		}
	}
}

CORE.Main.UpdateCamera = function()
{
	if (CORE.Player.mesh && CORE.Main.cameraType == 2)
	{
		var relativeCameraOffset = new THREE.Vector3(CORE.Main.VectorCameraOffset.x, CORE.Main.VectorCameraOffset.y, CORE.Main.VectorCameraOffset.z);
		var CameraOffset = relativeCameraOffset.applyMatrix4(CORE.Player.mesh.matrixWorld);

		CORE.Main.camera.position.x = CameraOffset.x;
		CORE.Main.camera.position.y = CameraOffset.y;
		CORE.Main.camera.position.z = CameraOffset.z;
		var position = new THREE.Vector3(CORE.Player.mesh.position.x, CORE.Player.mesh.position.y + 1.5, CORE.Player.mesh.position.z);
		CORE.Main.camera.lookAt(position);
	}
	else if (CORE.Player.mesh && CORE.Main.cameraType == 1)
	{
		CORE.Main.yawCamera.position.x = CORE.Player.mesh.position.x;
		CORE.Main.yawCamera.position.y = CORE.Player.mesh.position.y + CORE.Main.yawCameraOffsetY;
		CORE.Main.yawCamera.position.z = CORE.Player.mesh.position.z;
		CORE.Player.mesh.rotation.y = CORE.Main.yawCamera.rotation.y;
		//CORE.Player.mesh.rotation.x = CORE.Main.yawCamera.rotation.x;
	}
}

CORE.Main.UpdateData = function(time, _delta)
{
	CORE.Player.Update(time, _delta);
	CORE.Weapon.Update(_delta);
	CORE.Hand.Update(_delta);
	CORE.WPNHud.Update(_delta);
	CORE.Bullet.Update(_delta);
}

var lobbyl = false;
CORE.Main.Render = function()
{
	var delta = (Date.now() - CORE.Main.time);

	/*if (!CORE.LoaderObjects.LoadObj)
	{
		CORE.LoaderObjects.LoadObjects();
		CORE.LoaderObjects.LoadObj = true;
	}
	else if(CORE.LoaderObjects.LoadFinish && !CORE.Sky.Loaded)
	{
		// load lobby
		CORE.Network.SMG_TIMEGAME();
		CORE.Maps.LoadLobby(CORE.Main.scene);
		CORE.Sky.Load(CORE.Main.scene);
		CORE.Sky.Loaded = true;
		CORE.Light.INIT(CORE.Main.scene, CORE.Network.time.h);
		CORE.Light.Loaded = true;
		lobbyl = true;
	}
	else if (lobbyl)
	{
		CORE.Network.SMG_TIMEGAME();*/
		//var time = CORE.Network.time.h*60 + CORE.Network.time.m;
		//light.position.x = 10 * Math.cos(time/** 0.0003*/);
		//light.position.y = 10 * Math.sin(time/** 0.0003*/);
	//}
	//if (!CORE.Main.ControlPlayer)
		//return;

	/*var _delta = 0.75 * CORE.Main.clock.getDelta();
	var time = performance.now();
	if (CORE.Network.inGame)
	{
		// anims game
		//var delta = (time - CORE.Main.prevTime)/1000;
	
		CORE.Main.UpdateNetWork(_delta);
		CORE.Main.UpdateCamera();
		CORE.Main.UpdateData(time, _delta);
	}
	CORE.Particle.Update(_delta*0.4);
	light.position.x = 10 * Math.cos(time* 0.0003);
	light.position.y = 10 * Math.sin(time* 0.0003);*/
	
	//if (CORE.Light.Loaded) CORE.Light.Update(CORE.Network.time.h);
	
	CORE.Lobby.Update(CORE.Main.clock.getDelta());
	//update light
	//CORE.Network.SMG_TIMEGAME();
	CORE.Light.Update(CORE.Network.time.h);
	
	CORE.Main.stats.update();
	//math time
	CORE.Main.time = Date.now();
	
	CORE.Main.renderer.render(CORE.Main.scene, CORE.Main.camera);
}

CORE.Main.initPlayers = function(_data)
{
	CORE.Player.loadPlayer(CORE.Main.scene, _data.position);
	CORE.Weapon.loadWpn('wpn_pm.js', CORE.Main.scene);
	CORE.WPNHud.Load(CORE.Main.scene, 'pm');
	CORE.Hand.Load(CORE.Main.scene, 'pm');
}

CORE.Main.onWindowResize = function()
{
	CORE.Main.camera.aspect = CORE.Main.Width / CORE.Main.Height;
	CORE.Main.camera.updateProjectionMatrix();
	CORE.Main.renderer.setSize(CORE.Main.Width, CORE.Main.Height);
}