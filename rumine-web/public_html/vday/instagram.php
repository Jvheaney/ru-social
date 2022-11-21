<?php
  include '../../localArguments.php';
  $ref = $_GET['r'];
  $ig_u = $_GET['u'];
  $elem = $_GET['p'];
  $ipadd = $_SERVER['REMOTE_ADDR'];
  if(strlen($ref) == 64 && strlen($elem)==8){
    if(strpos($ref, 'ref-') !== false || strpos($ref, 'uref-') !== false){
      $match_ins_p = pg_prepare($con, "match_ins", "INSERT INTO analytics (type, time, event, ref_data, ip_address, element_clicked) VALUES ($1, $2, $3, $4, $5, $6)");
      $match_ins_e = pg_execute($con, "match_ins", array('redirect','now()','vday-instagram-click', $ref, $ipadd, $elem));
      header('Location: https://instagram.com/' . $ig_u);
    }
    else{
      header("HTTP/1.1 404 Not Found");
    }
  }
  else{
    header("HTTP/1.1 404 Not Found");
  }
?>
