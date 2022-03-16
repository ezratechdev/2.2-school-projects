<?php

include('./sqlconnect.php');
if(isset($_POST['submit'])){
    $text = $_POST['text'];
    $post = $mysqli_query($connector,"insert into text(text) value('$text')");
    if($post){
        echo "yayy";
    } else echo "Noo";
}
?>