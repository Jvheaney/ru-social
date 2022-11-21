<?php
  session_start();
  session_destroy();
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
  .imageCont {
    width: 100%;
  }
  @media (min-width:342px) {
    .smallFooterText {
      right: 1px;
      top: 24px;
      font-size: 20px;
    }
    .imageCont {
      width: 90%;
    }
  }
  @media (min-width:511px) {
    .smallFooterText {
      right: 1px;
      top: 34px;
      font-size: 24px;
    }
    .imageCont {
      width: 70%;
    }
  }
  @media (min-width:681px) {
    .smallFooterText {
      right: 1px;
      top: 44px;
      font-size: 28px;
    }
    .imageCont {
      width: 50%;
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
        <center><h1 style="font-family: 'RaleWay'; font-weight: bold;">Hold on!</h1></center>
        <center><div style="padding-left: 5px; padding-right: 5px;"><h3 style="font-family: 'RaleWay'; font-weight: bold;">Our penguins will have your top 5 matches by February 12th!</h3></div></center>
        <center><img class="imageCont" src="./static/media/Thank.fb6ecf77.png" /></center>
  </div>
</main>
<div style="position: relative; height: 150px; width: 100%; background-color: #ff1e73">
  <span class="footerText">RU MINE</span>
  <span class="smallFooterText">#March2020</span>
  <span style="position: absolute; bottom: 0; color: white; font-size: 12px; ">&copy; RU Mine 2020. RU Mine is not affiliated with Ryerson University.<br>This web application uses cookies. By using this website you are in agreement with our <a style="color: white;" href="https://kilostudios.com/privacy">cookies policy.</a></span>
</div>
</body>
</html>
