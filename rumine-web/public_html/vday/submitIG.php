<?php
//header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: *");
include '../../localArguments.php';
session_start();
if(crypt($_SESSION['tokCheck'], $_POST['tokPass']) == $_POST['tokPass']){
//$ipadd = $_SERVER['REMOTE_ADDR'];
  $handle = strtolower($_POST['handle']);
  $userid = $_SESSION['userid'];
  $ip_address = $_SERVER['REMOTE_ADDR'];


    $ig_ins_p = pg_prepare($con, "user_ig_ins", "INSERT INTO users_ig (userid, ig_handle, submitted, ip_address) VALUES ($1, $2, 'now()', $3) ON CONFLICT ON CONSTRAINT uid_key DO NOTHING");
    $ig_ins_e = pg_execute($con, "user_ig_ins", array($userid, $handle, $ip_address));
    if(pg_affected_rows($ig_ins_e) == 1){
      echo json_encode("success");
       $_SESSION['submitted'] = "qa";
    }
    else{
      $ig_upd_p = pg_prepare($con, "user_ig_upd", "UPDATE users_ig SET ig_handle=$1, submitted='now()', ip_address=$2 WHERE userid = $3");
      $ig_upd_e = pg_execute($con, "user_ig_upd", array($handle, $ip_address, $userid));
      if(pg_affected_rows($ig_upd_e) == 1){
        echo json_encode("success");
         $_SESSION['submitted'] = "qa";
      }
      else{
        echo json_encode("fail");
      }
    }


}
else{
  echo json_encode("auth-fail");
}

?>
