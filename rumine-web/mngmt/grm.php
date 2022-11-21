<?php
$ipadd = $_SERVER['REMOTE_ADDR'];
if($ipadd == gethostbyname("")){
include 'localArguments.php';

$offset = $_GET['o'];

$prep = pg_prepare($con, 'getReportedMatches', "SELECT * FROM reported_matches rm LEFT JOIN matches m ON rm.reported_matchid = m.matchid ORDER BY submitted DESC OFFSET $1 LIMIT 50");
$exec = pg_execute($con, 'getReportedMatches', array($offset));
$fetch = pg_fetch_all($exec);

echo json_encode($fetch);
}
?>
