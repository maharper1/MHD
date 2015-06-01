<?php
  header("Content-type: text/xml\n\n");
  //$zwsid = "";
  //$host = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=" . $zwsid;
  $url = $_SERVER['QUERY_STRING'];
  $ch = curl_init($url); //($host . "&" . $url)
  curl_exec($ch);
  curl_close($ch);
?>