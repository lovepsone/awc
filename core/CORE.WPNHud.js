/** @namespace */
var CORE  = CORE || {};
CORE.WPNHud = CORE.WPNHud || {};

CORE.WPNHud.loader 		= new THREE.JSONLoader();
CORE.WPNHud.mesh 		= null;
CORE.WPNHud.Weap 		= null;
CORE.WPNHud.AnimationMixer 	= null;
CORE.WPNHud.Actions 		= new Array();
CORE.WPNHud.FlipBip1		= false;
CORE.WPNHud.Reload 		= false;
CORE.WPNHud.ReloadAnim		= false;
CORE.WPNHud.Sil 		= false;
CORE.WPNHud.Attack 		= false;
CORE.WPNHud._Rate 		= false;
CORE.Hand.Time1 		= new Date();
CORE.Hand.Time2 		= null;

CORE.WPNHud.Load = function(_scene, _name)
{
	CORE.WPNHud.Weap = CORE.WPNHud.getWeapon(_name);
	CORE.WPNHud.loader.load('meshes/weapons/' + CORE.WPNHud.Weap.NameFileHud, function(geometry, materials)
	{
		geometry.computeVertexNormals();
		for (var i = 0; i < materials.length; i++)
		{
			materials[i].skinning = true;
			materials[i].morphTargets = true;
		}
		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		CORE.WPNHud.mesh = new THREE.SkinnedMesh(geometry, faceMaterial);
		CORE.WPNHud.AnimationMixer = new THREE.AnimationMixer(CORE.Hand.mesh);

		for (var i = 0; i < geometry.animations.length; i++)
		{
			CORE.WPNHud.Actions[i] = CORE.WPNHud.AnimationMixer.clipAction(geometry.animations[i], CORE.WPNHud.mesh);
			CORE.WPNHud.Actions[i].play(CORE.WPNHud.AnimationMixer);
			if (i != 0) CORE.WPNHud.Actions[i].enabled = false;
		}
		CORE.WPNHud.mesh.name = "weap1";
		CORE.WPNHud.Actions[CORE.WPNHud.Weap.LoopOnce[0]].loop = THREE.LoopOnce;
		CORE.WPNHud.Actions[CORE.WPNHud.Weap.LoopOnce[0]].clampWhenFinished = true;
		CORE.WPNHud.Actions[CORE.WPNHud.Weap.LoopOnce[1]].loop = THREE.LoopOnce;
		CORE.WPNHud.Actions[CORE.WPNHud.Weap.LoopOnce[1]].clampWhenFinished = true;
		CORE.WPNHud.HideSil();
		CORE.WPNHud.mesh.visible = false;

		_scene.add(CORE.WPNHud.mesh);

	});
}

CORE.WPNHud.getWeapon = function(_name)
{
	var result = {};
	switch (_name)
	{
	  case 'pm':
	    result = CORE.WPNConf.pm;
	    break;
	  /*case :
	    
	    break;
	  default:
	    
	    break;*/
	}
	return result;
}

CORE.WPNHud.HideSil = function()
{
	if (CORE.WPNHud.Weap.Sil)
		CORE.WPNHud.mesh.material.materials[CORE.WPNHud.Weap.TSil].visible = CORE.WPNHud.Sil;
}

CORE.WPNHud.Rate = function()
{
	var _rate = CORE.WPNHud.Weap.Character.Rate; //fix

	var a = 60/_rate*1000;
	CORE.Hand.Time2 = new Date();
	if (CORE.Hand.Time2 - CORE.Hand.Time1 > a)
	{
		CORE.Hand.Time1 = CORE.Hand.Time2;
		CORE.WPNHud._Rate = true;
		return true;
	}
	return false;
	
}

CORE.WPNHud.AnimsEnabled = function(_id)
{
	CORE.WPNHud.Actions[_id].enabled = true;

	for (var i = 0; i < CORE.WPNHud.Actions.length; i++)
	{
		if (i != _id)
			CORE.WPNHud.Actions[i].enabled = false;
	}
}

CORE.WPNHud.Anims = function()
{
	CORE.WPNHud.mesh.position.set(CORE.Player.mesh.position.x, CORE.Hand.mesh.position.y, CORE.Player.mesh.position.z);
	//CORE.WPNHud.mesh.rotation.y = CORE.Hand.mesh.rotation.y;
	CORE.Hand.mesh.skeleton.bones[41].add(CORE.WPNHud.mesh.skeleton.bones[CORE.WPNHud.Weap.ShellBone]);

	/*if (CORE.Player.mBack)
	{
		CORE.WPNHud.mesh.position.z -=0.1;
	}*/

	if (!CORE.WPNHud.FlipBip1)
	{
		for (var i = 0; i < CORE.WPNHud.Weap.idBoneRot.length; i++)
		{
			CORE.WPNHud.mesh.skeleton.bones[CORE.WPNHud.Weap.idBoneRot[i]].rotation.x = CORE.WPNHud.Weap.BoneRot[i].x;
			CORE.WPNHud.mesh.skeleton.bones[CORE.WPNHud.Weap.idBoneRot[i]].rotation.y = CORE.WPNHud.Weap.BoneRot[i].y;
			CORE.WPNHud.mesh.skeleton.bones[CORE.WPNHud.Weap.idBoneRot[i]].rotation.z = CORE.WPNHud.Weap.BoneRot[i].z;
		}
		for (var i = 0; i < CORE.WPNHud.Weap.idBonePos.length; i++)
			CORE.WPNHud.mesh.skeleton.bones[CORE.WPNHud.Weap.idBonePos[i]].position.copy(CORE.WPNHud.Weap.BonePos[i]);
		CORE.WPNHud.FlipBip1 = true;
	}

	if (CORE.Player.ReloadAnim && CORE.WPNHud.ReloadAnim)
	{
		if (!CORE.WPNHud.Reload && !CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[1]].isRunning())
		{
			CORE.WPNHud.Reload = true;
			CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[1]].reset();
		}
		else if (CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[1]].isRunning() && CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[1]].time == CORE.WPNHud.Weap.Times[1])
		{
			CORE.WPNHud.AnimsEnabled(CORE.WPNHud.Weap.Anims[0]);
			CORE.WPNHud.ReloadAnim = false
			CORE.WPNHud.Reload = false;
		}
		else if (CORE.WPNHud.Reload && CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[1]].isRunning())
		{
			CORE.WPNHud.AnimsEnabled(CORE.WPNHud.Weap.Anims[1]);
		}		
	}
	else if (/*CORE.Player.mButton1 && */CORE.Hand.WeapAttack && CORE.WPNHud._Rate)
	{
		if (CORE.Player.mButton1 && !CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[2]].isRunning())
		{
			CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[2]].reset();
			var relativeOffset;
			if (CORE.Player.mButton2)
			{
				relativeOffset = new THREE.Vector3().copy(CORE.WPNHud.Weap.BulletOffset2);
			}
			else
			{
				relativeOffset = new THREE.Vector3().copy(CORE.WPNHud.Weap.BulletOffset);
			}
			var position = relativeOffset.applyMatrix4(CORE.Hand.mesh.matrixWorld);

			var rotation = new THREE.Vector3(CORE.Hand.mesh.skeleton.bones[1].rotation.x, CORE.Player.mesh.rotation.y, 0);
			CORE.Bullet.Create(position, rotation, CORE.WPNHud.Weap.Character, performance.now()/1000);
			CORE.WPNHud.Attack = true;
		}
		else if (CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[2]].isRunning() && CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[2]].time == CORE.WPNHud.Weap.Times[2])
		{
			CORE.WPNHud.AnimsEnabled(CORE.WPNHud.Weap.Anims[0]);
			CORE.WPNHud.Attack = false;
			CORE.WPNHud._Rate = false;
		}
		else if (CORE.WPNHud.Attack && CORE.WPNHud.Actions[CORE.WPNHud.Weap.Anims[2]].isRunning())
		{
			CORE.WPNHud.AnimsEnabled(CORE.WPNHud.Weap.Anims[2]);
			// מעהאקא
			//CORE.Main.pitchCamera.rotation.x += CORE.WPNHud.Weap.Character.Return* 0.01;
			//CORE.Player.mesh.skeleton.bones[14].rotation.z += CORE.WPNHud.Weap.Character.Return* 0.01;
		}
	}
}

CORE.WPNHud.Hide = function(val)
{
	CORE.WPNHud.mesh.visible = val;
}

CORE.WPNHud.Update = function(_delta)
{
	if(CORE.WPNHud.AnimationMixer && CORE.WPNHud.mesh && CORE.Player.mesh)
	{
		CORE.WPNHud.AnimationMixer.update(_delta);
		CORE.WPNHud.Anims();
	}
}