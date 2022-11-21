<?php
$ipadd = $_SERVER['REMOTE_ADDR'];
if($ipadd == gethostbyname("")){
include 'localArguments.php';

$offset = $_GET['o'];

$prep = pg_prepare($con, 'getSuggestions', "SELECT * FROM suggestions ORDER BY submitted DESC OFFSET $1 LIMIT 50");
$exec = pg_execute($con, 'getSuggestions', array($offset));
$fetch = pg_fetch_all($exec);

echo json_encode($fetch);
}
?>
