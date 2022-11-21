<?php
include '../localArguments.php';
session_start();
if(crypt($_SESSION['tokCheck'], $_POST['tokPass']) == $_POST['tokPass']){

  $email = strtolower($_POST['email']);
  $gender = $_POST['gender'];
  $program = $_POST['program'];
  $year = $_POST['year'];
  $ip_address = $_SERVER['REMOTE_ADDR'];

  if(filter_var($email, FILTER_VALIDATE_EMAIL)){
    $signup_ins_p = pg_prepare($con, "signup_ins", "INSERT INTO signups (email, gender, program, submitted, ip_address, year) VALUES ($1, $2, $3, 'now()', $4, $5) ON CONFLICT ON CONSTRAINT email_key DO NOTHING");
    $signup_ins_e = pg_execute($con, "signup_ins", array($email, $gender, $program, $ip_address, $year));
    if(pg_affected_rows($signup_ins_e) == 1){
      echo "success";
    }
    else{
      echo "fail";
    }
  }
  else{
    echo "fail";
  }


}
else{
  echo "auth-fail";
}

?>
