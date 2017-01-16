/** @namespace */
var CORE  = CORE || {};
CORE.Network = CORE.Network || {};
CORE.Network.Anim = CORE.Network.Anim || {};

CORE.Network.URL = CORE.Conf.url;
CORE.Network.Auth = false;

CORE.Network.inGame = false;
CORE.Network.socket = null;
CORE.Network.player = null;
CORE.Network.players = [];
CORE.Network.lMesh = [];
CORE.Network.time = {};

CORE.Network.loader = new THREE.JSONLoader();

CORE.Network.INT = function()
{
	CORE.Network.socket = io.connect(CORE.Network.URL);
	CORE.Network.socket.on('connect', function()
	{
		console.log('connect sucessful!');
	});
}

CORE.Network.SMG_AUTHCLIENT = function(login, password)
{
	CORE.Network.socket.emit('SMG_AUTHCLIENT', {l:login, p: password});
	CORE.Network.socket.on('SMG_AUTHCLIENT', function(_AUTHCLIENT)
	{
		//CORE.Network.inGame = true;
		//CORE.Main.initPlayers(_AUTHCLIENT);
		CORE.Network.Auth = true;
		
		HANDLER.Interface.auth.hide();
		HANDLER.Interface.CORE.show(); // start load lobby
		CORE.Lobby.endLoad = true;
		CORE.Sounds.Play(0);
		//HANDLER.Interface.blocker.show();
		//HANDLER.Interface.LoaderObject.show();
		CORE.Network.player = _AUTHCLIENT;
		
		CORE.Network.SMG_TIMEGAME(); // update time
	});	
}

CORE.Network.SMG_PLAYER = function()
{
	CORE.Network.socket.emit('SMG_PLAYER', CORE.Network.player);

	CORE.Network.socket.on('SMG_PLAYER', function(_PLAYERS)
	{
		CORE.Network.players = _PLAYERS;
	});
}

CORE.Network.SMG_TIMEGAME = function()
{
	CORE.Network.socket.emit('SMG_TIMEGAME', 0);
	CORE.Network.socket.on('SMG_TIMEGAME', function(_TIMEGAME)
	{
		CORE.Network.time = _TIMEGAME;
	});
}

CORE.Network.setDataPlayer = function(_data)
{
	CORE.Network.player.position = new THREE.Vector3(_data.position.x, _data.position.y, _data.position.z);
	CORE.Network.player.rot_y = _data.rotation.y;

	CORE.Network.player.pRun.For = CORE.Player.mFor;
	CORE.Network.player.pRun.Left = CORE.Player.mLeft;
	CORE.Network.player.pRun.Back = CORE.Player.mBack;
	CORE.Network.player.pRun.Right = CORE.Player.mRight;

	CORE.Network.player.Weap.w1 = CORE.Player.Weap1;
	CORE.Network.player.Weap.reload = CORE.Player.Reload;

	CORE.Network.player.MoseClick.m1 = CORE.Player.mButton1;
	CORE.Network.player.MoseClick.m2 = CORE.Player.mButton2;

	// bones
	var _b14 = CORE.Player.mesh.skeleton.bones[14];
	CORE.Network.player.bones.bip01_spine2.position = new THREE.Vector3(_b14.position.x, _b14.position.y, _b14.position.z);
	CORE.Network.player.bones.bip01_spine2.rotation = new THREE.Vector3(_b14.rotation.x, _b14.rotation.y, _b14.rotation.z);
}

// init data animations
CORE.Network.Anim.Geom 		= [];
CORE.Network.Anim.Mixer 	= [];
CORE.Network.Anim.Actions	= [];

CORE.Network.Anim.Weap1Anim1	= [];
CORE.Network.Anim.Weap1Anim2	= [];
CORE.Network.Anim.Attack	= [];

CORE.Network.Anim.LoopOnce	= [6, 10, 12, 13, 14];
CORE.Network.Anim.RUNFOOT	= [0, 1, 2, 3, 4, 5, 8];
CORE.Network.Anim.RUNTORSO	= [6, 7, 9, 10, 11, 12, 13, 14];

CORE.Network.LoadNewPlayer = function(_id, _name, _scene)
{
	if (CORE.Network.lMesh[_id] != undefined && CORE.Network.lMesh[_id])
		return;

	CORE.Network.lMesh[_id] = true;
	CORE.Network.loader.load('player_.js', function(geometry, materials)
	{
		geometry.computeVertexNormals();
		for (var i = 0; i < materials.length; i++)
		{
			materials[i].skinning = true;
			materials[i].morphTargets = true;
		}
		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		/*------ настройка анимаций------*/
		var editor 			= [];
		var norm_run_fwd_1 		= [];
		var norm_run_fwd_2 		= [];
		var norm_run_ls_0 		= [];
		var norm_run_rs_0 		= [];
		var norm_run_back_0 		= [];
		var norm_torso_1_draw_0 	= [];
		var norn_torso_1_run_0 		= [];
		var norm_torso_1_noweap_0 	= [];
		var norm_torso_1_aim_0 		= [];
		var norm_torso_1_drop_0 	= [];
		var norm_torso_1_aim_1 		= [];
		var norm_torso_1_attack_0 	= [];
		var norm_torso_1_attack_1 	= [];
		var norm_torso_1_reload_0 	= [];

		for (var i = 0;  i < 144; i++)
		{

			if (i < 42 || i > 44)
			{
				editor[editor.length] = geometry.animations[0].tracks[i];
				norm_run_fwd_1[norm_run_fwd_1.length] = geometry.animations[1].tracks[i];
			}
			if ( i < 42)
			{
				norm_run_fwd_2[norm_run_fwd_2.length] = geometry.animations[2].tracks[i];
				//norm_run_ls_0[norm_run_ls_0.length] = geometry.animations[3].tracks[i];
				//norm_run_rs_0[norm_run_rs_0.length] = geometry.animations[4].tracks[i];
				norm_run_back_0[norm_run_back_0.length] = geometry.animations[5].tracks[i];
				norm_torso_1_noweap_0[norm_torso_1_noweap_0.length] = geometry.animations[8].tracks[i];
			}
			if (i < 39)
			{
				norm_run_ls_0[norm_run_ls_0.length] = geometry.animations[3].tracks[i];
				norm_run_rs_0[norm_run_rs_0.length] = geometry.animations[4].tracks[i];
			}
			if ( i > 47)
			{
				norm_torso_1_draw_0[norm_torso_1_draw_0.length] = geometry.animations[6].tracks[i];
				norn_torso_1_run_0[norn_torso_1_run_0.length] = geometry.animations[7].tracks[i];
				norm_torso_1_aim_0[norm_torso_1_aim_0.length] = geometry.animations[9].tracks[i];
				norm_torso_1_drop_0[norm_torso_1_drop_0.length] = geometry.animations[10].tracks[i];
				norm_torso_1_aim_1[norm_torso_1_aim_1.length] = geometry.animations[11].tracks[i];
				norm_torso_1_attack_0[norm_torso_1_attack_0.length] = geometry.animations[12].tracks[i];
				norm_torso_1_attack_1[norm_torso_1_attack_1.length] = geometry.animations[13].tracks[i];
				norm_torso_1_reload_0[norm_torso_1_reload_0.length] = geometry.animations[14].tracks[i];
			}
		}
		geometry.animations[0].tracks = editor;
		geometry.animations[1].tracks = norm_run_fwd_1;
		geometry.animations[2].tracks = norm_run_fwd_2;
		geometry.animations[3].tracks = norm_run_ls_0;
		geometry.animations[4].tracks = norm_run_rs_0;
		geometry.animations[5].tracks = norm_run_back_0;
		geometry.animations[6].tracks = norm_torso_1_draw_0;
		geometry.animations[7].tracks = norn_torso_1_run_0;
		geometry.animations[8].tracks = norm_torso_1_noweap_0;
		geometry.animations[9].tracks = norm_torso_1_aim_0;
		geometry.animations[10].tracks = norm_torso_1_drop_0;
		geometry.animations[11].tracks = norm_torso_1_aim_1;
		geometry.animations[12].tracks = norm_torso_1_attack_0;
		geometry.animations[13].tracks = norm_torso_1_attack_1;
		geometry.animations[14].tracks = norm_torso_1_reload_0;

		var mesh = new THREE.SkinnedMesh(geometry, faceMaterial);
		mesh.name = _name;

		CORE.Network.Anim.Geom[_id] = geometry.animations;
		CORE.Network.Anim.Mixer[_id] = new THREE.AnimationMixer(mesh);
		var tmp = [];
		for (var i = 0; i < CORE.Network.Anim.Geom[_id].length; i++)
		{
			tmp[i] = CORE.Network.Anim.Mixer[_id].clipAction(CORE.Network.Anim.Geom[_id][i], mesh);
			tmp[i].play(CORE.Network.Anim.Mixer[_id]);
			if (i != 0)
				tmp[i].enabled = false;
		}
		CORE.Network.Anim.Actions[_id] = tmp;
		for (var i = 0; i < CORE.Network.Anim.LoopOnce.length; i++)
		{
			CORE.Network.Anim.Actions[_id][CORE.Network.Anim.LoopOnce[i]].loop = THREE.LoopOnce;
			CORE.Network.Anim.Actions[_id][CORE.Network.Anim.LoopOnce[i]].clampWhenFinished = true;// задерживает конечную позицию костей
		}

		CORE.Network.Anim.Weap1Anim1[_id] = true;
		CORE.Network.Anim.Weap1Anim2[_id] = true;
		CORE.Network.Anim.Attack[_id] = false;
		_scene.add(mesh);
	});
}

// animations players
CORE.Network.Anim.EnableFoot = function(_idp, _ida)
{
	CORE.Network.Anim.Actions[_idp][_ida].enabled = true;

	for (var i = 0; i < CORE.Network.Anim.Actions[_idp].length; i++)
	{
		if (CORE.Network.Anim.RUNFOOT.indexOf(i) != -1 && i != _ida)
		{
			CORE.Network.Anim.Actions[_idp][i].enabled = false;
		}
	}
}

CORE.Network.Anim.EnableTorso = function(_idp, _ida)
{
	CORE.Network.Anim.Actions[_idp][_ida].enabled = true;

	for (var i = 0; i < CORE.Network.Anim.Actions[_idp].length; i++)
	{
		if (CORE.Network.Anim.RUNTORSO.indexOf(i) != -1 && i != _ida)
		{
			CORE.Network.Anim.Actions[_idp][i].enabled = false;
		}
	}
}

CORE.Network.Anim.FalseTorso = function(_idp)
{
	for (var i = 0; i < CORE.Network.Anim.Actions[_idp].length; i++)
	{
		if (CORE.Network.Anim.RUNTORSO.indexOf(i) != -1)
		{
			CORE.Network.Anim.Actions[_idp][i].enabled = false;
		}
	}
}

CORE.Network.Anim.PlayAnimsFoot = function(_idp, _mesh)
{
	if (CORE.Network.players[_idp].pRun.For)
	{
		if (CORE.Network.players[_idp].Weap.w1)
		{
			CORE.Network.Anim.EnableFoot(_idp, 2);
		}
		else
			CORE.Network.Anim.EnableFoot(_idp, 1);

	}
	else if (CORE.Network.players[_idp].pRun.Left)
	{
		_mesh.skeleton.bones[13].rotation.x = Math.PI/4;
		_mesh.skeleton.bones[13].rotation.y = 0.1;
		CORE.Network.Anim.EnableFoot(_idp, 3);
	}
	else if (CORE.Network.players[_idp].pRun.Back)
	{
		_mesh.skeleton.bones[13].rotation.x = Math.PI/4;
		_mesh.skeleton.bones[13].rotation.y = 0.1;
		CORE.Network.Anim.EnableFoot(_idp, 5);
	}
	else if (CORE.Network.players[_idp].pRun.Right)
	{
		_mesh.skeleton.bones[13].rotation.x = Math.PI/4;
		_mesh.skeleton.bones[13].rotation.y = 0.1;
		CORE.Network.Anim.EnableFoot(_idp, 4);
	}
	else
	{
		if (CORE.Network.players[_idp].Weap.w1 || CORE.Network.Anim.Actions[_idp][10].isRunning())
		{
			CORE.Network.Anim.EnableFoot(_idp, 8);
			//CORE.Network.Anim.Weap1Anim2[_idp] = true;
		}
		else
		{
			_mesh.skeleton.bones[13].rotation.x = 0.003209229168407342;
			_mesh.skeleton.bones[13].rotation.y = -0.14181570319329195;
			CORE.Network.Anim.EnableFoot(_idp, 0);
			CORE.Network.Anim.Weap1Anim1[_idp] = true;
		}
	}
}

CORE.Network.Anim.PlayAnimsTorso = function(_idp)
{
	// доставание оружия
	if (CORE.Network.players[_idp].Weap.w1 && !CORE.Network.players[_idp].MoseClick.m2 && !CORE.Network.players[_idp].MoseClick.m1 && !CORE.Network.Anim.Attack[_idp] && !CORE.Network.players[_idp].Weap.reload)
	{
		if (CORE.Network.Anim.Weap1Anim1[_idp] && !CORE.Network.Anim.Actions[_idp][6].isRunning())
		{
			console.log(1);
			CORE.Network.Anim.Weap1Anim1[_idp] = false;
			CORE.Network.Anim.Weap1Anim2[_idp] = true;
			CORE.Network.Anim.Actions[_idp][6].reset();
		}
		else if (!CORE.Network.Anim.Weap1Anim1[_idp] && !CORE.Network.Anim.Actions[_idp][6].isRunning())
		{
			if (CORE.Network.players[_idp].pRun.For || CORE.Network.players[_idp].pRun.Left || CORE.Network.players[_idp].pRun.Right || CORE.Network.players[_idp].pRun.Back)
			{
				CORE.Network.Anim.EnableTorso(_idp, 7);
			}
			else
			{
				CORE.Network.Anim.EnableTorso(_idp, 9);
			}
		
		}
		else if (!CORE.Network.Anim.Weap1Anim1[_idp] && CORE.Network.Anim.Actions[_idp][6].isRunning() && CORE.Network.Anim.Actions[_idp][6].time == 0.825)
		{
			if (CORE.Network.players[_idp].pRun.For || CORE.Network.players[_idp].pRun.Left || CORE.Network.players[_idp].pRun.Right || CORE.Network.players[_idp].pRun.Back)
				CORE.Network.Anim.EnableTorso(_idp, 7);
			else
				CORE.Network.Anim.EnableTorso(_idp, 9);
		}
		else if (!CORE.Network.Anim.Weap1Anim1[_idp] && CORE.Network.Anim.Actions[_idp][6].isRunning())
		{
			CORE.Network.Anim.EnableTorso(_idp, 6);
		}
	}
	// стрельба при прицеливании и прицеливание
	/*else if (CORE.Network.players[_idp].Weap.w1 && CORE.Network.players[_idp].MoseClick.m2 && !CORE.Network.players[_idp].Weap.reload)
	{
		if (!CORE.Player.mButton1)
		{
			CORE.Network.Anim.EnableTorso(_idp, 11);
		}
		//if (CORE.Player.mButton1 && !CORE.Player.Actions[13].isRunning())
		//{
		//	CORE.Player.Actions[13].reset();
		//	CORE.Network.Anim.Attack[_idp] = true;
		//}
		//else if (CORE.Player.Actions[13].isRunning() && CORE.Player.Actions[13].time == 0.25625)
		//{
		//	CORE.Network.Anim.EnableTorso(_idp, 11);
		//	CORE.Network.Anim.Attack[_idp] = false;
		//}
		//else if (CORE.Network.Anim.Attack[_idp] && CORE.Player.Actions[13].isRunning())
		//{
		//	CORE.Network.Anim.EnableTorso(_idp, 13);
		//}
		//else CORE.Network.Anim.EnableTorso(_idp, 11);
	}*/
	// стрельба от бедра
	else if (CORE.Network.players[_idp].Weap.w1 && !CORE.Network.players[_idp].MoseClick.m2 && !CORE.Network.players[_idp].Weap.reload)
	{
		if (CORE.Network.players[_idp].MoseClick.m1 && !CORE.Network.Anim.Actions[_idp][12].isRunning())
		{
			CORE.Network.Anim.Actions[_idp][12].reset();
			CORE.Network.Anim.Attack[_idp] = true;
		}
		else if (CORE.Network.Anim.Actions[_idp][12].isRunning() && CORE.Network.Anim.Actions[_idp][12].time == 0.25625)
		{
			CORE.Network.Anim.EnableTorso(_idp, 9);
			CORE.Network.Anim.Attack[_idp] = false;
		}
		else if (CORE.Network.Anim.Attack[_idp] && CORE.Network.Anim.Actions[_idp][12].isRunning())
		{
			CORE.Network.Anim.EnableTorso(_idp, 12);
		}

	}
	else if (CORE.Network.players[_idp].Weap.w1 && CORE.Network.players[_idp].Weap.reload)
	{
		if (!CORE.Network.Anim.Actions[_idp][14].isRunning())
		{
			CORE.Network.Anim.Actions[_idp][14].reset();
		}
		else if (CORE.Network.Anim.Actions[_idp][14].isRunning() && CORE.Network.Anim.Actions[_idp][14].time == 2.28125)
		{
			CORE.Network.Anim.EnableTorso(_idp, 9);
			CORE.Network.players[_idp].Weap.reload = false;
		}
		else if (CORE.Network.Anim.Actions[_idp][14].isRunning())
		{
			CORE.Network.Anim.EnableTorso(_idp, 14);
		}
	}
	else if (!CORE.Network.players[_idp].Weap.w1)
	{
		if (CORE.Network.Anim.Weap1Anim2[_idp] && !CORE.Network.Anim.Actions[_idp][10].isRunning())
		{
			CORE.Network.Anim.Weap1Anim2[_idp] = false;
			CORE.Network.Anim.Actions[_idp][10].reset();
		}
		else if (!CORE.Network.Anim.Weap1Anim2[_idp] && !CORE.Network.Anim.Actions[_idp][10].isRunning())
		{
			CORE.Network.Anim.EnableTorso(_idp, 0);
		}
		else if (!CORE.Network.Anim.Weap1Anim2[_idp] && CORE.Network.Anim.Actions[_idp][10].isRunning() && CORE.Network.Anim.Actions[_idp][10].time == 0.4)
		{
			//CORE.Weapon.Hide(1, false);
			CORE.Network.Anim.EnableTorso(_idp, 0);
		}
		else if (!CORE.Network.Anim.Weap1Anim2[_idp] && CORE.Network.Anim.Actions[_idp][10].isRunning())
		{
			CORE.Network.Anim.EnableTorso(_idp, 10);
		}
	}

}

CORE.Network.Anim.Update = function(_id, _delta, _mesh)
{
	if(CORE.Network.Anim.Mixer[_id])
	{
		CORE.Network.Anim.Mixer[_id].update(_delta);
		CORE.Network.Anim.PlayAnimsFoot(_id, _mesh);
		CORE.Network.Anim.PlayAnimsTorso(_id);
	}
}