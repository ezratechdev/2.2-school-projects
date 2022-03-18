<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <link rel="stylesheet" href="../css/user.css">
</head>
<body>
    <div class="main">
        <div class="user-bar">
            <div>
                <p>Hi <span class="user-name-span">user..</span></p>
            </div>
            <div class="toggle">
                <a href="#">Logout</a>
            </div>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Search Equipment">
        </div>
        <div class="equipments-list">
            <p class="title">Borrowed Equipments</p>
            <ul>
                <!-- li -->
                <li>
                    <div class="li-mainer">
                        <div>
                            <span class="equipment-name">Equipment name</span>
                            <span class="not-available">Overdue</span>
                        </div>
                        <div style="align-items:center">
                            <button class="book-btn">Return</button>
                        </div>
                    </div>
                </li>
                <!-- li -->
                <!-- li -->
                <li>
                    <div class="li-mainer">
                        <div>
                            <span class="equipment-name">Equipment name</span>
                            <span class="is-available">14 days to return</span>
                        </div>
                        <div style="align-items:center">
                            <button class="book-btn">Extend</button>
                        </div>
                    </div>
                </li>
                <!-- li -->
            </ul>
        </div>
    </div>
    <script src="../js/user.js"></script>
</body>
</html>