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
	echo '<script type="text/javascript" src="editor/ru.js"></script>';
	echo '<script type="text/javascript" src="libs/threex.rendererstats.js"></script>';
	echo '<script type="text/javascript" src="libs/GeometryUtils.js"></script>';
	echo '<link rel="stylesheet" href="style.css">';
	echo '</head><body>';

	echo '<script type="text/javascript" src="CORE/CORE.Conf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WPNConf.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.FullScreen.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.WindowResize.js"></script>';
	echo '<script type="text/javascript" src="CORE/CORE.Object3D.js"></script>';
	//maps
	echo '<script type="text/javascript" src="CORE/Maps/MAPS.Lobby.js"></script>';
	echo '<script type="text/javascript" src="CORE/Maps/MAPS.Map1.js"></script>';
	
	echo '<script type="text/javascript" src="editor/OrbitControls.js"></script>';
	echo '<script type="text/javascript" src="editor/TransformControls.js"></script>';
	echo '<script type="text/javascript" src="editor/CORE.MainEditor.js"></script>';
	echo '<script type="text/javascript" src="editor/HANDLER.InterfaceEditor.js"></script>';

	// game
	echo '<div id="CORE" align="center">';
	echo '<div id="panel" align="left">';
	// slected maps
	echo '<div>Select the map: <select id="map" name="map">';
	echo '<option value="0" selected>lobby</option> ';
	echo '<option value="1">Map 1</option>';
	echo '<option value="2">no map</option>';
	echo '</select> <input id="btnSelectMap" type="submit" value="Select"/></div>';
	
	// категории
	echo '<div align="center" width="240px"><hr>';
	echo '<div id="catInfo"></div>';
	echo '<select id="objCat" size="1" style="width:240px;">';
	echo '</select></div>';
	
	// СПИСОК
	echo '<div align="center" width="240px"><hr>';
	echo '<div id="listInfo"></div>';
	echo '<select id="objects" size="20" style="width:240px;">';
	echo '</select></div>';
	// доп управление
	echo '<div align="center" width="240px"><hr>';
	echo '<span id="locFixed"></span><input type="checkbox" id="fixedO" value="0">';
	echo '</div>';
	
	echo '<div align="center" width="240px"><hr>';
	echo '<span id="locRand"></span><input type="checkbox" id="randO" value="0"><br>';
	echo 'x: <input id="RandAxisX" type="radio" name="axis" value="0" checked> ';
	echo 'y: <input id="RandAxisY" type="radio" name="axis" value="1"> ';
	echo 'z: <input id="RandAxisZ" type="radio" name="axis" value="2">';
	echo '</div>';
	// генератор травы
	echo '<div align="center"><hr>Count: <input id="gCount" type="number" min="10" value="20" style="width:50px;"/> ';
	echo 'w: <input id="gW" type="number" min="2" value="5" style="width:40px;"/> ';
	echo 'h: <input id="gH" type="number" min="2" value="5" style="width:40px;"/>';
	echo '<br><br><input id="btnGenGrass" type="submit" value="Generate grass"/></div>';			
	// инфа о кнопках
	echo '<div align="center"><hr><input id="Err" type="text" value="Last Error"/></div>';
	echo '<div id="info"></div>';
	
	echo '<div align="center"><hr><input id="btnCompile" type="submit" value="Compile map"/></div>';
	echo '</div>';
	
	echo '<div id="panel2" align="left">&nbsp;&nbsp;&nbsp;|&nbsp;A&nbsp;|&nbsp;B&nbsp;|&nbsp;C&nbsp;|&nbsp;D&nbsp;|&nbsp;E<br>';
	echo '1:<input type="checkbox" name="hm" value="a1"><input type="checkbox" name="hm" value="b1"><input type="checkbox" name="hm" value="c1"        ><input type="checkbox" name="hm" value="d1"><input type="checkbox" name="hm" value="e1"><br>';
	echo '2:<input type="checkbox" name="hm" value="a2"><input type="checkbox" name="hm" value="b2"><input type="checkbox" name="hm" value="c2"        ><input type="checkbox" name="hm" value="d2"><input type="checkbox" name="hm" value="e2"><br>';
	echo '3:<input type="checkbox" name="hm" value="a3"><input type="checkbox" name="hm" value="b3"><input type="checkbox" name="hm" value="c3" checked><input type="checkbox" name="hm" value="d3"><input type="checkbox" name="hm" value="e3"><br>';
	echo '4:<input type="checkbox" name="hm" value="a4"><input type="checkbox" name="hm" value="b4"><input type="checkbox" name="hm" value="c4"        ><input type="checkbox" name="hm" value="d4"><input type="checkbox" name="hm" value="e4"><br>';
	echo '5:<input type="checkbox" name="hm" value="a5"><input type="checkbox" name="hm" value="b5"><input type="checkbox" name="hm" value="c5"        ><input type="checkbox" name="hm" value="d5"><input type="checkbox" name="hm" value="e5"><br>';
	echo '</div>';
	
	
	echo '</div>';
	echo '<script>';
	?>
	if (!Detector.webgl) Detector.addGetWebGLMessage();
	//$("#CORE").append(CORE.MainEditor.stats.dom);
	$("#CORE").append(CORE.MainEditor.renderer.domElement);
	//$("#CORE").append(CORE.MainEditor.rendererStats.domElement)
	CORE.MainEditor.INIT();
	CORE.MainEditor.AnimationFrame();

	<?php
	echo '</script>';
	echo '</body></html>';
?>