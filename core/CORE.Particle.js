/** @namespace */
var CORE  = CORE || {};
CORE.Particle = CORE.Particle || {};
CORE.Particle.TextureLoader	= new THREE.TextureLoader();
CORE.Particle.Group 		= [];
CORE.Particle.count		= 0;
CORE.Particle.Emiter		= {};
CORE.Particle.ScreenAttenuation	= {mesh:{}, isLoad: false, isEndBlack: false, speed: 0};

CORE.Particle.Fire = function(_scene, position, rotation, size)
{
	CORE.Particle.Group[CORE.count] = new SPE.Group(
	{
		texture:
		{
			value: CORE.Particle.TextureLoader.load('textures/sprite/sprite-flame2.jpg', function(texture){return texture;}),
			frames: new THREE.Vector2(8, 4),
			//frameCount: 8,
                        loop: 1
		},
		//fixedTimeStep: 1,
		depthTest: true,
		//scale: window.innerHeight / 2.0
        });

	CORE.Particle.Emiter = new SPE.Emitter(
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

	CORE.Particle.Group[CORE.Particle.count].addEmitter(CORE.Particle.Emiter);
	_scene.add(CORE.Particle.Group[CORE.Particle.count].mesh);
	CORE.Particle.count++;
}

CORE.Particle.lScreenAttenuation = function(_scene, size, position, speed)
{
	var g = new THREE.BoxBufferGeometry(size, size, size);
	var m = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide, needsUpdate: true, transparent: true, opacity:0})
	CORE.Particle.ScreenAttenuation.mesh = new THREE.Mesh(g, m);
	CORE.Particle.ScreenAttenuation.mesh.position.copy(position);
	CORE.Particle.ScreenAttenuation.mesh.name = "Screen Attenuation";
	_scene.add(CORE.Particle.ScreenAttenuation.mesh);
	CORE.Particle.ScreenAttenuation.isLoad = true;
	CORE.Particle.ScreenAttenuation.speed = speed;
}

CORE.Particle.Remove = function(_scene)
{
	for (var i = 0; i < CORE.Particle.count; i++)
	{
		_scene.remove(CORE.Particle.Group[i].mesh);
	}
	CORE.Particle.count = 0;
}

CORE.Particle.Update = function(dt)
{
	for (var i = 0; i < CORE.Particle.Group.length; i++)
	{
		CORE.Particle.Group[i].tick(dt);
	}
	
	if (CORE.Particle.ScreenAttenuation.isLoad == true && CORE.Particle.ScreenAttenuation.mesh)
	{
		if (CORE.Particle.ScreenAttenuation.mesh.material.opacity >= 1)
		{
			CORE.Particle.ScreenAttenuation.isEndBlack = true;
		}
		else if (CORE.Particle.ScreenAttenuation.isEndBlack == false)
		{
			CORE.Particle.ScreenAttenuation.mesh.material.opacity += CORE.Particle.ScreenAttenuation.speed;
		}
	}
}