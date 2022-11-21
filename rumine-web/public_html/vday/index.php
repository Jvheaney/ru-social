<?php
$tokCheck='';
if(time() < 1581451200){
/*session_start();
if(isset($_SESSION['userid'])){
  $_SESSION['tokCheck'] = microtime();
  if (defined("CRYPT_BLOWFISH") && CRYPT_BLOWFISH) {
      $salt = '$ewjjjekpi$' . substr(md5(uniqid(mt_rand(), true)), 0, 22);
      $tokCheck = crypt($_SESSION['tokCheck'], $salt);
  }*/
  //if(isset($_SESSION['submitted'])){
    setcookie("submitted", 'qa', time() + (86400 * 30), "/");
  //}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/vday/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="RU Mine's Cupid's Arrow - Valentine's Day Special"/>    <meta name="keywords" content="RU, Mine, RU Mine, ryerson, university, dating, community">
<link rel="apple-touch-icon" href="/vday/logo192.png"/><link rel="manifest" href="/vday/manifest.json"/><title>RU Mine Cupid's Arrow</title><link href="/vday/static/css/main.a28a4ed0.chunk.css" rel="stylesheet">  <!-- Global site tag (gtag.js) - Google Analytics -->
</head><body background="/vday/bkgc.jpg"><noscript>You need to enable JavaScript to run this app.</noscript><div style="position:relative;height:150px;width:100%;background-color:#fff"><span class="topText"><font color="#ff1e73">valentine's day</font></span> <span class="bottomText"><font color="#ff1e73">Cupid's Arrow</font><img class="cupid-logo" src="/vday/ArrrowC.png"/></span><div style="position:absolute;right:0"><a href="https://rumine.ca"><img style="width:247px;height:93px" src="/vday/LOGOS.png"/></a></div></div><div class="container" style="min-height: 100%; height: auto;" id="root"></div><div style="position:relative;height:150px;width:100%;background-color:#ff1e73"><span class="footerText">RU MINE</span> <span class="smallFooterText">#March2020</span> <span style="position:absolute;bottom:0;color:#fff;font-size:12px">&copy; RU Mine 2020. RU Mine is not affiliated with Ryerson University.<br>This web application uses cookies. By using this website you are in agreement with our <a style="color: white;" href="https://kilostudios.com/privacy">cookies policy.</a></span></div><script>window.tokPass="<? echo $tokCheck; ?>"</script><script>!function(a){function e(e){for(var r,t,n=e[0],o=e[1],u=e[2],i=0,l=[];i<n.length;i++)t=n[i],Object.prototype.hasOwnProperty.call(p,t)&&p[t]&&l.push(p[t][0]),p[t]=0;for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(a[r]=o[r]);for(s&&s(e);l.length;)l.shift()();return c.push.apply(c,u||[]),f()}function f(){for(var e,r=0;r<c.length;r++){for(var t=c[r],n=!0,o=1;o<t.length;o++){var u=t[o];0!==p[u]&&(n=!1)}n&&(c.splice(r--,1),e=i(i.s=t[0]))}return e}var t={},p={1:0},c=[];function i(e){if(t[e])return t[e].exports;var r=t[e]={i:e,l:!1,exports:{}};return a[e].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=a,i.c=t,i.d=function(e,r,t){i.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(r,e){if(1&e&&(r=i(r)),8&e)return r;if(4&e&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&e&&"string"!=typeof r)for(var n in r)i.d(t,n,function(e){return r[e]}.bind(null,n));return t},i.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(r,"a",r),r},i.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},i.p="/vday/";var r=this.webpackJsonprumine=this.webpackJsonprumine||[],n=r.push.bind(r);r.push=e,r=r.slice();for(var o=0;o<r.length;o++)e(r[o]);var s=n;f()}([])</script><script src="/vday/static/js/2.d33f4059.chunk.js"></script><script src="/vday/static/js/main.15a1f189.chunk.js"></script></body></html>
<?
}
else if(time() > 1581526799){
  header('Location: ./signin.php');
}
else {
   header('Location: ./thanks.php');
}
?>
