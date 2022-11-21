<?php
$ipadd = $_SERVER['REMOTE_ADDR'];
if($ipadd == gethostbyname("")){
include 'localArguments.php';
$original_userid = $_POST['u'];
$reason = $_POST['reason'];
$ins_hidden_p = pg_prepare($con, "ins_hidden", "INSERT INTO hidden_accounts (userid, time, reason) VALUES ($1, 'now()', $2)");
$ins_hidden_e = pg_execute($con, "ins_hidden", array($original_userid, $reason));

$upd_profile_p = pg_prepare($con, "upd_profile", "UPDATE profiles SET gender=8 WHERE userid=$1;");
$upd_profile_e = pg_execute($con, "upd_profile", array($original_userid));

echo "success";
}
?>
