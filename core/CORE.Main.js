/** @namespace */
var CORE  = CORE || {};
CORE.Main = CORE.Main || {};

CORE.Main.renderer 		= new THREE.WebGLRenderer({antialias: true});
CORE.Main.ControlPlayer 	= false;
CORE.Main.camera 		= new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.001, 9000);
CORE.Main.cameraType		= 1;

CORE.Main.pitchCamera 		= new THREE.Object3D();
CORE.Main.yawCamera 		= new THREE.Object3D();
CORE.Main.yawCameraOffsetY	= 1.65;
CORE.Main.VectorCameraOffset 	= new THREE.Vector3(0, 2.5, 2.5);

CORE.Main.scene = new THREE.Scene();
CORE.Main.clock = new THREE.Clock();
CORE.Main.prevTime = performance.now();

CORE.Main.INIT = function()
{
	CORE.Network.INT();

	CORE.Main.initRenderer();
	CORE.Main.initCamera();
	CORE.Main.initScene();
	//CORE.Main.initPlayers();
	CORE.Zone.Load('zone.js', CORE.Main.scene);
	//window.addEventListener('resize', CORE.Main.onWindowResize, false);
}

CORE.Main.initRenderer = function()
{
	CORE.Main.renderer.setClearColor(0x00ffff);
	CORE.Main.renderer.setPixelRatio(window.devicePixelRatio);
	CORE.Main.renderer.setSize(window.innerWidth, window.innerHeight);
	CORE.WindowResize(CORE.Main.renderer, CORE.Main.camera);
	CORE.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});
	CORE.Main.renderer.shadowMapEnabled = false;
}

CORE.Main.initCamera = function()
{
	if (CORE.Main.cameraType == 1)
		CORE.Main.CameraControls();
	/**/
	var ambientLight = new THREE.AmbientLight(0xd2d2d2);
	CORE.Main.scene.add(ambientLight);

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 15, 0);
	light.castShadow = false;
	CORE.Main.scene.add(light);
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
	var axisHelper = new THREE.AxisHelper(1);
	axisHelper.position.set(-1, 0, -2);
	CORE.Main.scene.add(axisHelper);
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

CORE.Main.Render = function ()
{
	//if (!CORE.Main.ControlPlayer)
		//return;

	// anims game
	var time = performance.now();
	//var delta = (time - CORE.Main.prevTime)/1000;
	var _delta = 0.75 * CORE.Main.clock.getDelta();

	// network
	if (CORE.Player.mesh)
	{
		CORE.Network.setDataPlayer(CORE.Player.mesh);
		CORE.Network.SMG_PLAYER();
	}

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

	CORE.Player.Update(time, _delta);
	CORE.Weapon.Update(_delta);
	CORE.Hand.Update(_delta);
	CORE.WPNHud.Update(_delta);
	CORE.Bullet.Update(_delta);

	CORE.Main.renderer.clear();
	CORE.Main.renderer.clearDepth();
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
	CORE.Main.camera.aspect = window.innerWidth / window.innerHeight;
	CORE.Main.camera.updateProjectionMatrix();
	CORE.Main.renderer.setSize(window.innerWidth, window.innerHeight);
}