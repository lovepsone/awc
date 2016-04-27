var CORE = CORE || {};
CORE.Bullet = CORE.Bullet || {};

CORE.Bullets	=	[];
CORE.Times	=	[];
CORE.x0		= 	[];
CORE.Vx		=	[];
CORE.Characters	=	[];
CORE.count	=	0;

var vec = new THREE.Vector3(0.12, 0.1, -0.6);

CORE.Bullet.Create = function(position, rotation, char, time)
{
	var geometry = new THREE.SphereGeometry(1.005, 1.005, 1.005);
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000/*0xfcce03*/, overdraw: 0.5 });

	CORE.Bullets[CORE.count] = new THREE.Mesh(geometry, material);

	CORE.Bullets[CORE.count].position.copy(position);

	if (CORE.Player.mButton2)
		CORE.Bullets[CORE.count].rotation.y = rotation.y - 0.01;
	else
		CORE.Bullets[CORE.count].rotation.y = rotation.y;

	//CORE.Bullets[CORE.count].rotation.x = rotation.x;

	CORE.Bullets[CORE.count].name = 'bullet_' + CORE.count;
	CORE.Main.scene.add(CORE.Bullets[CORE.count]);

	CORE.Times[CORE.count] = time;
	console.log(CORE.Bullets[CORE.count].rotation.y*180/Math.PI);
	CORE.x0[CORE.count] = CORE.Bullets[CORE.count].position.z;
	CORE.Vx[CORE.count] = char.Bullet.V;
	CORE.Bullets[CORE.count].updateMatrix();
	CORE.count++;
}

var a = 0.01;
// формула по оси OX  x = x0+ v*t;
CORE.Bullet.Update = function(dt)
{
	//v = char.Bullet.V
	for (var i = 0; i < CORE.count; i++)
	{
		var t = performance.now()/1000 - CORE.Times[i];
		var v = CORE.Vx[i]/1000;
		var x = CORE.x0[i] - v*t;
		CORE.Bullets[i].translateZ(x);
	}
	a -= 0.01;
}