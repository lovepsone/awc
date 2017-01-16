/** @namespace */
var CORE  = CORE || {};
CORE.Sounds = CORE.Sounds || {};
CORE.Sounds.listener 	= new THREE.AudioListener();
CORE.Sounds.Loader 	= new THREE.AudioLoader();
CORE.Sounds.Geometry	= new THREE.SphereGeometry(0.001, 1, 1);
CORE.Sounds.Material 	= new THREE.MeshPhongMaterial({color: 0xffaa00, shading: THREE.FlatShading, shininess: 0});
CORE.Sounds.Meshes	= [];
CORE.Sounds.Sounds	= [];

CORE.Sounds.Audios	= [];
CORE.Sounds.Audios[0] 	= 'sounds/ambient/fire2.ogg';

CORE.Sounds.Audios[1] 	= 'sounds/random/rnd_cr1.ogg'
CORE.Sounds.Audios[2] 	= 'sounds/random/rnd_m-16_4.ogg';
CORE.Sounds.Audios[3] 	= 'sounds/random/rnd_m-249.ogg';
CORE.Sounds.Audios[4] 	= 'sounds/random/rnd_scr5.ogg';
CORE.Sounds.Audios[5] 	= 'sounds/random/rnd_the_horror4.ogg';

CORE.Sounds.INT = function(_camera)
{
	_camera.add(CORE.Sounds.listener);
}

CORE.Sounds.LoadAudio = function(_scene, id, nid, vol, loop, position)
{
	CORE.Sounds.Sounds[nid] = {};
	CORE.Sounds.Sounds[nid] = new THREE.PositionalAudio(CORE.Sounds.listener);
	
	CORE.Sounds.Meshes[nid] = new THREE.Mesh(CORE.Sounds.Geometry, CORE.Sounds.Material);
	CORE.Sounds.Meshes[nid].position.copy(position);
	_scene.add(CORE.Sounds.Meshes[nid]);
	
	CORE.Sounds.Loader.load(CORE.Sounds.Audios[id], function(buffer)
	{
		CORE.Sounds.Sounds[nid].setBuffer(buffer);
		CORE.Sounds.Sounds[nid].setLoop(loop);
		CORE.Sounds.Sounds[nid].setVolume(vol);
		//CORE.Sounds.Sounds[nid].stop();
	});
	
	CORE.Sounds.Meshes[nid].add(CORE.Sounds.Sounds[nid]);
}

CORE.Sounds.Play = function(nid)
{
	if (!CORE.Sounds.Sounds[nid].isPlaying)
		CORE.Sounds.Sounds[nid].play();
}

CORE.Sounds.Volume = function(nid, val)
{
	CORE.Sounds.Sounds[nid].setVolume(vol);
}

CORE.Sounds.Loop = function(nid, val)
{
	CORE.Sounds.Sounds[nid].setLoop(val);
}