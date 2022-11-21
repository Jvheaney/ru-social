<?php
header('Location: https://rumine.ca/app');
exit();
include '../localArguments.php';
$getTotal_p = pg_prepare($con, "getTotal", "SELECT COUNT(*) FROM signups");
$getTotal_e = pg_execute($con, "getTotal", array());
$total = pg_fetch_row($getTotal_e);
$total = $total[0];
session_start();
$tokCheck='';
$_SESSION['tokCheck'] = microtime();
if (defined("CRYPT_BLOWFISH") && CRYPT_BLOWFISH) {
    $salt = '$ewjjjekpi$' . substr(md5(uniqid(mt_rand(), true)), 0, 22);
    $tokCheck = crypt($_SESSION['tokCheck'], $salt);
}
?>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="The free dating app for Ryerson students, by Ryerson students.">
    <meta name="keywords" content="RU, Mine, Ryerson, University, Students, dating, app">
    <title>RU Mine</title>
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicons/favicon-16x16.png">
    <link rel="manifest" href="assets/images/favicons/site.webmanifest">

    <!-- plugin scripts -->
    <link href="https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/animate.min.css">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/owl.carousel.min.css">
    <link rel="stylesheet" href="assets/css/owl.theme.default.min.css">
    <link rel="stylesheet" href="assets/css/magnific-popup.css">
    <link rel="stylesheet" href="assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/swiper.min.css">
    <link rel="stylesheet" href="assets/plugins/dimon-icons/style.css">

    <!-- template styles -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/responsive.css">

<style>
#cf-context {
  width: 100%;
  height: 50vh;
}
</style>
</head>

<body>
    <div class="preloader">
        <img src="assets/images/resources/preloader.png" class="preloader__image" alt="">
    </div><!-- /.preloader -->
    <div class="page-wrapper">
        <header class="site-header site-header__header-one ">
            <nav style="height: 100px;" class="navbar navbar-expand-lg navbar-light header-navigation stricky">
                <div class="container clearfix">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="logo-box clearfix">
                        <a class="navbar-brand" href="#banner">
                            <img src="assets/images/resources/logo-dark.png" class="main-logo" width="119" alt="Awesome Image" />
                        </a>
                    </div><!-- /.logo-box -->
                </div>
                <!-- /.container -->
            </nav>
        </header><!-- /.site-header -->
        <section class="banner-one" id="banner">
            <span class="banner-one__shape-1"></span>
            <span class="banner-one__shape-2"></span>
            <span class="banner-one__shape-3"></span>
            <span class="banner-one__shape-4"></span>
            <div class="container">
                <div class="banner-one__moc">
                    <img src="assets/images/mocs/banner-moc-1-1.png" alt="Awesome Image" />
                </div><!-- /.banner-one__moc -->
                <div class="row">
                    <div class="col-xl-6 col-lg-8">
                        <div class="banner-one__content">

                            <h3 class="banner-one__title">Find your <br> <span>Ryerson Love.</span></h3><!-- /.banner-one__title -->
                            <p class="banner-one__text">Meet the many great students that go to Ryerson in this exclusive dating app <b>for</b> Ryerson Students, <b>by</b> Ryerson Students.</p>
                            <!-- /.banner-one__text -->
                            <a href="#interest" class="banner-one__btn thm-btn "><span>I'm interested!</span></a><!-- /.thm-btn -->
                            <a href="https://rumine.ca/vday" class="banner-one__btn thm-btn "><span>V-Day Surprise</span></a><!-- /.thm-btn -->
                        </div><!-- /.banner-one__content -->
                    </div><!-- /.col-lg-6 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.banner-one -->
        <section class="service-one" id="features">
            <div class="container">
                <div class="block-title text-center">
                    <h2 class="block-title__title">How <span>RU Mine</span> is different.</h2><!-- /.block-title__title -->
                </div><!-- /.block-title -->
                <div class="row">
                    <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
                        <div class="service-one__single text-center">
                            <div class="service-one__inner">
                                <i class="service-one__icon dimon-icon-target"></i>
                                <h3>Ryerson <br> Only</h3>
                                <p>All users will require a Ryerson email to signup for the service.</p>
                            </div><!-- /.service-one__inner -->
                        </div><!-- /.service-one__single -->
                    </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
                    <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInDown" data-wow-duration="1500ms">
                        <div class="service-one__single text-center">
                            <div class="service-one__inner">
                                <i class="service-one__icon dimon-icon-visualization"></i>
                                <h3>All <br> Inclusive</h3>
                                <p>Everyone that goes to Ryerson is welcome to look for love!</p>
                            </div><!-- /.service-one__inner -->
                        </div><!-- /.service-one__single -->
                    </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
                    <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
                        <div class="service-one__single text-center">
                            <div class="service-one__inner">
                                <i class="service-one__icon dimon-icon-data"></i>
                                <h3>Program<br> Information</h3>
                                <p>Know what program others are in, and meet people across programs.</p>
                            </div><!-- /.service-one__inner -->
                        </div><!-- /.service-one__single -->
                    </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
                    <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInDown" data-wow-duration="1500ms">
                        <div class="service-one__single text-center">
                            <div class="service-one__inner">
                                <i class="service-one__icon dimon-icon-data1"></i>
                                <h3>Protect your <br> Privacy</h3>
                                <p>We are just students, not a massive corporation selling your data.</p>
                            </div><!-- /.service-one__inner -->
                        </div><!-- /.service-one__single -->
                    </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.service-one -->
        <section class="pricing-one" id="interest">
            <div class="container">
                <div class="block-title text-center">
                    <h2 class="block-title__title"><span>Interested?</span><br> Join the <span id="numberPlace"><? echo $total; ?></span> Ryerson students who are too!</h2><!-- /.block-title__title -->
                </div><!-- /.block-title -->
                <form id="form" cf-form>
                  <cf-robot-message cf-questions="Answer a few questions so we can get in touch with you!"></cf-robot-message>
                  <input id="email_input" maxlength="320" style="position: absolute; bottom: -200vh;" type="email" name="email" error="That's not an email." cf-questions="What is your email?">
                  <input id="gender_input" maxlength="255" style="position: absolute; bottom: -200vh;" type="text" name="gender" cf-questions="What is your gender?">
                  <input id="program_input" maxlength="255" style="position: absolute; bottom: -200vh;" type="text" name="program" cf-questions="What program are you in?">
                    <input cf-questions="What year are you in?" style="position: absolute; bottom: -200vh;" id="year_input_1" type="radio" name="year" cf-label="1st Year" />
                    <input style="position: absolute; bottom: -200vh;" id="year_input_2" type="radio" name="year" cf-label="2nd Year" />
                    <input style="position: absolute; bottom: -200vh;" id="year_input_3" type="radio" name="year" cf-label="3rd Year" />
                    <input style="position: absolute; bottom: -200vh;" id="year_input_4" type="radio" name="year" cf-label="4th+ Year" />
                </form>
                <div id="cf-context" role="cf-context" cf-context style="z-index: 0;"></div>
            </div><!-- /.container -->
        </section><!-- /.pricing-one -->
        <section class="faq-one">
            <div class="container">
                <div class="block-title text-center">
                    <h2 class="block-title__title">Frequently asked questions</h2><!-- /.block-title__title -->
                </div><!-- /.block-title -->
                <div class="accrodion-grp" data-grp-name="faq-accrodion">
                    <div class="accrodion active wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="0ms">
                        <div class="accrodion-inner">
                            <div class="accrodion-title">
                                <h4>When will RU Mine be out?</h4>
                            </div>
                            <div class="accrodion-content">
                                <div class="inner">
                                    <p>Soon 🙏 We are hoping to have the beta out by the beginning of March and an official version for Fall 2020 Semester.</p>
                                </div><!-- /.inner -->
                            </div>
                        </div><!-- /.accrodion-inner -->
                    </div>
                    <div class="accrodion  wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="100ms">
                        <div class="accrodion-inner">
                            <div class="accrodion-title">
                                <h4>What is the difference between RU Mine and other dating apps?</h4>
                            </div>
                            <div class="accrodion-content">
                                <div class="inner">
                                    <p>1. First of all, RU mine will always be free. No premiums or Gold like how some other dating apps try to drain your pockets.</p>
                                    <p>2. Our goal is to help our fellow students find a significant other and then delete the app, whereas other dating apps want you to be sucked in to their platform forever.</p>
                                    <p>3. RU mine will only include verified Ryerson Student, so you won't have to swipe through those jerks at UofT (we're joking... mostly. #RyeHighForever). You will know what program others are in, and meet people across programs.</p>
                                    <p>4. RU Mine is privacy focused. We are just students, not a massive corporation selling your data.</p>
                                </div><!-- /.inner -->
                            </div>
                        </div><!-- /.accrodion-inner -->
                    </div>
                    <div class="accrodion wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="200ms">
                        <div class="accrodion-inner">
                            <div class="accrodion-title">
                                <h4>Do I have to pay to use RU Mine?</h4>
                            </div>
                            <div class="accrodion-content">
                                <div class="inner">
                                    <p>No, Never! RU Mine will forever be free as it is meant to be an inclusive dating space.</p>
                                </div><!-- /.inner -->
                            </div>
                        </div><!-- /.accrodion-inner -->
                    </div>
                    <div class="accrodion wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="300ms">
                        <div class="accrodion-inner">
                            <div class="accrodion-title">
                                <h4>What are the requirements to sign up?</h4>
                            </div>
                            <div class="accrodion-content">
                                <div class="inner">
                                    <p>1. The minimum age requirement for RU Mine is 18 years old. Additionally, you must also be a current Ryerson University Student with a valid Ryerson Email.</p>
                                    <p>2. Be single obviously. 🙄🙄🙄🙄</p>
                                </div><!-- /.inner -->
                            </div>
                        </div><!-- /.accrodion-inner -->
                    </div>
                </div>
            </div><!-- /.container -->
        </section><!-- /.faq-one -->
        <footer class="site-footer">
            <div class="site-footer__upper">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="footer-widget footer-widget__about">
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-lg-2 -->
                        <div class="col-lg-6 d-flex justify-content-between footer-widget__links-wrap">
                            <div class="footer-widget">
                            </div><!-- /.footer-widget -->
                            <div class="footer-widget" style="text-align: center;">
                              <img src="assets/images/resources/logo-dark.png" width="119" alt="" class="footer-widget__logo">
                              <p class="footer-widget__contact"><a href="mailto:ru.mine2020@gmail.com">ru.mine2020@gmail.com</a><p>
                              <p class="footer-widget__contact"><a href="https://instagram.com/ru_minee">@RU_Minee</a><p>
                            </div><!-- /.footer-widget -->
                            <div class="footer-widget">
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-lg-6 -->
                        <div class="col-lg-3">
                        </div><!-- /.col-lg-4 -->
                    </div><!-- /.row -->
                </div><!-- /.container -->
            </div><!-- /.site-footer__upper -->
            <div class="site-footer__bottom">
                <div class="container">
                    <div class="inner-container text-center">
                        <p class="site-footer__copy">&copy; RU Mine 2020. RU Mine is not affiliated with Ryerson University.</p>
                        <!-- /.site-footer__copy -->
                    </div><!-- /.inner-container -->
                </div><!-- /.container -->
            </div><!-- /.site-footer__bottom -->
        </footer><!-- /.site-footer -->
    </div><!-- /.page-wrapper -->


    <a href="#" data-target="html" class="scroll-to-target scroll-to-top"><i class="fa fa-angle-up"></i></a>


    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/owl.carousel.min.js"></script>
    <script src="assets/js/waypoints.min.js"></script>
    <script src="assets/js/jquery.counterup.min.js"></script>
    <script src="assets/js/TweenMax.min.js"></script>
    <script src="assets/js/wow.js"></script>
    <script src="assets/js/jquery.magnific-popup.min.js"></script>
    <script src="assets/js/jquery.ajaxchimp.min.js"></script>
    <script src="assets/js/swiper.min.js"></script>
    <script src="assets/js/jquery.easing.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/space10-community/conversational-form@latest/dist/conversational-form.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <!-- template scripts -->
    <script src="assets/js/theme.js"></script>
<script>
window.onload = function() {

  var totalSignups = <? echo $total; ?>;

  var conversationalForm = window.cf.ConversationalForm.startTheConversation({
    formEl: document.getElementById("form"),
    context: document.getElementById("cf-context"),
    theme: "red",
    preventAutoFocus: true,
    robotImage: "https://rumine.ca/assets/images/chatbot.png",
    submitCallback: function() {
     conversationalForm.addRobotChatResponse("Thanks, we'll be in touch once RU Mine is ready to launch!");
     setTimeout(function() {
       conversationalForm.addRobotChatResponse("Stay up-to-date with RU Mine by following our Instagram @RU_Minee");
     },500);
     var uploaderForm = new FormData();
     uploaderForm.append("email", $("#email_input").val());
     uploaderForm.append("gender", $("#gender_input").val());
     uploaderForm.append("program", $("#program_input").val());
     if (document.getElementById('year_input_1').checked) {
        uploaderForm.append("year", "1");
     }
     else if (document.getElementById('year_input_2').checked) {
        uploaderForm.append("year", "2");
     }
     else if (document.getElementById('year_input_3').checked) {
        uploaderForm.append("year", "3");
     }
     else if (document.getElementById('year_input_4').checked) {
        uploaderForm.append("year", "4");
     }
     uploaderForm.append("tokPass", "<? echo $tokCheck; ?>");
     $.ajax({
     url:"./addSignup.php",
     type: "POST",
     data: uploaderForm,
     processData: false,
     contentType: false,
     success:function(data)
     {
       if(data == "success"){
         $("#numberPlace").empty();
         $("#numberPlace").append(totalSignups + 1);
       }
     },
     error:function(data){
       console.log(data);
     }
   });
    }
  });
};
</script>
</body>

</html>
