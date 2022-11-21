<?php
//header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: *");
include '../../localArguments.php';
session_start();
if(crypt($_SESSION['tokCheck'], $_POST['tokPass']) == $_POST['tokPass']){
//$ipadd = $_SERVER['REMOTE_ADDR'];

  $answerArray = json_decode($_POST['answers']);
  $userid = $_SESSION['userid'];
  $ip_address = $_SERVER['REMOTE_ADDR'];

  $interestedArray = $answerArray[16];
  $interestedArray = str_replace("null", "false", $interestedArray);
  $interestedArray = explode(",",substr($interestedArray,1,strlen($interestedArray)-2));


    $match_ins_p = pg_prepare($con, "match_ins", "INSERT INTO match_answers (userid, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, ip_address, submitted, gender, interested_in, interested_male, interested_female, interested_nb, interested_trans, interested_other) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'now()', $18, $19, $20, $21, $22, $23, $24) ON CONFLICT ON CONSTRAINT userid_key DO NOTHING");
    $match_ins_e = pg_execute($con, "match_ins", array($userid, $answerArray[0], $answerArray[1], $answerArray[2], $answerArray[3], $answerArray[4], $answerArray[5], $answerArray[6], $answerArray[7], $answerArray[8], $answerArray[9], $answerArray[10], $answerArray[11], $answerArray[12], $answerArray[13], $answerArray[14], $ip_address, $answerArray[15], $answerArray[16], $interestedArray[0], $interestedArray[1], $interestedArray[2], $interestedArray[3], $interestedArray[4]));
    if(pg_affected_rows($match_ins_e) == 1){
      echo json_encode("success");
      $_SESSION['submitted'] = "thanks";
      session_destroy();
    }
    else{
      echo json_encode("fail");
    }


}
else{
  echo json_encode("auth-fail");
}

?>
