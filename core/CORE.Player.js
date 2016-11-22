/** @namespace */
var CORE  = CORE || {};
CORE.Player = CORE.Player || {};
CORE.Player.Anim = CORE.Player.Anim || {};
CORE.Player.Speed = CORE.Player.Speed || {};

CORE.Player.loader = new THREE.JSONLoader();

CORE.Player.velocity 	= new THREE.Vector3();
CORE.Player.mForRun    	= false;
CORE.Player.mFor   	= false;
CORE.Player.mBack  	= false;
CORE.Player.mLeft  	= false;
CORE.Player.mRight 	= false;

CORE.Player.Speed.f	= CORE.Conf.SpeedForward;
CORE.Player.mButton1 	= false;
CORE.Player.mButton2 	= false;
CORE.Player.Attack	= false;

CORE.Player.Raycaster	= new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 1 );

CORE.Player.Weap1  	= false;
CORE.Player.Weap1Anim1  = false;
CORE.Player.Weap1Anim2  = false;
CORE.Player.ReloadAnim	= false;
CORE.Player.Reload	= false;

CORE.Player.mesh = null;
CORE.Player.GeometryAnimations = null;
CORE.Player.AnimationMixer = null;
CORE.Player.Actions = new Array();

// все что связано с анимацияй
CORE.Player.Anim.bones	= {
"flipRoot"		: [0,  1,  2],	// 0
"root_stalker"		: [3,  4,  5],	// 1 от таза до земли
"bip01"			: [6,  7,  8],	// 2 от таза до земли
"bip01_pelvis"		: [9,  10, 11], // 3 от таза до земли
"bip01_l_thigh"		: [12, 13, 14], // 4 от таза до левой ноги
"bip01_l_calf"		: [15, 16, 17], // 5 левая ляшка
"bip01_l_foot"		: [18, 19, 20], // 6 левая голень
"bip01_l_toe0"		: [21, 22, 23], // 7 левая ступня
"bip01_r_thigh"		: [24, 25, 26],	// 8 от таза до правой ноги
"bip01_r_calf"		: [27, 28, 29],	// 9 правая ляшка
"bip01_r_foot"		: [30, 31, 32],	// 10 правая голень
"bip01_r_toe0"		: [33, 34, 35],	// 11 правая ступня
"bip01_spine"		: [36, 37, 38], // 12 от таза до спины
"bip01_spine1"		: [39, 40, 41], // 13 спина
"bip01_spine2"		: [42, 43, 44], // 14 спина, шея
"bip01_neck"		: [45, 46, 47],	// 15 шея
"bip01_head"		: [48, 49, 50], // 16 голова
"eye_left"		: [51, 52, 53], // 17 глаз
"eye_right"		: [54, 55, 56], // 18 глаз
"eyelid_1"		: [57, 58, 59], // 19
"jaw_1"			: [60, 61, 62], // 20
"bip01_l_clavicle"	: [63, 64, 65],	// 21
"bip01_l_upperarm"	: [66, 67, 68],	// 22
"bip01_l_forearm"	: [69, 70, 71],	// 23
"bip01_l_hand"		: [72, 73, 74],	// 24
"bip01_l_finger0"	: [75, 76, 77],	// 25
"bip01_l_finger01"	: [78, 79, 80],	// 26
"bip01_l_finger02"	: [81, 82, 83],	// 27
"bip01_l_finger1"	: [84, 85, 86],	// 28
"bip01_l_finger11"	: [87, 88, 89],	// 29
"bip01_l_finger12"	: [90, 91, 92],	// 30
"bip01_l_finger2"	: [93, 94, 95],	// 31+
"bip01_l_finger21"	: [96, 97, 98],
"bip01_l_finger22"	: [ 99, 100, 101],
"bip01_r_clavicle"	: [102, 103, 104],
"bip01_r_upperarm"	: [105, 106, 107],
"bip01_r_forearm"	: [108, 109, 110],
"bip01_r_hand"		: [111, 112, 113],
"bip01_r_finger0"	: [114, 115, 116],
"bip01_r_finger01"	: [117, 118, 119],
"bip01_r_finger02"	: [120, 121, 122],
"bip01_r_finger1"	: [123, 124, 125],
"bip01_r_finger11"	: [126, 127, 128],
"bip01_r_finger12"	: [129, 130, 131],
"bip01_r_finger2"	: [132, 133, 134],
"bip01_r_finger21"	: [135, 136, 137],
"bip01_r_finger22"	: [138, 139, 140],
"bip01_tail"		: [141, 142, 143]
};

CORE.Player.Anim.LeftFoot		= [12, 23];
CORE.Player.Anim.RightFoot		= [24, 35];
CORE.Player.Anim.FullFoot		= [12, 35];
CORE.Player.Anim.LeftHand		= [63, 101];
CORE.Player.Anim.RightHand		= [102, 140];
CORE.Player.Anim.Head			= [48, 50];
CORE.Player.Anim.FullHands		= [63, 140];
CORE.Player.Anim.Spine			= [39, 47];//[36, 47];
CORE.Player.Anim.Eye			= [51, 62];
CORE.Player.Anim.FullHandsHead		= [39, 140];
CORE.Player.Anim.TrackCount		= 144;

CORE.Player.Anim.LoopOnce		= [6, 10, 12, 13, 14];
CORE.Player.Anim.RUNFOOT		= [0, 1, 2, 3, 4, 5, 8];
CORE.Player.Anim.RUNTORSO		= [6, 7, 9, 10, 11, 12, 13, 14];

CORE.Player.Anim.editor			= [];
CORE.Player.Anim.norm_run_fwd_1		= [];
CORE.Player.Anim.norm_run_fwd_2		= [];
CORE.Player.Anim.norm_run_ls_0		= [];
CORE.Player.Anim.norm_run_rs_0		= [];
CORE.Player.Anim.norm_run_back_0	= [];
CORE.Player.Anim.norm_torso_1_draw_0	= [];
CORE.Player.Anim.norn_torso_1_run_0	= [];
CORE.Player.Anim.norm_torso_1_noweap_0 	= [];
CORE.Player.Anim.norm_torso_1_aim_0	= [];
CORE.Player.Anim.norm_torso_1_drop_0	= [];
CORE.Player.Anim.norm_torso_1_noweap_1	= [];
CORE.Player.Anim.norm_torso_1_aim_1	= [];
CORE.Player.Anim.norm_torso_1_attack_0	= [];
CORE.Player.Anim.norm_torso_1_attack_1	= [];
CORE.Player.Anim.norm_torso_1_reload_0	= [];

CORE.Player.loadPlayer = function(_scene, _position)
{
	CORE.Player.loader.load('player_.js', function(geometry, materials)
	{
		geometry.computeVertexNormals();
		for (var i = 0; i < materials.length; i++)
		{
			materials[i].skinning = true;
			materials[i].morphTargets = true;
		}
		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		/*------ настройка анимаций------*/

		for (var i = 0;  i < 144; i++)
		{

			if (i < 42 || i > 44)
			{
				CORE.Player.Anim.editor[CORE.Player.Anim.editor.length] = geometry.animations[0].tracks[i];
				CORE.Player.Anim.norm_run_fwd_1[CORE.Player.Anim.norm_run_fwd_1.length] = geometry.animations[1].tracks[i];
			}
			if ( i < 42)
			{
				CORE.Player.Anim.norm_run_fwd_2[CORE.Player.Anim.norm_run_fwd_2.length] = geometry.animations[2].tracks[i];
				//CORE.Player.Anim.norm_run_ls_0[CORE.Player.Anim.norm_run_ls_0.length] = geometry.animations[3].tracks[i];
				//CORE.Player.Anim.norm_run_rs_0[CORE.Player.Anim.norm_run_rs_0.length] = geometry.animations[4].tracks[i];
				CORE.Player.Anim.norm_run_back_0[CORE.Player.Anim.norm_run_back_0.length] = geometry.animations[5].tracks[i];
				CORE.Player.Anim.norm_torso_1_noweap_0[CORE.Player.Anim.norm_torso_1_noweap_0.length] = geometry.animations[8].tracks[i];
			}
			if (i < 39)
			{
				CORE.Player.Anim.norm_run_ls_0[CORE.Player.Anim.norm_run_ls_0.length] = geometry.animations[3].tracks[i];
				CORE.Player.Anim.norm_run_rs_0[CORE.Player.Anim.norm_run_rs_0.length] = geometry.animations[4].tracks[i];
			}
			if ( i > 47)
			{
				CORE.Player.Anim.norm_torso_1_draw_0[CORE.Player.Anim.norm_torso_1_draw_0.length] = geometry.animations[6].tracks[i];
				CORE.Player.Anim.norn_torso_1_run_0[CORE.Player.Anim.norn_torso_1_run_0.length] = geometry.animations[7].tracks[i];
				CORE.Player.Anim.norm_torso_1_aim_0[CORE.Player.Anim.norm_torso_1_aim_0.length] = geometry.animations[9].tracks[i];
				CORE.Player.Anim.norm_torso_1_drop_0[CORE.Player.Anim.norm_torso_1_drop_0.length] = geometry.animations[10].tracks[i];
				CORE.Player.Anim.norm_torso_1_aim_1[CORE.Player.Anim.norm_torso_1_aim_1.length] = geometry.animations[11].tracks[i];
				CORE.Player.Anim.norm_torso_1_attack_0[CORE.Player.Anim.norm_torso_1_attack_0.length] = geometry.animations[12].tracks[i];
				CORE.Player.Anim.norm_torso_1_attack_1[CORE.Player.Anim.norm_torso_1_attack_1.length] = geometry.animations[13].tracks[i];
				CORE.Player.Anim.norm_torso_1_reload_0[CORE.Player.Anim.norm_torso_1_reload_0.length] = geometry.animations[14].tracks[i];
			}
		}
		geometry.animations[0].tracks = CORE.Player.Anim.editor;
		geometry.animations[1].tracks = CORE.Player.Anim.norm_run_fwd_1;
		geometry.animations[2].tracks = CORE.Player.Anim.norm_run_fwd_2;
		geometry.animations[3].tracks = CORE.Player.Anim.norm_run_ls_0;
		geometry.animations[4].tracks = CORE.Player.Anim.norm_run_rs_0;
		geometry.animations[5].tracks = CORE.Player.Anim.norm_run_back_0;
		geometry.animations[6].tracks = CORE.Player.Anim.norm_torso_1_draw_0;
		geometry.animations[7].tracks = CORE.Player.Anim.norn_torso_1_run_0;
		geometry.animations[8].tracks = CORE.Player.Anim.norm_torso_1_noweap_0;
		geometry.animations[9].tracks = CORE.Player.Anim.norm_torso_1_aim_0;
		geometry.animations[10].tracks = CORE.Player.Anim.norm_torso_1_drop_0;
		geometry.animations[11].tracks = CORE.Player.Anim.norm_torso_1_aim_1;
		geometry.animations[12].tracks = CORE.Player.Anim.norm_torso_1_attack_0;
		geometry.animations[13].tracks = CORE.Player.Anim.norm_torso_1_attack_1;
		geometry.animations[14].tracks = CORE.Player.Anim.norm_torso_1_reload_0;

		CORE.Player.mesh = new THREE.SkinnedMesh(geometry, faceMaterial);
		CORE.Player.mesh.name = "m_player";

		CORE.Player.GeometryAnimations = geometry.animations;
		CORE.Player.AnimationMixer = new THREE.AnimationMixer(CORE.Player.mesh);

		for (var i = 0; i < CORE.Player.GeometryAnimations.length; i++)
		{
			CORE.Player.Actions[i] = CORE.Player.AnimationMixer.clipAction(CORE.Player.GeometryAnimations[i], CORE.Player.mesh);
			CORE.Player.Actions[i].play(CORE.Player.AnimationMixer);
			if (i != 0)
				CORE.Player.Actions[i].enabled = false;
		}

		for (var i = 0; i < CORE.Player.Anim.LoopOnce.length; i++)
		{
			CORE.Player.Actions[CORE.Player.Anim.LoopOnce[i]].loop = THREE.LoopOnce;
			CORE.Player.Actions[CORE.Player.Anim.LoopOnce[i]].clampWhenFinished = true;// задерживает конечную позицию костей
		}
		CORE.Player.mesh.position.copy(_position);
		_scene.add(CORE.Player.mesh);
	});

	CORE.Player.Controls();

}

CORE.Player.Controls = function()
{
	var onKeyDown = function(event)
	{
		if (CORE.Network.Auth)
		{
			switch(event.keyCode)
			{
				case 38: // up, w
				case 87:
				{
					CORE.Player.mForRun  = true;
					CORE.Player.mFor = true;
					break;
				}
				case 37: // left, a
				case 65: { CORE.Player.mLeft = true; break; }
				case 40: // down, s
				case 83: { CORE.Player.mBack = true; break; }
				case 39: // right, d
				case 68: { CORE.Player.mRight = true; break; }
				case 49:
				{
					if (CORE.Player.Weap1)
					{
						CORE.Player.Weap1 	= false;
						CORE.Player.Weap1Anim2 	= true;
					}
					else
					{
						CORE.Weapon.Hide(1, true);
						CORE.Player.Weap1 	= true;
						CORE.Player.Weap1Anim1 	= true;
					}
					break;
				}
				case 82:
				{
					if (CORE.Player.Weap1)
					{
						CORE.Player.ReloadAnim = true;
						CORE.Player.Reload = true;
					}
					break;
				}
			}
		}
	};

	var onKeyUp = function(event)
	{
		if (CORE.Network.Auth)
		{
			switch(event.keyCode)
			{
				case 38: // up, w
				case 87:
				{
					CORE.Player.mFor = false;
					CORE.Player.mForRun = false;
					break;
				}
				case 37: // left, a
				case 65: { CORE.Player.mLeft = false; break; }
				case 40: // down, s
				case 83: { CORE.Player.mBack = false; break; }
				case 39: // right, d
				case 68: { CORE.Player.mRight = false; break; }
			}
		}
	};

	var onMoseDown = function(event)
	{
		switch(event.button)
		{
			case 0:
			{
				CORE.Player.mButton1 = true;
				break;
			}
			case 2:
			{
				CORE.Player.mButton2 = true;
				break;
			}
		}
	};

	var onMoseUp = function(event)
	{
		switch(event.button)
		{
			case 0:
			{
				CORE.Player.mButton1 = false;
				break;
			}
			case 2:
			{
				CORE.Player.mButton2 = false;
				break;
			}
		}
	};

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	document.addEventListener('mousedown', onMoseDown, false);
	document.addEventListener('mouseup', onMoseUp, false);
}
CORE.Player.Anim.EnableFoot = function(_id)
{
	CORE.Player.Actions[_id].enabled = true;

	for (var i = 0; i < CORE.Player.Actions.length; i++)
	{
		if (CORE.Player.Anim.RUNFOOT.indexOf(i) != -1 && i != _id)
		{
			CORE.Player.Actions[i].enabled = false;
		}
	}
}

CORE.Player.Anim.EnableTorso = function(_id)
{
	CORE.Player.Actions[_id].enabled = true;

	for (var i = 0; i < CORE.Player.Actions.length; i++)
	{
		if (CORE.Player.Anim.RUNTORSO.indexOf(i) != -1 && i != _id)
		{
			CORE.Player.Actions[i].enabled = false;
		}
	}
}

CORE.Player.Anim.FalseTorso = function()
{
	for (var i = 0; i < CORE.Player.Actions.length; i++)
	{
		if (CORE.Player.Anim.RUNTORSO.indexOf(i) != -1)
		{
			CORE.Player.Actions[i].enabled = false;
		}
	}
}

CORE.Player.Anim.PlayAnimsFoot = function()
{
	if (CORE.Player.mFor)
	{
		if (CORE.Player.Weap1)
		{
			CORE.Player.Anim.EnableFoot(2);
		}
		else
			CORE.Player.Anim.EnableFoot(1);

	}
	else if (CORE.Player.mLeft)
	{
		CORE.Player.mesh.skeleton.bones[13].rotation.x = Math.PI/4;
		CORE.Player.mesh.skeleton.bones[13].rotation.y = 0.1;
		CORE.Player.Anim.EnableFoot(3);
	}
	else if (CORE.Player.mBack)
	{
		CORE.Player.mesh.skeleton.bones[13].rotation.x = Math.PI/4;
		CORE.Player.mesh.skeleton.bones[13].rotation.y = 0.1;
		CORE.Player.Anim.EnableFoot(5);
	}
	else if (CORE.Player.mRight)
	{
		CORE.Player.mesh.skeleton.bones[13].rotation.x = Math.PI/4;
		CORE.Player.mesh.skeleton.bones[13].rotation.y = 0.1;
		CORE.Player.Anim.EnableFoot(4);
	}
	else
	{
		if (CORE.Player.Weap1 || CORE.Player.Actions[10].isRunning())
		{
			CORE.Player.Anim.EnableFoot(8);
		}
		else
		{
			CORE.Player.mesh.skeleton.bones[13].rotation.x = 0.003209229168407342;
			CORE.Player.mesh.skeleton.bones[13].rotation.y = -0.14181570319329195;
			CORE.Player.Anim.EnableFoot(0);
		}
	}
	// setting speed player
	if (CORE.Player.mButton2 && CORE.Player.Weap1)
	{
		CORE.Player.Speed.f = CORE.Conf.SpeedForward / 2;
	}
	else
	{
		CORE.Player.Speed.f = CORE.Conf.SpeedForward;
	}
}

CORE.Player.Anim.PlayAnimsTorso = function()
{
	// доставание оружия
	if (CORE.Player.Weap1 && !CORE.Player.mButton2 && !CORE.Player.mButton1 && !CORE.Player.Attack && !CORE.Player.ReloadAnim)
	{
		if (CORE.Player.Weap1Anim1 && !CORE.Player.Actions[6].isRunning())
		{
			CORE.Player.Weap1Anim1 = false;
			CORE.Player.Actions[6].reset();
		}
		else if (!CORE.Player.Weap1Anim1 && !CORE.Player.Actions[6].isRunning())
		{
			if (CORE.Player.mFor || CORE.Player.mLeft || CORE.Player.mRight || CORE.Player.mBack)
			{
				CORE.Player.Anim.EnableTorso(7);
			}
			else
			{
				CORE.Player.Anim.EnableTorso(9);
			}
		
		}
		else if (!CORE.Player.Weap1Anim1 && CORE.Player.Actions[6].isRunning() && CORE.Player.Actions[6].time == 0.825)
		{
			if (CORE.Player.mFor || CORE.Player.mLeft || CORE.Player.mRight || CORE.Player.mBack)
				CORE.Player.Anim.EnableTorso(7);
			else
				CORE.Player.Anim.EnableTorso(9);
		}
		else if (!CORE.Player.Weap1Anim1 && CORE.Player.Actions[6].isRunning())
		{
			CORE.Player.Anim.EnableTorso(6);
		}
	}
	// стрельба при прицеливании и прицеливание
	else if (CORE.Player.Weap1 && CORE.Player.mButton2 && !CORE.Player.ReloadAnim)
	{
		if (!CORE.Player.mButton1)
		{
			CORE.Player.Anim.EnableTorso(11);
		}
		/*if (CORE.Player.mButton1 && !CORE.Player.Actions[13].isRunning())
		{
			CORE.Player.Actions[13].reset();
			CORE.Player.Attack = true;
		}
		else if (CORE.Player.Actions[13].isRunning() && CORE.Player.Actions[13].time == 0.25625)
		{
			CORE.Player.Anim.EnableTorso(11);
			CORE.Player.Attack = false;
		}
		else if (CORE.Player.Attack && CORE.Player.Actions[13].isRunning())
		{
			CORE.Player.Anim.EnableTorso(13);
		}
		else CORE.Player.Anim.EnableTorso(11);*/
	}
	// стрельба от бедра
	else if (CORE.Player.Weap1 && !CORE.Player.mButton2 && !CORE.Player.ReloadAnim)
	{
		if (CORE.Player.mButton1 && !CORE.Player.Actions[12].isRunning())
		{
			CORE.Player.Actions[12].reset();
			CORE.Player.Attack = true;
		}
		else if (CORE.Player.Actions[12].isRunning() && CORE.Player.Actions[12].time == 0.25625)
		{
			CORE.Player.Anim.EnableTorso(9);
			CORE.Player.Attack = false;
		}
		else if (CORE.Player.Attack && CORE.Player.Actions[12].isRunning())
		{
			CORE.Player.Anim.EnableTorso(12);
		}

	}
	else if (CORE.Player.Weap1 && CORE.Player.ReloadAnim)
	{
		if (!CORE.Player.Actions[14].isRunning())
		{
			CORE.Player.Actions[14].reset();
		}
		else if (CORE.Player.Actions[14].isRunning() && CORE.Player.Actions[14].time == 2.28125)
		{
			CORE.Player.Anim.EnableTorso(9);
			CORE.Player.ReloadAnim = false;
			CORE.Player.Reload = false;
		}
		else if (CORE.Player.Actions[14].isRunning())
		{
			CORE.Player.Anim.EnableTorso(14);
		}
	}
	else if (!CORE.Player.Weap1)
	{
		if (CORE.Player.Weap1Anim2 && !CORE.Player.Actions[10].isRunning())
		{
			CORE.Player.Weap1Anim2 = false;
			CORE.Player.Actions[10].reset();
		}
		else if (!CORE.Player.Weap1Anim2 && !CORE.Player.Actions[10].isRunning())
		{
			CORE.Player.Anim.FalseTorso(0);
		}
		else if (!CORE.Player.Weap1Anim2 && CORE.Player.Actions[10].isRunning() && CORE.Player.Actions[10].time == 0.4)
		{
			CORE.Weapon.Hide(1, false);
			CORE.Player.Anim.FalseTorso(0);
		}
		else if (!CORE.Player.Weap1Anim2 && CORE.Player.Actions[10].isRunning())
		{
			CORE.Player.Anim.EnableTorso(10);
		}
	}

}

CORE.Player.Anim.Enable = function(ids)
{
	CORE.Player.Actions[ids[0]].enabled = true;
	CORE.Player.Actions[ids[1]].enabled = true;
	for (var i = 0; i < CORE.Player.Actions.length; i++)
	{
		if (i != ids[0] && i != ids[1])
			CORE.Player.Actions[i].enabled = false;
	}
}

CORE.Player.Update = function(_time, _delta)
{
	//var _delta = 0.75 * CORE.Main.clock.getDelta();
	var birdsEye = 0.5;
	var kneeDeep = 0.4;

	if(CORE.Player.AnimationMixer)
	{
		CORE.Player.AnimationMixer.update(_delta);
	}

	if(CORE.Player.mesh && CORE.Player.AnimationMixer != undefined)
	{
		CORE.Player.Anim.PlayAnimsFoot();
		CORE.Player.Anim.PlayAnimsTorso();
	}

	if (CORE.Player.mesh)
	{
		var delta = (_time - CORE.Main.prevTime)/1000;

		CORE.Player.Raycaster.ray.origin.copy(CORE.Player.mesh.position);
		CORE.Player.Raycaster.ray.origin.y += birdsEye;
		var hits = CORE.Player.Raycaster.intersectObjects(CORE.Zone.GroupMesh);

		CORE.Player.velocity.x -= CORE.Player.velocity.x * 9.8 * delta;
		CORE.Player.velocity.z -= CORE.Player.velocity.z * 9.8 * delta;
		CORE.Player.velocity.y -= 1.8 * CORE.Conf.Mass * delta; // 100.0 = mass

		if (CORE.Player.mFor) 	CORE.Player.velocity.z -= CORE.Player.Speed.f * delta;
		if (CORE.Player.mBack)  CORE.Player.velocity.z += CORE.Conf.SpeedBackward * delta;
		if (CORE.Player.mLeft)	CORE.Player.velocity.x -= CORE.Conf.SpeedLR * delta;
		if (CORE.Player.mRight)	CORE.Player.velocity.x += CORE.Conf.SpeedLR * delta;

		if (hits.length > 0 && hits[0].face.normal.y > 0)
		{
			var actualHeight = hits[0].distance - birdsEye;

			if((CORE.Player.velocity.y <= 0) && (Math.abs(actualHeight) < kneeDeep))
			{
				CORE.Player.mesh.position.y -= actualHeight;
				CORE.Player.velocity.y = Math.max( 0, CORE.Player.velocity.y );
			}

		}

		CORE.Player.mesh.translateX(CORE.Player.velocity.x * delta);
		CORE.Player.mesh.translateY(CORE.Player.velocity.y * delta);
		CORE.Player.mesh.translateZ(CORE.Player.velocity.z * delta);
		CORE.Main.prevTime = _time;
	}

	CORE.Main.prevTime = _time;
}