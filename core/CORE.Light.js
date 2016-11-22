var CORE = CORE || {};
CORE.Light = CORE.Light || {};
CORE.Light.Directional = null;
CORE.Light.Ambient = null;
//CORE.Light.TimeHour = [0,     1,     2,     3      4,   5,   6,   7,    8,     9,    10,   11,   12,   13,   14,   15,   16,   17,  18,   19,   20,   21,   22,   23  ];
CORE.Light.AlphaRad = [-1.57, -1.57, -1.57, -1.57, 0.1, 0.2, 0.4, 0.52, 0.65,  0.79, 1.05, 1.25, 1.57, 1.57, 1.83, 2.00, 2.09, 2.2, 2.36, 2.51, 2.62, 2.71, 2.90, -1.57];
CORE.Light.Loaded = false;

CORE.Light.INIT = function(_scena, time)
{
	var Geometry = new THREE.SphereGeometry(0.12, 16, 8);
	var Material = new THREE.MeshStandardMaterial({emissive: 0xffffee, emissiveIntensity: 1, color: 0x000000});
	
	CORE.Light.Ambient = new THREE.AmbientLight(0x464646);/*d2d2d2*/
	
	CORE.Light.Directional = new THREE.DirectionalLight(0xffffff, 1);
	CORE.Light.Directional.add(new THREE.Mesh(Geometry, Material));
	CORE.Light.Directional.position.set(0, 0, 0);
	CORE.Light.Directional.target.position.set(0, 0, 0);
	CORE.Light.Directional.castShadow = CORE.Conf.Shadow;
	_scena.add(CORE.Light.Ambient);
	_scena.add(CORE.Light.Directional);
}

CORE.Light.Update = function(time)
{
	CORE.Light.Directional.position.x = 10 * Math.cos(CORE.Light.AlphaRad[time]);
	CORE.Light.Directional.position.y = 10 * Math.sin(CORE.Light.AlphaRad[time]);
}