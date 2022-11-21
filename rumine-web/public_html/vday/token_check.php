<?php
require_once '/vendor/autoload.php';
require '../../localArguments.php';

$maintain = "false";

$id_token = $_GET['tok'];
$CLIENT_ID = "";

$client = new Google_Client(['client_id' => $CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
$payload = $client->verifyIdToken($id_token);

$email = strtolower($payload['email']);

$insf_login_p = pg_prepare($con, "insLoginF", "INSERT INTO logins (userid, success, time, ip_address, reason) VALUES ($1, 'f', 'now()', $2, $3)");
$inst_login_p = pg_prepare($con, "insLoginT", "INSERT INTO logins (userid, success, time, ip_address, reason) VALUES ($1, 't', 'now()', $2, $3)");

$ip_address = $_SERVER['REMOTE_ADDR'];

if(strpos($email, '@ryerson.ca') !== false){
  $getUserInfo_p = pg_prepare($con, "getUser", "SELECT * FROM users WHERE TRIM(email)=$1 AND deleted='f'");
  $getUserInfo_e = pg_execute($con, "getUser", array($email));
  $getUserInfo = pg_fetch_row($getUserInfo_e);
  if($getUserInfo == false){
    //Create account
    //$firstname = strtolower($payload['given_name']);
    //$lastname = strtolower($payload['family_name']);
    //$userid = generateRandomString(21) . "-" . time();

    //$ins_user_p = pg_prepare($con, "insUser", "INSERT INTO users (userid, email, firstname, lastname, deleted, registered, ip_address_registered) VALUES ($1, $2, $3, $4, 'f', 'now()', $5)");
    //$ins_user_e = pg_execute($con, "insUser", array($userid, $email, $firstname, $lastname, $ip_address));
    //if(pg_affected_rows($ins_user_e) == 1){
      echo "nonewaccount";
      //session_start();
      //$_SESSION['userid'] = $userid;
      //$_SESSION['submitted'] = "ig";
    //  $rsn = "SUCCESS (CREATE)";
      //$ins_login_e = pg_execute($con, "insLoginT", array($userid, $ip_address, $rsn));
    //}
    //else{
      //echo "ins-fail";
      //$rsn = "INS-FAIL ON " . $email;
      //$ins_login_e = pg_execute($con, "insLoginF", array("N/A", $ip_address, $rsn));
    //}
  }
  else{
    //$getSub_p = pg_prepare($con, "checkSubmissions", "SELECT COUNT(*) FROM match_answers WHERE userid=$1");
    //$getSub_e = pg_execute($con, "checkSubmissions", array($getUserInfo[0]));
    //$getSub = pg_fetch_row($getSub_e);
    session_start();
    $_SESSION['userid'] = $getUserInfo[0];
    $_SESSION['name'] = $getUserInfo[2];
    //if($getSub[0] == 1){
    //  $_SESSION['submitted'] = "thanks";
    //}
    //else{
    //  $getIg_p = pg_prepare($con, "checkInstagram", "SELECT COUNT(*) FROM users_ig WHERE userid=$1");
    //  $getIg_e = pg_execute($con, "checkInstagram", array($getUserInfo[0]));
    //  $getIg = pg_fetch_row($getIg_e);
    //  if($getIg[0] == 1){
    //    $_SESSION['submitted'] = "qa";
    //  }
    //}
    echo "success";
    $rsn = "SUCCESS";
    $ins_login_e = pg_execute($con, "insLoginT", array($getUserInfo[0], $ip_address, $rsn));
  }
}
else{
  echo "incorrect-email";
  $rsn = "NOT RYERSON EMAIL ON " . $email;
  $ins_login_e = pg_execute($con, "insLoginF", array("N/A", $ip_address, $rsn));
}

?>
