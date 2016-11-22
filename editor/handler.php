<?php
	$data = explode(":", $_POST['data']);
	$idMap = $data[0];
	$mas = array();
	$buf = array();
	$j = 0;

	for ($i = 1; $i < count($data); $i++)
	{
		$buf = explode("|", $data[$i]);

		$mas[$j] = array(
			'id' =>$buf[0], 
			'px' => $buf[1],
			'py' => $buf[2],
			'pz' => $buf[3],
			'rx' => $buf[4],
			'ry' => $buf[5],
			'rz' => $buf[6],
			'sx' => $buf[7],
			'sy' => $buf[8],
			'sz' => $buf[9],
			'cc' => $buf[10], // collision
			);
		$j++;
	}

	$startm = '';
	$namem = '';
	$namef = '';
	$j = 0;

	switch($idMap)
	{
		case 0:
			$startm = "var MAPS = MAPS || {};\nMAPS.Lobby = MAPS.Lobby || {};\n\nMAPS.Lobby.mesh = [];\n";
			$namem = "MAPS.Lobby.mesh";
			$namef = "MAPS.Lobby.js";
			break;
		case 1:
			$startm = "var MAPS = MAPS || {};\nMAPS.Map1 = MAPS.Map1 || {};\n\nMAPS.Map1.mesh = [];\n";
			$namem = "MAPS.Map1.mesh";
			$namef = "MAPS.Map1.js";
			break;
	}

	$fp = fopen('../core/Maps/'.$namef, 'w+');
	fwrite($fp, $startm);
	for ($i = 0; $i < count($mas); $i++)
	{
		fwrite($fp, $namem."[".$i."] = {id:".$mas[$i]['id'].", collision: ".$mas[$i]['cc'].", position: new THREE.Vector3(".$mas[$i]['px'].", ".$mas[$i]['py'].", ".$mas[$i]['pz']."), rotation: new THREE.Vector3(".$mas[$i]['rx'].", ".$mas[$i]['ry'].", ".$mas[$i]['rz']."), scale: new THREE.Vector3(".$mas[$i]['sx'].", ".$mas[$i]['sy'].", ".$mas[$i]['sz'].")};\n");
	}
	fclose($fp);
?>