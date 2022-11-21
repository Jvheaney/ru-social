<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'localArguments.php';

$course_code = $_POST['course_code'];

$OK = 1;

$course_cleaned = trim(strtolower($course_code));

if(preg_match('/^[A-Za-z]+ [0-9]+$/', $course_cleaned)){
  $OK = 1;
}
else if(preg_match('/^[A-Za-z]+[0-9]+$/', $course_cleaned)){
  preg_match_all('/\p{L}/', $course_cleaned, $matches, PREG_OFFSET_CAPTURE);
  $lastMatch = $matches[0][count($matches[0])-1];
  $course_cleaned = substr($course_cleaned, 0, $lastMatch[1]+1) . " " . substr($course_cleaned, $lastMatch[1]+1);
  $OK = 1;
}

if($OK == 1 && strlen($course_cleaned) > 0){
  $course_p = pg_prepare($con,'get_course', 'SELECT course_code from courses where LOWER(course_code)=$1');
  $course_e = pg_execute($con,'get_course',array($course_cleaned));
  $course = pg_fetch_row($course_e);

  if(strtolower($course[0]) == $course_cleaned){
    //Increment searches count
    $count_p = pg_prepare($con,'increment_count', 'UPDATE course_search_tracker SET search_count = search_count + 1 WHERE course_code=$1');
    $count_e = pg_execute($con,'increment_count',array($course[0]));

    echo "https://rufriends.me/join/s.php?i=gid$" . str_replace(" ","",$course_cleaned);
  }
  else{
    echo "dne";
  }


}
else{
  echo "dne";
}



 ?>
