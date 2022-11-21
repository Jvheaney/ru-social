<?php
  include '../../localArguments.php';
  $match_ins_p = pg_prepare($con, "match_ins", "INSERT INTO analytics (type, time, event) VALUES ($1, $2, $3)");
  $match_ins_e = pg_execute($con, "match_ins", array('redirect','now()','vday-playlist'));
  header('Location: https://open.spotify.com/playlist/5tr2KncGK2neVB61Rt4UU8?si=w05SH8yJRLaGOZp9zQzPCw');
?>
