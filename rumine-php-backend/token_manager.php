<?php
require __DIR__ . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

function check_token_and_get_userid($token){

  $SECRET_KEY = "";

  try {
    JWT::$leeway = 3900; // $leeway in seconds, 5 minutes of allowance
  }
  catch(Exception $e){
    echo "Error in leeway: " . $e->getMessage();
    return 0;
  }

  try{
    $decoded = JWT::decode($token, $SECRET_KEY, array('HS256'));
  }
  catch(Exception $e){
    echo "Error in decoding token: " . $e->getMessage();
    return 0;
  }

  try{
    $decoded_array = (array) $decoded;
    $dec_userid = $decoded_array['uid'];
  }
  catch(Exception $e){
    echo "Error converting decoded to array or getting userid: " . $e->getMessage();
    return 0;
  }

  return $dec_userid;
}

?>
