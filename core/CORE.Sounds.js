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
CORE.Sounds.Audios[0] 	= 'sounds/particle/fire2.ogg';

CORE.Sounds.INT = function(_camera)
{
	_camera.add(CORE.Sounds.listener);
}

CORE.Sounds.LoadAudio = function(_scene, id, nid, vol, p)
{
	CORE.Sounds.Sounds[nid] = {};
	CORE.Sounds.Sounds[nid] = new THREE.PositionalAudio(CORE.Sounds.listener);
	
	CORE.Sounds.Meshes[nid] = new THREE.Mesh(CORE.Sounds.Geometry, CORE.Sounds.Material);
	CORE.Sounds.Meshes[nid].position.copy(p);
	_scene.add(CORE.Sounds.Meshes[nid]);
	
	CORE.Sounds.Loader.load(CORE.Sounds.Audios[id], function(buffer)
	{
		CORE.Sounds.Sounds[nid].setBuffer(buffer);
		CORE.Sounds.Sounds[nid].setLoop(true);
		CORE.Sounds.Sounds[nid].setVolume(vol);
		//CORE.Sounds.Sounds[nid].stop();
	});
	
	CORE.Sounds.Meshes[nid].add(CORE.Sounds.Sounds[nid]);
}

CORE.Sounds.Play = function(nid)
{
	CORE.Sounds.Sounds[nid].play();
}