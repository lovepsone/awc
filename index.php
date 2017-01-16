<?php
	session_start();
	echo '<!DOCTYPE html><html>';
	echo '<head>';
	echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
	echo '<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">';
	echo '<title></title>';
	echo '<script type="text/javascript" src="libs/jquery.min.js"></script>';
	echo '<script type="text/javascript" src="libs/three.min.js"></script>';
	echo '<script type="text/javascript" src="libs/socket.io.js"></script>';
	echo '<script type="text/javascript" src="libs/SPE.min.js"></script>';
	
	echo '<script type="text/javascript" src="libs/Detector.js"></script>';
	echo '<script type="text/javascript" src="libs/stats.min.js"></script>';

	echo '<link rel="stylesheet" href="CORE.Style.css">';
	echo '</head><body>';

	echo '<script type="text/javascript" src="CORE/HANDLER.Interface.js"></script>';

	echo '<script type="text/javascript" src="CORE/CORE.Conf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WPNConf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Network.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.FullScreen.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WindowResize.js"></script>';
	// LOAD MAPS and obj
	echo '<script type="text/javascript" src="CORE/Maps/MAPS.Lobby.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Object3D.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.LoaderObjects.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Maps.js"></script>';
	//
	echo '<script type="text/javascript" src="CORE/CORE.Main.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Lobby.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Sounds.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Paricle.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Zone.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Weapon.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Player.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Hand.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WPNHud.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Bullet.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Sky.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Light.js"></script>';
	// auths
	echo '<div id="auth" align="center">';
	echo '<div class="loginform">Login:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="AuthLogin"/></br>';
	echo 'Password:<input type="password" id="AuthPassword"/></br>';
	echo '<input id="btnAuth" type="submit" value="Auth"/></div></div>';
	// loader main
	/*echo '<div id="LoaderObject">';
	echo '<progress id="pLoaderObject" value="0" max="100"></progress>';
	echo '<span class="progress-value">0%</span>';
	echo '</div>';*/

	echo '<div id="blocker">';
	echo '<div id="instructions"><span style="font-size:40px">Click to play</span><br />(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)</div>';
	echo '</div>';

	// game
	echo '<div id="CORE" align="center">';
	echo '</div>';

	// Custom Shader-glow Code
	echo '<script id="vertexShader" type="x-shader/x-vertex">
	uniform vec3 viewVector;
	uniform float c;
	uniform float p;
	varying float intensity;
	void main() 
	{
	    vec3 vNormal = normalize( normalMatrix * normal );
		vec3 vNormel = normalize( normalMatrix * viewVector );
		intensity = pow( c - dot(vNormal, vNormel), p );
		
	    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
	</script>';

	//fragment shader a.k.a. pixel shader
	echo '<script id="fragmentShader" type="x-shader/x-vertex">
	uniform vec3 glowColor;
	varying float intensity;
	void main() 
	{
		vec3 glow = glowColor * intensity;
	    gl_FragColor = vec4( glow, 1.0 );
	}
	</script>';

	echo '<script>';
	?>
	if (!Detector.webgl) Detector.addGetWebGLMessage();
	$("#CORE").append(CORE.Main.stats.dom);
	$("#CORE").append(CORE.Main.renderer.domElement);
	CORE.Main.INIT();
	CORE.Main.AnimationFrame();

	var blocker = document.getElementById('blocker');
	var instructions = document.getElementById('instructions');
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if (havePointerLock)
	{
		var element = document.body;
		var pointerlockchange = function(event)
		{
			if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
			{
				CORE.Main.ControlPlayer = true;
				blocker.style.display = 'none';
			}
			else
			{
				CORE.Main.ControlPlayer = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				instructions.style.display = '';
			}
		};
		var pointerlockerror = function(event)
		{
			instructions.style.display = '';
			CORE.Main.ControlPlayer = false;
		};
		// Hook pointer lock state change events
		document.addEventListener('pointerlockchange', pointerlockchange, false);
		document.addEventListener('mozpointerlockchange', pointerlockchange, false);
		document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
		document.addEventListener('pointerlockerror', pointerlockerror, false);
		document.addEventListener('mozpointerlockerror', pointerlockerror, false);
		document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

		instructions.addEventListener('click', function(event)
		{
			instructions.style.display = 'none';
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			if (/Firefox/i.test(navigator.userAgent))
			{
				var fullscreenchange = function(event)
				{
					if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element)
					{
						document.removeEventListener('fullscreenchange', fullscreenchange);
						document.removeEventListener('mozfullscreenchange', fullscreenchange);
						element.requestPointerLock();
					}
				};
				document.addEventListener('fullscreenchange', fullscreenchange, false);
				document.addEventListener('mozfullscreenchange', fullscreenchange, false);
				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
				element.requestFullscreen();
			}
			else
			{
				element.requestPointerLock();
				CORE.Main.ControlPlayer = false;
			}
		}, false );
	}
	else
	{
		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}
	<?php
	echo '</script>';
	echo '</body></html>';
?>