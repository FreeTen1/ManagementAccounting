<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Система</title>
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="./.fonts/font.css">
</head>
<body style="min-width: 500px; min-height: 200px">

    <header class="flex w-full h-[6%] bg-[#212429] items-center justify-between">
        <div class="flex w-[45%] justify-between items-center">
            <p style="min-width: 280px;" class="text-[#DEE2E6] w-[38%] overflow-clip">Система</p>
            <div class="flex gap-6"> 

            </div>
        </div>

        <div class="flex gap-6 items-center">

        </div>

        <div class="hidden items-end absolute top-0 right-0 h-[140px] w-[585px] z-10 cursor-pointer" id="dropdown_info_header">

        </div>
    </header>

    <div class="flex w-full h-[94%] items-center justify-center">
        <form class="flex flex-col w-[406px] h-[250px] justify-between items-center text-[#6C757E]" action="" method="post">
            <p>ВХОД В СИСТЕМУ</p>
            <div class="flex w-full h-10">
                <label class="flex w-full">
                    <div class="flex w-[10%] h-full cursor-pointer bg-[#E3E3E3] rounded-l-md items-center justify-center border-[#0000001A] border-[1px]"><img class="w-[25px] h-[25px]" src="./img/login.svg" alt="login"></div>
                    <input class="w-[90%] rounded-r-md border-[#0000001A] border-[1px] px-3" name="login" type="text" required>
                </label>
            </div>
            <div class="flex w-full h-10">
                <label class="flex w-full">
                    <div class="flex w-[10%] h-full cursor-pointer bg-[#E3E3E3] rounded-l-md items-center justify-center border-[#0000001A] border-[1px]"><img class="w-[25px] h-[25px]" src="./img/key.svg" alt="login"></div>
                    <input class="w-[90%] rounded-r-md border-[#0000001A] border-[1px] px-3" name="password" type="password" required>
                </label>
            </div>
            <div class="flex w-full justify-center">
            <label class="flex justify-center gap-2 items-center cursor-pointer"><input class="w-5 h-5 rounded-md" type="checkbox">запомнить меня</label>
            </div>
            <input class="button w-full h-[35px]" type="submit" value="Войти">
        </form>
    </div>

    <script src="../js/effects.js"></script>
    <script src="../js/general_functions.js"></script>
    <script src="../js/connect.js"></script>
    <script src="../js/header.js"></script>

    <!-- for charts -->
<?php
    $session = $_COOKIE["session"];
    if ($session) {
        $strHeader = get_headers('http://'.$_SERVER["HTTP_HOST"].'/manage_acc/auth?session='.$session)[0];
        $statusCode = substr($strHeader, 9, 3);
        if ($statusCode == 401 || $statusCode == 503) {
            
        } else {
            header('Location: ../');
        }
    }

    if (isset($_POST["login"]) && isset($_POST["password"])) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'http://'.$_SERVER["HTTP_HOST"].'/manage_acc/auth',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
            "login": "'.$_POST["login"].'",
            "password": "'.md5($_POST["password"]).'"
        }',
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        $response = json_decode($response);

        $session = $response->session;
        $fio = $response->fio;
        $role = $response->role;
        
        if (!$session) {
            if ($response->message) {
                echo '<script>errorWin("'.$response->message.'")</script>';
            } else {
                echo '<script>errorWin("Нет соединения с сервером")</script>';
            }
        } else {
            setcookie("session", $session, time()+60*60*24*365*10, "/");
            setcookie("fio", $fio, time()+60*60*24*365*10, "/");
            setcookie("role", $role, time()+60*60*24*365*10, "/");
            header('Location: ../');
        }
    }
?>
</body>
</html>