<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'localArguments.php';

$courses_p = pg_prepare($con,'get_trending', 'SELECT course_code from course_search_tracker where search_count>0 ORDER BY search_count DESC LIMIT 5');
$courses_e = pg_execute($con,'get_trending',array());
$courses = pg_fetch_all($courses_e);

echo json_encode($courses);


 ?>
