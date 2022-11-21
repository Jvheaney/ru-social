<?php
$ipadd = $_SERVER['REMOTE_ADDR'];
if($ipadd == gethostbyname("")){
include 'localArguments.php';

$userid = $_GET['u'];

$prep = pg_prepare($con, 'getProfile', "SELECT * from profiles p LEFT JOIN users u ON p.userid=u.userid WHERE u.userid = $1");
$exec = pg_execute($con, 'getProfile', array($userid));
$fetch = pg_fetch_all($exec);

$prep = pg_prepare($con, 'getImages', "SELECT imgid from images i WHERE i.deleted='f' AND i.userid = $1");
$exec = pg_execute($con, 'getImages', array($userid));
$images = pg_fetch_all($exec);

$prep = pg_prepare($con, 'getLastLoggedIn', "SELECT ip_address, issued, expiry FROM refresh_tokens WHERE userid = $1 AND blacklisted_at is NULL ORDER BY issued desc LIMIT 1");
$exec = pg_execute($con, 'getLastLoggedIn', array($userid));
$lastLog = pg_fetch_all($exec);

$ret = array('user' => $fetch[0], 'images' => $images, 'last-token' => $lastLog);

echo json_encode($ret);
}
?>
