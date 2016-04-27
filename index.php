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
	echo '<script type="text/javascript" src="libs/FXAAShader.js"></script>';
	echo '<link rel="stylesheet" href="style.css">';
	echo '</head><body>';

	echo '<script type="text/javascript" src="CORE/HANDLER.Interface.js"></script>';

	echo '<script type="text/javascript" src="CORE/CORE.Conf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WPNConf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Network.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.FullScreen.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WindowResize.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Main.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Zone.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Weapon.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Player.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Hand.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WPNHud.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Bullet.js"></script>';

	echo '<div id="auth" align="center">Login: <input type="text" id="AuthLogin" class="textbox" style="width:100px" /><br/>';
	echo 'Password: <input type="password" id="AuthPassword" class="textbox" style="width:100px" /><br/>';
	echo '<input id="btnAuth" type="submit" value="Auth"/></div>';

	echo '<div id="blocker">';
	echo '<div id="instructions"><span style="font-size:40px">Click to play</span><br />(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)</div>';
	echo '</div>';

	// game
	echo '<div id="CORE" align="center">';
	echo '</div>';
	echo '<script>';
	?>
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