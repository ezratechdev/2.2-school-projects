<?php
$mysqli = new mysqli('localhost', 'root', '', 'GIS');
if (!$mysqli){
    echo "Connection Error ," . mysqli_connect_error();
} else null;
?>
