
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"  isELIgnored="false" %>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>登陆</title>

    <!-- Bootstrap core CSS -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">

    <script src="/js/jquery-3.6.0.min.js" rel="script"></script>

    <style>
        .bd-placeholder-img {
            font-size: 1.125rem;
            text-anchor: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        @media (min-width: 768px) {
            .bd-placeholder-img-lg {
                font-size: 3.5rem;
            }
        }
    </style>
    <link href="/css/signin.css" rel="stylesheet">
</head>
<body class="text-center">
<form class="form-signin" action="${pageContext.request.contextPath}/user/loginVerify" method="post">
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>

    <label for="inputEmail" class="sr-only">Email address</label>
    <input name="username"  id="inputEmail" class="form-control" placeholder="Email address" required autofocus>

    <label  for="inputPassword" class="sr-only">Password</label>
    <input name="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>


    <div class="checkbox mb-3">
        <label>
            <input type="checkbox" value="remember-me"> Remember me
        </label>
    </div>

    <button id="login" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

    <p class="mt-5 mb-3 text-muted">&copy; 2020-2022</p>
</form>

<script rel="script">

</script>

</body>

</html>