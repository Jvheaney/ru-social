<?php
include '../../localArguments.php';
if(time() > 1581526799){
session_start();
$external = false;
if($_GET['s'] != '' && strpos($_GET['s'], 'ref-') !== false && strlen($_GET['s']) == 64){
  $error = false;
  $ref = $_GET['s'];
  $external = true;
  $match_ins_p = pg_prepare($con, "match_ins", "INSERT INTO analytics (type, time, event, ref_data) VALUES ($1, $2, $3, $4)");
  $match_ins_e = pg_execute($con, "match_ins", array('page-enter','now()','vday-shared-link', $ref));

  $name_p = pg_prepare($con, 'sel_name', "SELECT users.firstname FROM users, user_references WHERE users.userid=user_references.userid AND user_references.ref=$1");
  $name_e = pg_execute($con, 'sel_name', array($ref));
  $name_r = pg_fetch_row($name_e);
  $name = $name_r[0];

  $sel_p = pg_prepare($con, 'sel_ext', "SELECT top_matches.ig_handle FROM top_matches, user_references WHERE top_matches.userid=user_references.userid AND user_references.ref=$1 ORDER BY top_matches.position ASC");
  $sel_e = pg_execute($con, 'sel_ext', array($ref));
  $sel = pg_fetch_all($sel_e);
}
else if($_GET['s'] == '' && isset($_SESSION['userid'])){
  $error = false;
  $name = $_SESSION['name'];

  if($_POST['conf'] == 't'){
    $newsletter_ins = pg_prepare($con, "newsletter_ins", "INSERT INTO newsletter (userid, confirmed) VALUES ($1, 't') ON CONFLICT ON CONSTRAINT newsletter_uid_key DO NOTHING");
    $newsletter_ins = pg_execute($con, "newsletter_ins", array($_SESSION['userid']));
  }

  $news_p = pg_prepare($con, 'sel_news', "SELECT confirmed FROM newsletter WHERE userid=$1");
  $news_e = pg_execute($con, 'sel_news', array($_SESSION['userid']));
  $news_r = pg_fetch_row($news_e);
  $onMailList = $news_r[0];

  $uref_p = pg_prepare($con, 'sel_uref', "SELECT uref, ref FROM user_references WHERE userid=$1");
  $uref_e = pg_execute($con, 'sel_uref', array($_SESSION['userid']));
  $uref_r = pg_fetch_row($uref_e);
  $ref = $uref_r[0];
  $shareRef = $uref_r[1];

  $sel_p = pg_prepare($con, 'sel_ext_2', "SELECT ig_handle FROM top_matches WHERE userid=$1 ORDER BY position ASC");
  $sel_e = pg_execute($con, 'sel_ext_2', array($_SESSION['userid']));
  $sel = pg_fetch_all($sel_e);
}
else{
  ////
  //header('Location: ./thanks.php');
  ////
  $error = true;
}
if($sel == ""){
  $error = true;
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
    width: 80%;
  }
  .graphCont {
    width: 100%;
  }
  @media (min-width:342px) {
    .smallFooterText {
      right: 1px;
      top: 24px;
      font-size: 20px;
    }
    .imageCont {
      width: 70%;
    }
    .graphCont {
      width: 100%;
    }
  }
  @media (min-width:511px) {
    .smallFooterText {
      right: 1px;
      top: 34px;
      font-size: 24px;
    }
    .imageCont {
      width: 50%;
    }
    .graphCont {
      width: 100%;
    }
  }
  @media (min-width:681px) {
    .smallFooterText {
      right: 1px;
      top: 44px;
      font-size: 28px;
    }
    .imageCont {
      width: 30%;
    }
    .graphCont {
      width: 50%;
    }
  }

  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.js" integrity="sha256-8zyeSXm+yTvzUN1VgAOinFgaVFEFTyYzWShOy9w7WoQ=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.css" integrity="sha256-IvM9nJf/b5l2RoebiFno92E5ONttVyaEEsdemDC6iQA=" crossorigin="anonymous" />
</head>
<body background="./bkgc.jpg">
  <div style="position: relative; height: 150px; width: 100%; background-color: #ffffff">
    <span class="topText"><font color="#ff1e73">valentine's day</font></span>
    <span class="bottomText"> <font color="#ff1e73">Cupid's Arrow</font><img class="cupid-logo" src="./ArrrowC.png" /></span>
    <div style="position: absolute; right: 0;">
      <a href="https://rumine.ca"><img style=" width: 247px; height: 93px" src="./LOGOS.png" /></a>
    </div>
  </div>
  <? if ($error) { ?>
    <main class="valign-wrapper">
      <div class="row">
            <center><h1 style="font-family: 'Roboto'; font-weight: bold; margin-bottom: 0px !important;">Hmmm...</h1></center>
            <center><h2 style="font-family: 'Roboto'; font-weight: normal; margin-top: 0px !important;">It seems like there was an error.</h2></center>
            <center><h4 style="font-family: 'Roboto'; font-weight: normal; margin-top: 0px !important;">Please visit <a href="https://rumine.ca/vday/signin.php">here</a> to sign in again.<br>If you were sent a shareable URL, please ask the user to resend it.</h4></center>
            <center><img class="imageCont" src="./static/media/Errr.503d798f.png" /></center>
      </div>
    </main>
  <? } else if ($_SESSION['userid'] == "tYIZDDDrsZwQwPVnrccwT-1581036390") { ?>
<main class="valign-wrapper">
  <div class="row">
      <? if($external){ ?>
        <center><h1 style="font-family: 'Roboto'; font-weight: bold;">Viewing <? echo ucfirst($name); ?>'s matches:</h1></center>
      <? } else { ?>
        <center><h1 style="font-family: 'Roboto'; font-weight: bold; font-size: 40px; margin-bottom: 0px !important;">Hey <? echo ucfirst($name); ?>!</h1></center>
        <center><h1 style="font-family: 'Roboto'; font-weight: 300; margin-top: 5px !important; margin-bottom: 0px !important;">Here is your match:</h1></center>
        <center><h3 style="font-family: 'Roboto'; font-weight: 100; margin-top: 5px !important;">(Click to check them out on Instagram!)</h3></center>

      <? }

        for ($i = 0; $i < 1; $i++){
          $num = $i + 1;
          if($num == 1){
            $pos = "8duRMj2f";
          }
          echo '<center><h2 style="font-family: \'Roboto\'; font-weight: normal; margin-top: 0px !important;"><a href="https://rumine.ca/vday/instagram.php?u=' . $sel[$i]['ig_handle'] . '&r=' . $ref . '&p=' . $pos . '" style="cursor: pointer; color: #db2e76; text-decoration: none; font-weight: bold;">' . $num . '. @' . $sel[$i]['ig_handle'] . '</a></h2></center>';

        } ?>
        <center><div style="max-width: 600px; width: 100%; text-align: left;"><h2 style="padding: 5px; font-family: 'Roboto'; font-weight: normal; margin-top: 0px !important;">Hey Kumail,<br><br>
          My name is James and I am one of the creators of RU Mine and Cupid's Arrow. I just wanted to reach out to you personally to apologize for only being able to deliver you one match. Although we had a lot of submissions, we unfortunately did not have enough of the combination you were looking for to facilitate more matches. We will be publishing a blog post on <a href=”https://rumine.ca/press/”>our press site</a> soon explaining how matches were created; please feel free to give that a read if you wish to learn more information about how we matched users. Additionally, our DMs on Instagram (@ru_minee) are always open to communicate with us directly.<br><br>Best,<br><br>James
        </h2></div></center>
        <? if (!$external) { ?>
          <br>
          <center><h1 style="font-family: 'Roboto'; font-weight: bold;">Share your matches with your friends!</h1></center>
          <center><div style="width: '100%'; max-width: 460px; border-radius: 5px; background-color: #ff78ab; padding: 10px;"><input id="shareLink" onClick="copyLink()" style="height: auto; width: 90%; max-width: 450px; font-size: 20px; padding: 10px;" type="text" value="https://rumine.ca/vday/matches.php?s=<? echo $shareRef; ?>" /></div></center>
          <center><h3 id="copiedLink" style="font-family: 'Roboto'; font-weight: bold; color: green;"></h3></center>
        <? } ?>
        <br>
        <center><h1 style="font-family: 'Roboto'; font-weight: bold;">Aaaaaand if you're interested...</h1></center>
        <center><h2 style="font-family: 'Roboto'; font-weight: normal; margin-top: 0px !important;">Here is some data we thought was cool and wanted to share!</h2></center>
        <center><div class="graphCont" style="background-color: white;"><canvas id="q1" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">Nahhhh, I'll stick to my coffee!</p><br></div><br><br></center>
        <center><div class="graphCont" style="background-color: white;"><canvas id="q2" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">You're really telling me 7 of you vibe on SLC 2???</p><br></div><br><br></center>
        <center><div class="graphCont" style="background-color: white;"><canvas id="q3" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">I better not catch any of you 388 No's trying to pull a fast one on us 😳😳.</p><br></div><br><br></center>
        <center><div class="graphCont" style="background-color: white;"><canvas id="q5" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">Looks like y'all don't give a crap about Peter finding love, kinda rude ngl!</p><br></div><br><br></center>
        <center><div class="graphCont" style="background-color: white;"><canvas id="q11" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">You heard 'em, put away the Netflix on the first date Chad!<br>(Sorry to all the Chad's out there, I'm sure you're more Hulu people anyway).</p><br></div><br><br></center>
        <center><h1 style="font-family: 'Roboto'; font-weight: bold;">That's it for now.</h1></center>
        <center><h3 style="font-family: 'Roboto'; font-weight: bold;">Thank you for taking part in Cupid's Arrow!<br>We can't wait to show you what is coming... #March2020</h3></center>
  </div>
</main>
<script>

function copyLink() {
  /* Get the text field */
  var copyText = document.getElementById("shareLink");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  document.getElementById("copiedLink").innerHTML = 'Copied!';
  setTimeout(function() {
    document.getElementById("copiedLink").innerHTML = '';
  },2000);
}

var q1 = document.getElementById('q1');
var q1Chart = new Chart(q1, {
    type: 'pie',
    data: {
        labels: ['Pancakes/Waffles', 'Eggs', 'Just a Coffee', 'Pizza from Last Night', 'Skipping Breakfast'],
        datasets: [{
            label: 'The Breakfast of Champions is...',
            data: [204, 102, 63, 62, 66],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        title: {
          display: true,
          text: 'The Breakfast of Champions is...'
        }
    }
});
var q2 = document.getElementById('q2');
var q2Chart = new Chart(q2, {
    type: 'bar',
    data: {
        labels: ['Lobby', 'SLC 2', 'SLC 3', 'SLC 4', 'SLC 5', 'SLC 6', 'SLC 7', 'SLC 8'],
        datasets: [{
            label: 'The Best SLC Floor is...',
            data: [35, 7, 2, 13, 66, 129, 69, 176],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(198, 88, 55, 0.2)',
                'rgba(22, 175, 166, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(198, 88, 55, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
var q3 = document.getElementById('q3');
var q3Chart = new Chart(q3, {
    type: 'horizontalBar',
    data: {
        labels: ['Yes', 'No'],
        datasets: [{
            label: 'Would you take an SLC elevator up 1 floor?',
            data: [109, 388],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
var q5 = document.getElementById('q5');
var q5Chart = new Chart(q5, {
    type: 'doughnut',
    data: {
        labels: ['Who Cares', 'Assignment has to wait!'],
        datasets: [{
            label: 'Your assignment is due tomorrow at midnight, but The Bachelor is on tonight at 8.',
            data: [419, 78],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        title: {
          display: true,
          text: 'Your assignment is due tomorrow at midnight, but The Bachelor is on tonight at 8.'
        }
    }
});
var q11 = document.getElementById('q11');
var q11Chart = new Chart(q11, {
    type: 'bar',
    data: {
        labels: ['Netflix and Chill', 'Disney Plus and Thrust', '"I had a great time, talk soon!"', 'Planning the next date'],
        datasets: [{
            label: 'You had a first date and had a great time, what are you doing now?',
            data: [95, 54, 100, 248],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
</script>
<? } else { ?>
<main class="valign-wrapper">
<div class="row">
    <? if($external){ ?>
      <center><h1 style="font-family: 'Roboto'; font-weight: bold;">Viewing <? echo ucfirst($name); ?>'s matches:</h1></center>
    <? } else { ?>
      <center><h1 style="font-family: 'Roboto'; font-weight: bold; font-size: 40px; margin-bottom: 0px !important;">Hey <? echo ucfirst($name); ?>!</h1></center>
      <center><h1 style="font-family: 'Roboto'; font-weight: 300; margin-top: 5px !important; margin-bottom: 0px !important;">Here are your top 5 matches:</h1></center>
      <center><h3 style="font-family: 'Roboto'; font-weight: 100; margin-top: 5px !important;">(Click to check them out on Instagram!)</h3></center>

    <? }

      for ($i = 0; $i < 5; $i++){
        $num = $i + 1;
        if($num == 1){
          $pos = "8duRMj2f";
        }
        else if($num == 2){
          $pos = "WHR7p-an";
        }
        else if($num == 3){
          $pos = "lPI-GxEM";
        }
        else if($num == 4){
          $pos = "9WSc1rwE";
        }
        else if($num == 5){
          $pos = "Zpe0a_aw";
        }
        echo '<center><h2 style="font-family: \'Roboto\'; font-weight: normal; margin-top: 0px !important;"><a href="https://rumine.ca/vday/instagram.php?u=' . $sel[$i]['ig_handle'] . '&r=' . $ref . '&p=' . $pos . '" style="cursor: pointer; color: #db2e76; text-decoration: none; font-weight: bold;">' . $num . '. @' . $sel[$i]['ig_handle'] . '</a></h2></center>';

      } ?>
      <? if(!$external) { ?>
      <center><h1 style="font-family: 'Roboto'; font-weight: 300;">+ 5 bonus ones!</h1></center>
      <? if($onMailList) {

          for ($i = 5; $i < 10; $i++){
            $num = $i + 1;
            if($num == 5){
              $pos = "4kuFCouT";
            }
            else if($num == 6){
              $pos = "iI6_oT7b";
            }
            else if($num == 7){
              $pos = "_TpYYic1";
            }
            else if($num == 8){
              $pos = "va-I0k3j";
            }
            else if($num == 9){
              $pos = "rk5_Fq48";
            }
            echo '<center><h2 style="font-family: \'Roboto\'; font-weight: normal; margin-top: 0px !important;"><a href="https://rumine.ca/vday/instagram.php?u=' . $sel[$i]['ig_handle'] . '&r=' . $ref . '&p=' . $pos . '" style="cursor: pointer; color: #db2e76; text-decoration: none; font-weight: bold;">' . $num . '. @' . $sel[$i]['ig_handle'] . '</a></h2></center>';

          }
         } else { ?>
           <center><h2 style="font-family: 'Roboto'; font-weight: normal; margin-top: 0px !important;">(If you're on our mailing list)</h2></center>
           <center><form method="post" action="./matches.php"><input type="hidden" value="t" name="conf" /><input type="submit" value="Join Now!" style="cursor: pointer; border-radius: 5px; background-color: #ff78ab; padding: 10px; font-size: 18px; color: white; font-family: 'Roboto'; font-weight: normal;" /></form></center>
      <? } ?>
          <br>
          <center><h1 style="font-family: 'Roboto'; font-weight: bold;">Share your matches with your friends!</h1></center>
          <center><div style="width: '100%'; max-width: 460px; border-radius: 5px; background-color: #ff78ab; padding: 10px;"><input id="shareLink" onClick="copyLink()" style="height: auto; width: 90%; max-width: 450px; font-size: 20px; padding: 10px;" type="text" value="https://rumine.ca/vday/matches.php?s=<? echo $shareRef; ?>" /></div></center>
          <center><h3 id="copiedLink" style="font-family: 'Roboto'; font-weight: bold; color: green;"></h3></center>
      <? } ?>
      <br>
      <center><h1 style="font-family: 'Roboto'; font-weight: bold;">Aaaaaand if you're interested...</h1></center>
      <center><h2 style="font-family: 'Roboto'; font-weight: normal; margin-top: 0px !important;">Here is some data we thought was cool and wanted to share!</h2></center>
      <center><div class="graphCont" style="background-color: white;"><canvas id="q1" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">Nahhhh, I'll stick to my coffee!</p><br></div><br><br></center>
      <center><div class="graphCont" style="background-color: white;"><canvas id="q2" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">You're really telling me 7 of you vibe on SLC 2???</p><br></div><br><br></center>
      <center><div class="graphCont" style="background-color: white;"><canvas id="q3" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">I better not catch any of you 388 No's trying to pull a fast one on us 😳😳.</p><br></div><br><br></center>
      <center><div class="graphCont" style="background-color: white;"><canvas id="q5" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">Looks like y'all don't give a crap about Peter finding love, kinda rude ngl!</p><br></div><br><br></center>
      <center><div class="graphCont" style="background-color: white;"><canvas id="q11" width="300" height="200"></canvas><p style="font-family: 'Roboto'; font-weight: normal;">You heard 'em, put away the Netflix on the first date Chad!<br>(Sorry to all the Chad's out there, I'm sure you're more Hulu people anyway).</p><br></div><br><br></center>
      <center><h1 style="font-family: 'Roboto'; font-weight: bold;">That's it for now.</h1></center>
      <center><h3 style="font-family: 'Roboto'; font-weight: bold;">Thank you for taking part in Cupid's Arrow!<br>We can't wait to show you what is coming... #March2020</h3></center>
</div>
</main>
<script>

function copyLink() {
/* Get the text field */
var copyText = document.getElementById("shareLink");

/* Select the text field */
copyText.select();
copyText.setSelectionRange(0, 99999); /*For mobile devices*/

/* Copy the text inside the text field */
document.execCommand("copy");

/* Alert the copied text */
document.getElementById("copiedLink").innerHTML = 'Copied!';
setTimeout(function() {
  document.getElementById("copiedLink").innerHTML = '';
},2000);
}

var q1 = document.getElementById('q1');
var q1Chart = new Chart(q1, {
  type: 'pie',
  data: {
      labels: ['Pancakes/Waffles', 'Eggs', 'Just a Coffee', 'Pizza from Last Night', 'Skipping Breakfast'],
      datasets: [{
          label: 'The Breakfast of Champions is...',
          data: [204, 102, 63, 62, 66],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      title: {
        display: true,
        text: 'The Breakfast of Champions is...'
      }
  }
});
var q2 = document.getElementById('q2');
var q2Chart = new Chart(q2, {
  type: 'bar',
  data: {
      labels: ['Lobby', 'SLC 2', 'SLC 3', 'SLC 4', 'SLC 5', 'SLC 6', 'SLC 7', 'SLC 8'],
      datasets: [{
          label: 'The Best SLC Floor is...',
          data: [35, 7, 2, 13, 66, 129, 69, 176],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(198, 88, 55, 0.2)',
              'rgba(22, 175, 166, 0.2)',
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(198, 88, 55, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
});
var q3 = document.getElementById('q3');
var q3Chart = new Chart(q3, {
  type: 'horizontalBar',
  data: {
      labels: ['Yes', 'No'],
      datasets: [{
          label: 'Would you take an SLC elevator up 1 floor?',
          data: [109, 388],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          xAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
});
var q5 = document.getElementById('q5');
var q5Chart = new Chart(q5, {
  type: 'doughnut',
  data: {
      labels: ['Who Cares', 'Assignment has to wait!'],
      datasets: [{
          label: 'Your assignment is due tomorrow at midnight, but The Bachelor is on tonight at 8.',
          data: [419, 78],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
      }]
  },
  options: {
      title: {
        display: true,
        text: 'Your assignment is due tomorrow at midnight, but The Bachelor is on tonight at 8.'
      }
  }
});
var q11 = document.getElementById('q11');
var q11Chart = new Chart(q11, {
  type: 'bar',
  data: {
      labels: ['Netflix and Chill', 'Disney Plus and Thrust', '"I had a great time, talk soon!"', 'Planning the next date'],
      datasets: [{
          label: 'You had a first date and had a great time, what are you doing now?',
          data: [95, 54, 100, 248],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
});
</script>
<? } ?>
<div style="position: relative; height: 150px; width: 100%; background-color: #ff1e73">
  <span class="footerText">RU MINE</span>
  <span class="smallFooterText">#March2020</span>
  <span style="position: absolute; bottom: 0; color: white; font-size: 12px; ">&copy; RU Mine 2020. RU Mine is not affiliated with Ryerson University.<br>This web application uses cookies. By using this website you are in agreement with our <a style="color: white;" href="https://kilostudios.com/privacy">cookies policy.</a></span>
</div>
</body>
</html>
<?
}
?>
