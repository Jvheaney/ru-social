<?php
$ipadd = $_SERVER['REMOTE_ADDR'];
if($ipadd == gethostbyname("")){

  $ENDPOINT = "https://127.0.0.1:{port}/{endpoint}";

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_URL, $ENDPOINT);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
  $result = curl_exec($ch);

  ?>

  <html>
    <style>
    #t01 tr:nth-child(even) {
      background-color: #eee;
    }
    #t01 tr:nth-child(odd) {
      background-color: #fff;
    }
    </style>
    <body>
      <h1>Data</h1>
      <div>
        <table id="t01">
          <tr>
            <th>
              Day
            </th>
            <th>
              New Users
            </th>
            <th>
              New Friend Profiles
            </th>
            <th>
              New Dating Profiles
            </th>
            <th>
              Total Active Users
            </th>
            <th>
              Active Friends
            </th>
            <th>
              Active Dating
            </th>
            <th>
              Personal Messages Sent
            </th>
            <th>
              Group Messages Sent
            </th>
            <th>
              Groups Created
            </th>
            <th>
              Posts Created
            </th>
            <th>
              Comments Created
            </th>
            <th>
              Dating Swipes
            </th>
            <th>
              Friend Swipes
            </th>
            <th>
              Deleted Accounts
            </th>
            <th>
              Total Friend Requests
            </th>
            <th>
              Total Friends
            </th>
          </tr>
          <tbody id="data-place">
          </tbody>
        </table>
      </div>
    </body>
    <script>
    var data = JSON.parse(<?php echo json_encode($result); ?>);
    for(var i=0; i<data.length; i++){
      var row_to_append = `<tr>
        <td>${data[i].query_date}</td>
        <td>${data[i].new_users}</td>
        <td>${data[i].new_friend_profiles}</td>
        <td>${data[i].new_dating_profiles}</td>
        <td>${data[i].active_users_total}</td>
        <td>${data[i].active_dating_users}</td>
        <td>${data[i].active_friend_users}</td>
        <td>${data[i].messages_sent_personal}</td>
        <td>${data[i].messages_sent_group}</td>
        <td>${data[i].groups_created}</td>
        <td>${data[i].posts_created}</td>
        <td>${data[i].comments_created}</td>
        <td>${data[i].dating_swipes}</td>
        <td>${data[i].friend_swipes}</td>
        <td>${data[i].deleted_accounts}</td>
        <td>${data[i].total_friend_requests}</td>
        <td>${data[i].total_friends}</td>
      </tr>`
      document.getElementById("data-place").innerHTML += row_to_append;
    }
    </script>
  </html>
  <?php
}
else{
  http_response_code(404);
  die();
}
?>
