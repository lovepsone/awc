<?php
	session_start();
	echo '<!DOCTYPE html><html>';
	echo '<head>';
	echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
	echo '<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">';
	echo '<title></title>';
	echo '<script type="text/javascript" src="libs/jquery.min.js"></script>';
	echo '<script type="text/javascript" src="libs/three.min.js"></script>';
	echo '<script type="text/javascript" src="libs/Detector.js"></script>';
	echo '<script type="text/javascript" src="libs/stats.min.js"></script>';
	echo '<script type="text/javascript" src="libs/threex.rendererstats.js"></script>';
	echo '<script type="text/javascript" src="libs/GeometryUtils.js"></script>';
	echo '<link rel="stylesheet" href="style.css">';
	echo '</head><body>';

	echo '<script type="text/javascript" src="CORE/CORE.Conf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WPNConf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.FullScreen.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WindowResize.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Object3D.js"></script>';
	echo '<script type="text/javascript" src="libs/cannon.min.js"></script>';
	//maps
	echo '<script type="text/javascript" src="CORE/Maps/MAPS.Lobby.js"></script>';
	echo '<script type="text/javascript" src="CORE/Maps/MAPS.Map1.js"></script>';
	//
	echo '<script type="text/javascript" src="editor/CORE.GameEdit.js"></script>';


	echo '<div id="blocker">';
	echo '<div id="instructions"><span style="font-size:40px">Click to play</span><br />(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)</div>';
	echo '</div>';

	// game
	echo '<div id="eCORE" align="center">';
	echo '</div>';
	//map
	echo '<div id="Map" style="height:490px; width:130px;position: absolute;">';
	echo '<img id="player" src="style/player.jpg" style="position: absolute;">';
	echo '<img src="style/map.jpg">';
	echo '</div>';
	echo '<script>';
	?>
	if (!Detector.webgl) Detector.addGetWebGLMessage();
	$("#eCORE").append(CORE.GameEdit.stats.dom);
	$("#eCORE").append(CORE.GameEdit.renderer.domElement);
	$("#eCORE").append(CORE.GameEdit.rendererStats.domElement)
	CORE.GameEdit.INIT();
	CORE.GameEdit.AnimationFrame();

	$(document).ready(function()
	{
		$("#Map").hide();
		$("#player").css('left', '245px');
		$("#player").css('top', '245px');
	});
	
	var blocker = document.getElementById('blocker');
	var instructions = document.getElementById('instructions');
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	var key73 = 0;
	if (havePointerLock)
	{
		var element = document.body;
		var pointerlockchange = function(event)
		{
			if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
			{
				CORE.GameEdit.ControlPlayer = true;
				blocker.style.display = 'none';
			}
			else
			{
				CORE.GameEdit.ControlPlayer = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				instructions.style.display = '';
			}
		};
		var pointerlockerror = function(event)
		{
			instructions.style.display = '';
			CORE.GameEdit.ControlPlayer = false;
		};
		// Hook pointer lock state change events
		document.addEventListener('pointerlockchange', pointerlockchange, false);
		document.addEventListener('mozpointerlockchange', pointerlockchange, false);
		document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
		document.addEventListener('pointerlockerror', pointerlockerror, false);
		document.addEventListener('mozpointerlockerror', pointerlockerror, false);
		document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

		document.addEventListener('keydown', function(event)
		{
			if (event.keyCode == 73 && key73 == 0)
			{
				key73 = 1;
				instructions.style.display = 'none';
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
				document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
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
					CORE.GameEdit.ControlPlayer = false;
				}
			}
			else if (event.keyCode == 73 && key73 == 1)
			{
				key73 = 0;
				document.exitPointerLock();
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