/** @namespace */
var CORE  = CORE || {};
CORE.Paricle = CORE.Paricle || {};
CORE.Paricle.TextureLoader	= new THREE.TextureLoader();
CORE.Paricle.Group 		= [];
CORE.Paricle.count		= 0;
CORE.Paricle.Emiter		= {};

CORE.Paricle.Fire = function(_scene, position, rotation, size)
{
	CORE.Paricle.Group[CORE.count] = new SPE.Group(
	{
		texture:
		{
			value: CORE.Paricle.TextureLoader.load('textures/sprite/sprite-flame2.jpg', function(texture){return texture;}),
			frames: new THREE.Vector2(8, 4),
			//frameCount: 8,
                        loop: 1
		},
		//fixedTimeStep: 1,
		depthTest: true,
		//scale: window.innerHeight / 2.0
        });

	CORE.Paricle.Emiter = new SPE.Emitter(
	{
		particleCount: 200,
		maxAge:
		{
			value: 1,
			spread: 1.5
                },
        	position:
		{
			value: position,
			spread: new THREE.Vector3( 0, 0, 0 ),
			spreadClamp: new THREE.Vector3( 0, 0, 0 ),
			distribution: SPE.distributions.BOX,
			randomise: false
                },
		radius:
		{
			value: 3,
			spread: 0,
			scale: new THREE.Vector3( 0.5, 1, 0.5),
			spreadClamp: new THREE.Vector3( 2, 2, 2 ),
		},
		velocity:
		{
			value: new THREE.Vector3( 0, 0.5, 0 ),
			spread: new THREE.Vector3( 0, 0, 0 ),
			// distribution: SPE.distributions.BOX,
			randomise: false
                },
		acceleration:
		{
			value: new THREE.Vector3( 0, 0, 0 ),
			spread: new THREE.Vector3( 0, 0, 0 ),
			// distribution: SPE.distributions.BOX,
			randomise: false
		},
		drag:
		{
			value: 0.5,
			spread: 0,
			randomise: false
		},
		wiggle:
		{
			value: 0,
			spread: 0
		},
		rotation:
		{
			axis: new THREE.Vector3( 0, 1, 0 ),
			axisSpread: new THREE.Vector3( 0, 0, 0 ),
			angle:  0, // radians
			angleSpread: 0, // radians
			static: false,
			center: new THREE.Vector3( 0, 0, 0 )
		},
		size:
		{
			value: size,
			spread: 0
		},
		opacity:
		{
			value: 0.12,
			randomise: false
		},
		angle:
		{
			value: 0,
			spread: 0
		}
	});

	CORE.Paricle.Group[CORE.Paricle.count].addEmitter(CORE.Paricle.Emiter);
	_scene.add(CORE.Paricle.Group[CORE.Paricle.count].mesh);
	CORE.Paricle.count++;
}

CORE.Paricle.Update = function(dt)
{
	for (var i = 0; i < CORE.Paricle.Group.length; i++)
	{
		CORE.Paricle.Group[i].tick(dt);
	}
}