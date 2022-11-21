<?php
include 'localArguments.php';

$pg_p = pg_prepare($con, "updateSwipeHistory", "UPDATE swipe_history SET liked=$1, time='now()' WHERE userid=$2 AND swipeid=$3");
$pg_e = pg_execute($con, "updateSwipeHistory", array($argv[1], $argv[2], $argv[3]));
echo "completed - q1";
$pg_p_2 = pg_prepare($con, "insertReswipeHistory", "INSERT INTO reswipe_history (liked, userid, swipeid, time) VALUES ($1, $2, $3, 'now()')");
$pg_e_2 = pg_execute($con, "insertReswipeHistory", array($argv[1], $argv[2], $argv[3]));
echo "compeleted - q2";
?>
