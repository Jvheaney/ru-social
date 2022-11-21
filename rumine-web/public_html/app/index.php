<?php
$tokCheck='';
session_start();
if(isset($_SESSION['userid'])){
?>
  <html>
  <head>
    <title>RU Mine Account Manager</title>
    <meta name="description" content="RU Mine Account Manager"/>
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
      <meta name="google-signin-client_id" content="464291172076-nibbm0voglfpv9793qdat848mrcbucjs.apps.googleusercontent.com">
      <script src="https://apis.google.com/js/platform.js?onload=onLoad" async defer></script>

      <link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet">    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
      <link href="https://fonts.googleapis.com/css?family=Bowlby+One+SC&display=swap" rel="stylesheet">    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
      <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">    <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->

    <style>
    main {
      flex: 1 0 auto;
      min-height: calc(100vh - 150px);
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
  <body>
    <nav>
    <div style="background-color: #ff5b99;" class="nav-wrapper">
      <a href="#" class="brand-logo"><img src="../img/logo.png" width="200" /></a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="signin.php">Sign Out</a></li>
      </ul>
    </div>
  </nav>
  <main class="valign-wrapper">
    <div class="row">
      <div class="col s12 m8 offset-m2">
        <div class="card pink lighten-5">
          <div class="card-content black-text">
            <span class="card-title">Delete Account</span>
            <p>We are sorry to see you go! Please tell us why you're planning to leave so we can improve!</p>
            <br>
            <div class="row">
              <form id="leaving_form" method="post" action="deleteAccount.php" class="col s12">
                <div class="row">
                  <div class="input-field col s12">
                      <textarea id="leavingReason" name="reason" maxlength="128" style="color: black;" class="materialize-textarea"></textarea>
                      <label for="leavingReason" style="color: black;">I am leaving because...</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="card-action" style="text-align: center;">
              <a onclick="deleteAccount()" style="color: white; padding: 10px; background-color: #ff5b99;" href="#">DELETE MY ACCOUNT</a>
            </div>
          </div>
        </div>
    </div>
  </main>
  <script>
  function deleteAccount(){
    if(document.getElementById('leavingReason').value != ""){
      if(confirm("Are you sure you want to leave? This cannot be undone.")){
        document.getElementById('leaving_form').submit();
      }
    }
    else{
      alert("Please tell us why you're leaving the platform.");
    }
  }
  </script>
</body>
</html>
<?
}
else{
  header('Location: https://rumine.ca/app/signin.php');
}
?>
