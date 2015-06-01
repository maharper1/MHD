<?php
    if(empty($_GET['url']))
    {
        echo 'ERROR:  No url provided';
    }
    else
    {
         header ("Content-Type:text/xml");
         $url = stripslashes($_GET['url']);
         echo $url;

        $str = @file_get_contents($url);
        echo $str;
    }

?>