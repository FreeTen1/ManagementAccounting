<?php
setcookie("session", $session, time()-5, "/");
setcookie("fio", $fio, time()-5, "/");
setcookie("role", $role, time()-5, "/");
header('Location: ./auth');
?>