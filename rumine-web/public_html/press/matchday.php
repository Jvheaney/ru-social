<?php
//$ipadd = $_SERVER['REMOTE_ADDR'];
?>
<!DOCTYPE html>
<html lang="en">

<head>

    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png">
    <link rel="manifest" href="./site.webmanifest">

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Press Releases and Information Regarding RU Mine">
    <meta name="keywords" content="RU, Mine, RU Mine, mine, ru, ryerson, university, ryerson university, dating, match, making, cupid">
    <meta name="author" content="Kilo Studios, Inc.">

    <title>Press@RU Mine</title>

    <!-- Bootstrap Core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Theme CSS -->
    <link href="css/clean-blog.min.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body>

    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    Menu <i class="fa fa-bars"></i>
                </button>
                <a href="https://rumine.ca/press" class="navbar-brand" href="">RU Mine</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="https://rumine.ca">Home Page</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <!-- Page Header -->
    <!-- Set your background image for this header on the line below. -->
    <header class="intro-header" style="background-image: url('img/matchday.jpg');">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="post-heading">
                        <h1>Match Day</h1>
                        <h2 class="subheading">Your Cupid's Arrow Matches are Released!</h2>
                        <span class="meta">Posted on February 12, 2020</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Post Content -->
    <article>
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                  <h3>Happy Match Day!</h3>

<p><a href=“https://rumine.ca/vday/signin.php”>Cupid’s Arrow results got released today</a>, make sure to take a look at your lucky matches! This post is going to be talking about the thought process for matching and our algorithm.</p>

<h3>The Thought Process</h3>

<p>Matching on a scale like this is very interesting, but also a very complex process to facilitate. For the most part, the matching of the main 15 personality questions was very easy; we knew exactly how to do that. The (welcomed) challenge would come from making this entire application as inclusive as possible.</p>

<p>As many of our users know, our goal has always been to make RU Mine as inclusive as possible. We have reached out to our community to advise and help us develop an appropriate solution to the problem seen in so many other dating apps. With the information we gathered from you, our community, we introduced the first “beta” test to our methodology with Cupid’s Arrow.</p>

<p>As many of you know, we requested that users select one gender that they most closely identify with: Male, Female, Non-Binary, Transgender, Transgender Male, Transgender Female, or Other. Through the data we received, a total sample size of ~500 submissions, we found that there were no users that selected “Other” as their gender. This tells us that we are on the right track with the inclusion of the other genders, and that most users feel comfortable with identifying as one of those options. We will continue to include the “Other” option in RU Mine and we are looking forward to the day that it is clicked to better learn how to improve our inclusivity. </p>

<p>We also asked users to select which gender(s) they’re interested in: Male, Female, Non-Binary, Transgender, or Other. We opted to not include options for Transgender Male and Transgender Female because, through our community outreach and preliminary research, we found that these are usually fetishized. Our intention is to <b>never</b> allow purpose-driven fetishization of our users. This lead us to make the decision to only allow Transgender as an option. This means that users who selected Transgender, Transgender Male, and Transgender Female would all be possible matches. From our feedback and limited dataset, it seems like this was an appropriate decision.</p>

<p>If you feel that you would’ve selected another gender that wasn’t available, wish to discuss more about our “Other” option or our Transgender matching process, please send us an email at <a href="mailto:ru.mine2020@gmail.com">ru.mine2020@gmail.com</a>.</p>

<h3>Our Algorithm</h3>

<p>Our algorithm was a very fun element of Cupid’s Arrow to develop. This will not be the same algorithm that is deployed into the official RU Mine app, but a lot can be learned from the developmental process and later applied.</p>

<p>First, we selected the user and found all their compatible matches in our submissions data. This user was then run through a series of calculations comparing their answers against the potential match, scoring each question with a decimal value between 0 and 1 depending on similarity. The resulting score reflects a number out of 15. This is the number that is used to select the top 5-10 matches.</p>

<p>The individuals presented to you as the top 5-10 matches are your matches. This means that your list may not necessarily reflect their list. This is due to the nature of the data, here’s an example:
<br><br>
User 1 is male interested in females.<br>
User 2 is a female interested in males and females.<br>
User 3 is a female interested in females.
<br><br>
In this limited example,<br>
User 1 is only compatible with User 2.<br>
User 2 is compatible with User 1 and User 3.
<br><br>
User 1 and User 2 may have a compatibility score of 12/15, which is the top for User 1, but is not the top for User 2; User 2 has a compatibility score of 13.5/15 with User 3. Therefore, the top 5 matches for each user will differ and reflect this.</p>

<h3>Thank you for participating in Cupid’s Arrow!</h3>
<h4 style="font-weight: normal;">Happy DMing!</h4>

                  </div>
            </div>
        </div>
    </article>

    <hr>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <!--<ul class="list-inline text-center">
                        <li>
                            <a href="#">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                    </ul>-->
                    <p class="copyright text-muted">Copyright &copy; RU Mine, subsidiary of Kilo Studios, Inc. <? echo date("Y");?></p>
                </div>
            </div>
        </div>
    </footer>

    <!-- jQuery -->
    <script src="vendor/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>

    <!-- Contact Form JavaScript -->
    <script src="js/jqBootstrapValidation.js"></script>
    <script src="js/contact_me.js"></script>

    <!-- Theme JavaScript -->
    <script src="js/clean-blog.min.js"></script>

</body>

</html>
<?
//}
?>
