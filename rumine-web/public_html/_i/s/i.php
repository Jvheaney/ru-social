<?php
include '../../../localArguments.php';
$imageID = $_GET['i'];

$img_file_p = pg_prepare($con, 'img_f', "SELECT data FROM images WHERE imgid = $1 AND deleted='f'");
$img_file_e = pg_execute($con, 'img_f', array($imageID));
$img_file = pg_fetch_row($img_file_e);
$img_file = $img_file[0];

$path = "rumine/img_uploads/" . $img_file;

$c = file_get_contents($path,true);
$size = filesize($path);
header ('Content-Type: image/jpg');
header ("Content-length: $size");
echo $c;
exit;
 ?>
