<?php
include 'localArguments.php';
$imageID = $_GET['i'];

$img_file_p = pg_prepare($con, 'img_f', "SELECT data, file_type, compressed FROM images WHERE imgid = $1");
$img_file_e = pg_execute($con, 'img_f', array($imageID));
$img_file_r = pg_fetch_row($img_file_e);
$img_file = $img_file_r[0];
$file_type = $img_file_r[1];
$compressed = $img_file_r[2];

if($file_type == null){
  //Classic image
  $path = "rumine/img_uploads/" . $img_file;

  $c = file_get_contents($path,true);
  $size = filesize($path);
  header ('Content-Type: image/jpg');
  header ("Content-length: $size");
  echo $c;
  exit;
}
else if($compressed){
  //Compressed new image
  $path = "rumine/img_uploads/" . $img_file . "_o";

  $c = file_get_contents($path,true);
  $size = filesize($path);
  header ("Content-Type: $file_type");
  header ("Content-length: $size");
  echo $c;
  exit;
}
else{
  //Uncompressed image
  $path = "rumine/img_uploads/" . $img_file;

  $c = file_get_contents($path,true);
  $size = filesize($path);
  header ("Content-Type: $file_type");
  header ("Content-length: $size");
  echo $c;
  exit;
}


 ?>
