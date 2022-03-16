        <?php
        // include('./server/sqlconnect.php');
        $hostname = "localhost";
        $username = "root";
        $pass = "";
        $db = "GIS";
        $con = mysqli_connect($hostname, $username, $pass, $db);
        if (!$con) {
            echo "Connection Error ," . mysqli_connect_error();
        } else null;
        if (isset($_POST['submit'])) {
            $text = $_POST['text'];
            $post = mysqli_query($con, "insert into text(text) values('$text')");
            echo $text;
            if ($post) {
                echo "<script>Message has been added</script>";
            } else echo "<script>Message has been added</script>";
            
        } else echo null;

        ?>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="./css/index.css">
            <title>Main Page</title>
        </head>

        <body>
            <div class="main">

                <form action="index.php" target="_self" method="post">
                    <input type="text" name="text" placeholder="Text">
                    <input type="submit" name="submit" value="Send">
                </form>
                <div class="user-bar">
                    <div>
                        <p>Hi <span class="user-name-span">user..</span></p>
                    </div>
                    <div class="toggle">
                        <a href="./routes/user.html">Dashboard</a>
                    </div>
                </div>
                <div class="search-bar">
                    <input type="text" placeholder="Search Equipment">
                </div>
                <div class="equipments-list">
                    <p class="title">Equipments list</p>
                    <ul>
                        <!-- li -->
                        <li>
                            <div class="li-mainer">
                                <div>
                                    <span class="equipment-name">Equipment name</span>
                                    <span class="is-available">Is available</span>
                                </div>
                                <div style="align-items:center">
                                    <button class="book-btn">Book</button>
                                </div>
                            </div>
                        </li>
                        <!-- li -->
                        <!-- li -->
                        <li>
                            <div class="li-mainer">
                                <div>
                                    <span class="equipment-name">Equipment name</span>
                                    <span class="not-available">Is not available</span>
                                </div>
                                <div style="align-items:center">
                                    <button class="book-btn">Reserve</button>
                                </div>
                            </div>
                        </li>
                        <!-- li -->
                    </ul>
                </div>
            </div>
            <script src="./js/index.js"></script>
        </body>

        </html>