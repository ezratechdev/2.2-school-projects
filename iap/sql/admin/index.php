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
        <div class="user-bar">
            <div>
                <p>Hi <span class="user-name-span">admin..</span></p>
            </div>
            <div class="toggle">
                <a href="./routes/admin.html">Dashboard</a>
            </div>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Search Equipment">
        </div>
        <div class="equipments-list">
            <p class="title">Equipments Return list</p>
            <ul>
                <!-- li -->
                <li>
                    <div class="li-mainer">
                        <div>
                            <span class="equipment-name">Equipment id(Student registration) </span>
                            <span class="not-available">Overdue:penalize</span>
                        </div>
                        <div style="align-items:center">
                            <button class="book-btn">Penalize</button>
                        </div>
                    </div>
                </li>
                <!-- li -->
                <!-- li -->
                <li>
                    <div class="li-mainer">
                        <div>
                            <span class="equipment-name">Equipment id(Student registration) </span>
                            <span class="is-available">On time:confirm</span>
                        </div>
                        <div style="align-items:center">
                            <button class="book-btn">Confirm</button>
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