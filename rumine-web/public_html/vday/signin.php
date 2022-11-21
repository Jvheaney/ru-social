<?php
if(time() > 1581526799){
include '../../localArguments.php';
//$ipadd = $_SERVER['REMOTE_ADDR'];
session_start();
session_destroy();
$inApp = false;
if ((strpos($_SERVER['HTTP_USER_AGENT'], 'Mobile/') !== false) && (strpos($_SERVER['HTTP_USER_AGENT'], 'Safari/') == false)) {
    $inApp = true;
}
else if($_SERVER['HTTP_X_REQUESTED_WITH'] == "com.facebook.orca") {
    $inApp = true;
}
$tok = $_GET['t'];
if($tok != ""){
  $ipadd = $_SERVER['REMOTE_ADDR'];
  $upd_p = pg_prepare($con, 'upd', "UPDATE email_analytics SET time_updated=$1, status=$2, ipaddress_updated=$3 WHERE token=$4 AND status=0");
  $upd_e = pg_execute($con, 'upd', array('now()', 1, $ipadd, $tok));
}
?>
  <html>
  <head>
    <title>RU Mine Cupid's Arrow</title>
    <meta name="description" content="RU Mine's Cupid's Arrow - Valentine's Day Special"/>
    <meta name="keywords" content="RU, Mine, RU Mine, ryerson, university, dating, community">
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png">
    <link rel="manifest" href="./site.webmanifest">
    <link rel="mask-icon" href="./safari-pinned-tab.svg" color="#ff6781">
    <meta name="msapplication-TileColor" content="#ff6781">
    <meta name="theme-color" content="#ff6781">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--Import jQuery before materialize.js-->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <!-- Compiled and minified CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

      <!-- Compiled and minified JavaScript -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>

      <meta name="google-signin-scope" content="profile email">
      <meta name="google-signin-client_id" content="">
      <script src="https://apis.google.com/js/platform.js?onload=onLoad" async defer></script>

      <link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet">    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
      <link href="https://fonts.googleapis.com/css?family=Bowlby+One+SC&display=swap" rel="stylesheet">    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
      <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->

    <style>
    main {
      flex: 1 0 auto;
      min-height: calc(100vh - 300px);
      height: 'auto';
    }
    #toast-container {
    top: auto !important;
    left: auto !important;
    bottom: 25%;
    right: 7%;
    }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
      -ms-overflow-style: none;
    }
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }

    text {
      font-family: 'Raleway'
    }

    body::-webkit-scrollbar {
      display: none;
    }

    .topText {
      position: absolute;
      bottom: 15px;
      font-size: 18px;
      font-family: 'Bowlby One SC';
      color: white;
    }


    .cupid-logo{
      display: none;
      height: 1px;
      width: 1px;
    }
    @media (min-width:802px) {
      .cupid-logo{
        height: 75px;
        width: auto;
        left: 10px;
        display: inline;
      }
    }

    .ArrowLogo {
      position: absolute;
      bottom: 15px;
      top: 300px;


    }
    @media (min-width:342px) {
      .topText {
        left: 3px;
        bottom: 20px;
        font-size: 20px;
      }
    }
    @media (min-width:511px) {
      .topText {
        left: 5px;
        bottom: 30px;
        font-size: 24px;
      }
    }
    @media (min-width:681px) {
      .topText {
        left: 5px;
        bottom: 40px;
        font-size: 28px;
      }
    }



    .bottomText {
      position: absolute;
      bottom: -15px;
      font-size: 30px;
      font-family: 'Bowlby One SC';
      color: white;
    }
    @media (min-width:342px) {
      .bottomText {
        bottom: -20px;
        font-size: 40px;
      }
    }
    @media (min-width:511px) {
      .bottomText {
        bottom: -30px;
        font-size: 60px;
      }
    }
    @media (min-width:681px) {
      .bottomText {
        bottom: -40px;
        font-size: 80px;
      }
    }

    .footerText {
      position: absolute;
      top: -11px;
      right: 1px;
      font-size: 30px;
      font-family: 'Bowlby One SC';
      color: white;
    }
    @media (min-width:342px) {
      .footerText {
        top: -16px;
        font-size: 40px;
      }
    }
    @media (min-width:511px) {
      .footerText {
        top: -26px;
        font-size: 60px;
      }
    }
    @media (min-width:681px) {
      .footerText {
        top: -36px;
        font-size: 80px;
      }
    }

    .smallFooterText {
      position: absolute;
      right: 1px;
      top: 19px;
      font-size: 18px;
      font-family: 'Bowlby One SC';
      color: white;
    }
    @media (min-width:342px) {
      .smallFooterText {
        right: 1px;
        top: 24px;
        font-size: 20px;
      }
    }
    @media (min-width:511px) {
      .smallFooterText {
        right: 1px;
        top: 34px;
        font-size: 24px;
      }
    }
    @media (min-width:681px) {
      .smallFooterText {
        right: 1px;
        top: 44px;
        font-size: 28px;
      }
    }

    </style>
  </head>
  <body background="./bkgc.jpg">
    <div style="position: relative; height: 150px; width: 100%; background-color: #ffffff">
      <span class="topText"><font color="#ff1e73">valentine's day</font></span>
      <span class="bottomText"> <font color="#ff1e73">Cupid's Arrow</font><img class="cupid-logo" src="./ArrrowC.png" /></span>
      <div style="position: absolute; right: 0;">
        <a href="https://rumine.ca"><img style=" width: 247px; height: 93px" src="./LOGOS.png" /></a>
      </div>
    </div>
  <main class="valign-wrapper">
    <div class="row">
          <center><h5 style="font-family: 'RaleWay'; font-weight: bold;">Ready to find your top Ryerson matches?</h5></center>
          <center><span style="font-family: 'RaleWay';">Sign in with your Ryerson email to continue!</span></center>
          <br>
          <? if ($inApp == false) {
            echo "<center><div class='g-signin2' data-onsuccess='onSignIn' data-theme='dark'></div></center>";
           } else {
            echo "<center><h5>Please visit this website in Safari, Chrome, or another browser to continue.</h5></center>";
           } ?>
          <br>
          <center><span style="font-family: 'RaleWay'; font-weight: bold;">This is <u>not</u> the app, just a Valentine's day surprise leading to #March2020!</span></center>
          <br>
          <center><a href="https://rumine.ca/press/vday.php" style="font-family: 'RaleWay'; font-weight: bold;">Learn more.</a></center>
          <script>
          function onSignIn(googleUser) {
            // Useful data for your client-side scripts:
            var profile = googleUser.getBasicProfile();
            // The ID token you need to pass to your backend:
            var id_token = googleUser.getAuthResponse().id_token;
            $.ajax({
              url:"./token_check.php?tok=" + id_token,
              data: "",
              success:function(data)
              {
                signOut();
                if(data == "success"){
                  window.location.href="./matches.php";
                }
                else if(data == "ins-fail"){
                  M.toast({html: 'There seems to be an issue. We\'re looking into it now.'});
                }
                else if(data == "nonewaccount"){
                  M.toast({html: 'Sorry, Cupid\'s Arrow is closed for new submissions.'});
                }
                else if(data == "incorrect-email"){
                  M.toast({html: 'Please use your Ryerson account.'});
                }
                else {
                  M.toast({html: 'Error signing in, please try again later.'});
                }
              },
              error:function(data){
                M.toast({html: 'Server error, please try again later.'});
                signOut();
              }
            });
          };
          function onLoad() {
            gapi.load('auth2', function() {
              gapi.auth2.init();
            });
          }
            function signOut() {
              var auth2 = gapi.auth2.getAuthInstance();
              auth2.disconnect();
          }
          </script>
    </div>
  </main>
  <div style="position: relative; height: 150px; width: 100%; background-color: #ff1e73">
    <span class="footerText">RU MINE</span>
    <span class="smallFooterText">#March2020</span>
    <span style="position: absolute; bottom: 0; color: white; font-size: 12px; ">&copy; RU Mine 2020. RU Mine is not affiliated with Ryerson University.<br>This web application uses cookies. By using this website you are in agreement with our <a style="color: white;" href="https://kilostudios.com/privacy">cookies policy.</a></span>
  </div>
</body>
</html>
<?
}
else{
  header('Location: ./thanks.php');
}
?>
