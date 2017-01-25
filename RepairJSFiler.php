<?php

	$f = scandir('RepairJSFiler/');
	$nFiles = array();

 	for ($i = 0; $i < count($f); $i++)
 	{
 		$tmp = explode(".", $f[$i]);
 		
 		if ($f[$i][0] != '.' && $tmp[1] == 'js')
 		{
 			array_push($nFiles, $f[$i]);
 			echo $f[$i].'<br/>';
 		}
 	}

	file_put_contents("RepairJSFiler/RepairJSFiler.txt","");
	$fp = fopen("RepairJSFiler/RepairJSFiler.txt" ,"aw");
	
	if ($fp)
	{
		for ($i = 0; $i < count($nFiles); $i++)
		{
			fwrite($fp, $nFiles[$i]."\r\n");
		}
	}
	else
	{
		echo '<br/> Error open file!!!';
	}
	fclose($fp);
	//exec('RepairJSFiler.bat');
?>