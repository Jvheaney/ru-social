<?php
require 'vendor/autoload.php';
include '../../token_manager.php';
include 'localArguments.php';
session_start();

$tok = $_GET['tok'];

$rumine_userid = "error";

if(!isset($_SESSION['rumine_userid'])){
  if($tok == ""){
    session_destroy();
    //echo "if1";
    //die();
    header("Location: https://rumine.ca");
  }

  $rumine_userid = check_token_and_get_userid($tok);

  //echo $rumine_userid;
  //echo "\n";

  if(strlen($rumine_userid) != 32){
    session_destroy();
    //echo "if2";
    //die();
    header("Location: https://rumine.ca");
  }
}

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

if(!isset($_SESSION['rumine_userid'])){
  $_SESSION['rumine_userid'] = $rumine_userid;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $provider = new Kerox\OAuth2\Client\Provider\Spotify([
        'clientId'     => <CLIENT-ID>,
        'clientSecret' => <CLIENT-SECRET>,
        'redirectUri'  => 'https://rumine.ca/apiv2/spotify.php',

    ]);

    if (!isset($_GET['code'])) {

        $userid = $_GET['userid'];
        // If we don't have an authorization code then get one
        $authUrl = $provider->getAuthorizationUrl([
            'scope' => [
                Kerox\OAuth2\Client\Provider\Spotify::SCOPE_USER_READ_EMAIL,
                Kerox\OAuth2\Client\Provider\Spotify::SCOPE_USER_TOP_READ,

            ],
            'state'  => $userid,
        ]);
        $_SESSION['oauth2state'] = $provider->getState();

        header('Location: ' . $authUrl);
        exit;

    // Check given state against previously stored one to mitigate CSRF attack
    } elseif (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {

        unset($_SESSION['oauth2state']);
        //echo 'Invalid state.';
        exit;

    }


    // Try to get an access token (using the authorization code grant)
    $token = $provider->getAccessToken('authorization_code', [
        'code' => $_GET['code']
    ]);

    $userid = $_GET['state'];
    //echo "<br> userid  = '{$userid}'";

    try {


        /** @var \Kerox\OAuth2\Client\Provider\SpotifyResourceOwner $user */
        $user = $provider->getResourceOwner($token);

        $username = $user->getDisplayName();
        //echo "<br> Hello '{$username}'";

        //echo $_SESSION['rumine_userid'];



        $crl = curl_init();
        $limit = 5;
        $url = 'https://api.spotify.com/v1/me/top/artists'.'?limit='.$limit;

        $headr = array();
        $headr[] = 'Accept: application/json';
        $headr[] = 'Content-type: application/json';
        $tt = $token->getToken();
        // echo $tt;
        $headr[] = 'Authorization: Bearer '.$tt;

        curl_setopt($crl, CURLOPT_HTTPHEADER,$headr);

        curl_setopt($crl, CURLOPT_URL,$url);
        curl_setopt($crl,CURLOPT_RETURNTRANSFER,1);
        $rest = curl_exec($crl);


        curl_close($crl);


        $jsondata = json_decode($rest, true);

        $itms =  $jsondata['items'];

        $artist_ids_to_add = "[\"";

        $ins_artists_p = pg_prepare($con,'ins_artists', 'INSERT INTO spotify_artists (artist_id, artist_name, artist_image) VALUES ($1, $2, $3)');
        $ins_user_artists_p = pg_prepare($con,'ins_user_artists', 'UPDATE profiles set top_5_spotify=$1 WHERE userid=$2');


        foreach($itms as $artist) {
          if(strlen($artist_ids_to_add) != 2){
            $artist_ids_to_add .= ",\"";
          }
          $artist_ids_to_add .= $artist['id'] . "\"";
          $ins_artists_e = pg_execute($con,'ins_artists',array($artist['id'],$artist['name'],$artist['images'][0]['url']));
        }

        if($artist_ids_to_add == '["'){
          $artist_ids_to_add .= "\"";
        }

        $artist_ids_to_add .= "]";

        $ins_user_artists_e = pg_execute($con, 'ins_user_artists', array($artist_ids_to_add, $_SESSION['rumine_userid']));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "{spring-boot-backend}/gw/fp/syncs");
        curl_setopt($ch, CURLOPT_POST, 1);
        $postfields = array();
        $postfields['spotifyData'] = $artist_ids_to_add;
        $postfields['userid'] = $_SESSION['rumine_userid'];
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $result = curl_exec($ch);


        print_r($result);
        curl_close($ch);

        echo "<script>window.ReactNativeWebView.postMessage(JSON.stringify(" . json_encode($itms) . "))</script>";




    } catch (Exception $e) {

        // Failed to get user details
        exit('Damned...');
    }


}

?>
