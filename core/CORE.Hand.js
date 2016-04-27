var CORE = CORE || {};
CORE.Hand = CORE.Hand || {};

CORE.Hand.loader 		= new THREE.JSONLoader();
CORE.Hand.mesh 			= null;
CORE.Hand.AnimationMixer 	= null;
CORE.Hand.Actions 		= new Array();
CORE.Hand.meshOffset 		= 1.5;
CORE.Hand.VectorOffset 		= new THREE.Vector3(0, 1.52, 0.1);//new THREE.Vector3(0, 1.5, 0.1);
CORE.Hand.VectorOffsetB2	= new THREE.Vector3(0, 1.52, 0.1);//new THREE.Vector3(-0.105, 1.55, 0.18);
CORE.Hand.LoopOnce 		= [];//[0, 1, 4, 5];
CORE.Hand.Weap1Anim1 		= true;
CORE.Hand.Weap1Anim2 		= true;
CORE.Hand.WeapAttack 		= false;
CORE.Hand.WeapReload 		= false;
CORE.Hand.WeapReloadAnim 	= true;
CORE.Hand.Weap 			= null;

CORE.Hand.Load = function(_scene, _weap)
{
	CORE.Hand.Weap = CORE.WPNHud.getWeapon(_weap);
	CORE.Hand.LoopOnce = CORE.Hand.Weap.LoopOnceHand;
	CORE.Hand.loader.load('meshes/weapons/hand_blue.js', function(geometry, materials)
	{
		geometry.computeVertexNormals();
		for (var i = 0; i < materials.length; i++)
		{
			materials[i].skinning = true;
			materials[i].morphTargets = true;
		}
		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		CORE.Hand.mesh = new THREE.SkinnedMesh(geometry, faceMaterial);
		CORE.Hand.AnimationMixer = new THREE.AnimationMixer(CORE.Hand.mesh);

		for (var i = 0; i < geometry.animations.length; i++)
		{
			CORE.Hand.Actions[i] = CORE.Hand.AnimationMixer.clipAction(geometry.animations[i], CORE.Hand.mesh);
			CORE.Hand.Actions[i].play(CORE.Hand.AnimationMixer);
			if (i != 1) CORE.Hand.Actions[i].enabled = false;
		}

		for (var i = 0; i < CORE.Hand.LoopOnce.length; i++)
		{
			CORE.Hand.Actions[CORE.Hand.LoopOnce[i]].loop = THREE.LoopOnce;
			CORE.Hand.Actions[CORE.Hand.LoopOnce[i]].clampWhenFinished = true;
		}
		CORE.Hand.mesh.visible = false;

		_scene.add(CORE.Hand.mesh);

	});
}

CORE.Hand.Aims = function()
{
	if (CORE.Player.Weap1 && !CORE.Player.mButton1 && !CORE.Hand.WeapAttack && !CORE.Player.ReloadAnim)
	{
		CORE.Hand.mesh.visible = true;
		CORE.Hand.WeapReloadAnim = true;
		CORE.WPNHud.ReloadAnim = true;
		CORE.WPNHud.Hide(true);

		if (CORE.Hand.Weap1Anim1 && !CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[0]].isRunning())
		{
			CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[0]].reset();
			CORE.Hand.Weap1Anim1 = false;
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[0]].isRunning() && CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[0]].time == CORE.Hand.Weap.HandTimes[0])
		{
			CORE.Hand.Weap1Anim2 = true;
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[2]);
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[0]].isRunning())
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[0]);
		}
		else if (CORE.Player.mFor || CORE.Player.mLeft || CORE.Player.mRight || CORE.Player.mBack)
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[3]);
		}
		else
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[2]);
		}
	}
	else if (CORE.Player.Weap1 && CORE.Player.ReloadAnim)
	{
		if (!CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[4]].isRunning() && !CORE.Hand.WeapReload && CORE.Hand.WeapReloadAnim)
		{
			CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[4]].reset();
			CORE.Hand.WeapReload = true;
			CORE.Hand.WeapReloadAnim = false;
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[4]].isRunning() && CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[4]].time == CORE.Hand.Weap.HandTimes[4])
		{
			CORE.Hand.WeapReload = false;
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[2]);
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[4]].isRunning())
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[4]);
		}
	}
	else if (CORE.Player.Weap1)
	{
		if (CORE.Player.mButton1 && !CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[5]].isRunning() && CORE.WPNHud.Rate())
		{
			CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[5]].reset();
			CORE.Hand.WeapAttack = true;
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[5]].isRunning() && CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[5]].time == CORE.Hand.Weap.HandTimes[5])
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[2]);
			CORE.Hand.WeapAttack = false;
		}
		else if (CORE.Hand.WeapAttack && CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[5]].isRunning())
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[5]);
		}
	}
	else if (!CORE.Player.Weap1)
	{
		if (CORE.Hand.Weap1Anim2 && !CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[1]].isRunning())
		{
			CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[1]].reset();
			CORE.Hand.Weap1Anim2 = false;
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[1]].isRunning() && CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[1]].time == CORE.Hand.Weap.HandTimes[1])
		{
			CORE.Hand.Weap1Anim1 = true;
			CORE.Hand.mesh.visible = false;
			CORE.WPNHud.Hide(false);
			//CORE.Hand.AimsEnabled(2);
		}
		else if (CORE.Hand.Actions[CORE.Hand.Weap.AnimsHand[1]].isRunning())
		{
			CORE.Hand.AimsEnabled(CORE.Hand.Weap.AnimsHand[1]);
		}
	}
}

CORE.Hand.AimsEnabled = function(_id)
{
	CORE.Hand.Actions[_id].enabled = true;
	for (var i = 0; i < CORE.Hand.Actions.length; i++)
	{
		if (i != _id)
			CORE.Hand.Actions[i].enabled = false;
	}
}
CORE.Hand.Update = function(_delta)
{
	if (CORE.Player.mesh/* && CORE.Main.cameraType == 1*/)
	{
		var relativeOffset;
		if (CORE.Player.mButton2)
			relativeOffset = new THREE.Vector3(CORE.Hand.VectorOffsetB2.x, CORE.Hand.VectorOffsetB2.y, CORE.Hand.VectorOffsetB2.z);
		else
			relativeOffset = new THREE.Vector3(CORE.Hand.VectorOffset.x, CORE.Hand.VectorOffset.y, CORE.Hand.VectorOffset.z);
		var Offset = relativeOffset.applyMatrix4(CORE.Player.mesh.matrixWorld);

		CORE.Hand.mesh.position.x = Offset.x;
		CORE.Hand.mesh.position.y = Offset.y;
		CORE.Hand.mesh.position.z = Offset.z;
		CORE.Hand.mesh.skeleton.bones[1].rotation.x = CORE.Main.pitchCamera.rotation.x;

		var qm = new THREE.Quaternion();
		var axis = CORE.Main.yawCamera.rotation.y;
		qm.setFromAxisAngle (new THREE.Vector3(0,1,0), axis);
		CORE.Hand.mesh.quaternion.copy(qm);
		CORE.Hand.mesh.quaternion.normalize();
	}
	if(CORE.Hand.AnimationMixer && CORE.Hand.mesh /*&& CORE.Main.cameraType == 1*/)
	{
		CORE.Hand.AnimationMixer.update(_delta);
		CORE.Hand.Aims();
	}
}