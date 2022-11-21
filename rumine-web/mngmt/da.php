<?php
$ipadd = $_SERVER['REMOTE_ADDR'];
if($ipadd == gethostbyname("")){
include 'localArguments.php';
$original_userid = $_POST['u'];
$new_delete_userid = generateRandomString(24) . "-" . "deleted";
$reason = $_POST['reason'];
$new_userid = generateRandomString(21) . "-" . time();
$ins_deleted_p = pg_prepare($con, "ins_deleted", "INSERT INTO removed_accounts (original_userid, deleted_userid, time, reason, newuserid) VALUES ($1, $2, 'now()', $3, $4)");
$ins_deleted_e = pg_execute($con, "ins_deleted", array($original_userid, $new_delete_userid, $reason,$new_userid));

//Update with new userid
$upd_matches_p = pg_prepare($con, "upd_matches1", "UPDATE matches SET isactive='f' WHERE (userid_1=$1 OR userid_2=$1);");
$upd_matches_e = pg_execute($con, "upd_matches1", array($original_userid));

$upd_images_p = pg_prepare($con, "upd_images", "UPDATE images SET userid=$2 WHERE userid=$1;");
$upd_images_e = pg_execute($con, "upd_images", array($original_userid, $new_delete_userid));

$upd_profile_p = pg_prepare($con, "upd_profile", "UPDATE profiles SET gender=8, userid=$2 WHERE userid=$1;");
$upd_profile_e = pg_execute($con, "upd_profile", array($original_userid, $new_delete_userid));

$upd_refresh_p = pg_prepare($con, "upd_refresh", "UPDATE refresh_tokens SET blacklisted_at='now()' WHERE userid=$1;");
$upd_refresh_e = pg_execute($con, "upd_refresh", array($original_userid));

$upd_users_p = pg_prepare($con, "upd_users", "UPDATE users SET profile_made='f', userid=$2 WHERE userid=$1;");
$upd_users_e = pg_execute($con, "upd_users", array($original_userid, $new_userid));

echo "success";
}
?>
