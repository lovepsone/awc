<?php
$mytext = "";
$fp = fopen('counter.txt', 'rt');

if ($fp) 
{
	while (!feof($fp))
	{
		$mytext .= fgets($fp, 9999);
	}
}
$mytext = preg_replace("/[ ]+/i", "", $mytext);
echo $mytext;
?>