<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width = device-width, initial-scale=1, maximum-scale=1"/>
        <?php
            //Incluye los CSS
            Router::css("general","jquery-ui","accessing");
            //Incluye los scripts de JS
            Router::js("basic","accessing");
            //Incluye los parámetros de la aplicación para ser leídos desde JS
            Maqinato::configInHtml();
        ?>
        <title><?php echo _("Accessing")." | ".ucfirst(Maqinato::application()); ?></title>
        <script type="text/javascript">
            $(document).ready(function(){
                //Script que controla la inicialización de todo el sistema
                window.maqinato=new Maqinato();
                maqinato.init();
                
                //Script propio de la página
                accessing=new Accessing();
                accessing.init({
                    signupForm:$("#signupForm"),
                    loginForm:$("#loginForm")
                });
              });
        </script>
    </head>
    <body>
        <section id="accessing" class="container">
            <?php Router::import("templates/accessHeader.php"); ?>
            <section class="content">
                <div id="signupForm">
                    <input id="sgn_name" type="text" placeholder="<?php echo _("Name");?>" />
                    <input id="sgn_lastname" type="text" placeholder="<?php echo _("Lastname"); ?>"/>
                    <input id="sgn_email" type="text" placeholder="<?php echo _("Email"); ?>"/>
                    <input id="sgn_password" type="password" placeholder="<?php echo _("Password"); ?>"/>
                    <input id="sgn_confirm" type="password" placeholder="<?php echo _("Confirm password"); ?>"/>
                    <div id="signup" class="buttonGreen"><?php echo _("Signup"); ?></div>
                    <div id="providers">
                        <div id="facebookLogin">Login with Facebook</div>
                    </div>
                </div>
                <div id="artistImage">
                    
                </div>    
            </section>
            <?php Router::import("templates/footer.php"); ?>
        </section>
    </body>
</html>