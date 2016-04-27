/** @namespace */
var CORE  = CORE || {};
CORE.Weapon = CORE.Weapon || {};

CORE.Weapon.loader = new THREE.JSONLoader();
CORE.Weapon.mesh1 = null;
CORE.Weapon.Sil1 = false;
CORE.Weapon.FlipBip1 = false;

CORE.Weapon.AnimationMixer = null;
CORE.Weapon.Actions = null;

CORE.Weapon.loadWpn = function(_name, _scene)
{
	CORE.Player.loader.load('meshes/weapons/' + _name, function(geometry, materials)
	{
		for (var i = 0; i < materials.length; i++)
		{
			materials[i].skinning = true;
			materials[i].morphTargets = true;
		}
		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		CORE.Weapon.mesh1 = new THREE.SkinnedMesh(geometry, faceMaterial);

		CORE.Weapon.AnimationMixer = new THREE.AnimationMixer(CORE.Weapon.mesh1);
		CORE.Weapon.Actions = CORE.Weapon.AnimationMixer.clipAction(geometry.animations[0], CORE.Weapon.mesh1);
		CORE.Weapon.Actions.play(CORE.Weapon.AnimationMixer);
		CORE.Weapon.mesh1.visible = false;

		_scene.add(CORE.Weapon.mesh1);
	});
}

CORE.Weapon.Hide = function(hand, val)
{
	CORE.Weapon.mesh1.visible = val;
}

CORE.Weapon.HideSil = function()
{
	CORE.Weapon.mesh1.material.materials[1].visible = CORE.Weapon.Sil1;
}

CORE.Weapon.Update = function(_delta)
{
	//var _delta = 0.75 * CORE.Main.clock.getDelta();
	if(CORE.Weapon.AnimationMixer && CORE.Weapon.mesh1)
	{
		CORE.Weapon.AnimationMixer.update(_delta);
		CORE.Weapon.HideSil();
		CORE.Weapon.mesh1.position.z =+0.1;
	}

	if (CORE.Player.mesh)
	{
		CORE.Weapon.mesh1.position.x = CORE.Player.mesh.position.x;
		CORE.Weapon.mesh1.position.z = CORE.Player.mesh.position.z;
		CORE.Weapon.mesh1.position.y = CORE.Player.mesh.position.y;
		CORE.Weapon.mesh1.rotation.y = CORE.Player.mesh.rotation.y;
		CORE.Player.mesh.skeleton.bones[41].add(CORE.Weapon.mesh1.skeleton.bones[0]);
	}

	if (CORE.Player.mesh && CORE.Player.AnimationMixer && !CORE.Weapon.FlipBip1)
	{
		//console.log(CORE.Weapon.mesh1.skeleton);
		CORE.Player.mesh.skeleton.bones[41].add(CORE.Weapon.mesh1.skeleton.bones[0]);
		CORE.Weapon.mesh1.skeleton.bones[0].rotation.y += Math.PI/2;
		CORE.Weapon.mesh1.skeleton.bones[1].rotation.x += Math.PI/2;
		CORE.Weapon.mesh1.skeleton.bones[1].position.x -= 0.02; 
		CORE.Weapon.mesh1.skeleton.bones[0].position.x -= 0.15;
		CORE.Weapon.mesh1.skeleton.bones[0].position.z += 0.05;
		CORE.Weapon.FlipBip1 = true;

	}
}