<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../css/auth.css">
    <title>Login</title>
</head>

<body>
    <div class="main">
            <form action="./server/data.php" method="post" target="_blank">
                <input type="text" name="AuthNumber" placeholder="Auth Number" required> <br>
                <input type="email" name="adminEmail" placeholder="Email" required> <br>
                <input type="password" name="adminPasword" placeholder="*******"> <br>
                <input type="submit" value="Login">
            </form>
            <div class="link">
                Got an account? <a href="./login.html">Login</a>
            </div>
    </div>
    <script src="../js/auth.js"></script>
</body>

</html>