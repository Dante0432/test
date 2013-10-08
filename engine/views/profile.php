<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width = device-width, initial-scale=1, maximum-scale=1"/>
        <?php
            //Incluye los CSS
            Router::css("general","jquery-ui","profile");
            //Incluye los scripts de JS
            Router::js("basic");
            //Incluye los parámetros de la aplicación para ser leídos desde JS
            Maqinato::configInHtml();
            //$user=  SocialController::getUser($email);
            $user=AccessController::getSessionUser();
        ?>
        <title><?php echo _("Main")." | ".ucfirst(Maqinato::application()); ?></title>
        <script type="text/javascript">
            $(document).ready(function(){
                //Script que controla la inicialización de todo el sistema
                window.maqinato=new Maqinato();
                maqinato.init();
              });
        </script>
    </head>
    <body>
        <section id="main" class="container">
            <?php Router::import("templates/header.php"); ?>
            <section class="content">
                <div id="userData" class="circular">
                    <div id="userImage" class="circular">
                        <img src="<?php echo  Maqinato::img("users/1.jpg");?>" id="principalPhoto" class="circular"/>
                        <!--aca va el condicional cuando no sea mi perfil-->
                        <img src="<?php echo  Maqinato::img("icons/camera.png");?>" id="uploadImage" />
                        <p><?php echo _("Click to upload your picture.")?></p>
                    </div>
                </div>    
                <div id="userInfo">
                    <p id="nameUser"><?php echo $user->name();?></p>
                </div>
                
               <div id="share">
                   <input id="shareInput" type="text" placeholder="<?php echo _("Share your history or state here.")?>" />
                   <div id="shareButton" class="buttonBlack"><?php echo _("Share")?></div>
               </div>
                <div id="wall">
                    <div class="notice" id="123123">
                        <img src="<?php echo Maqinato::img("users/1_img_usr.jpg");?>" />
                    </div>
                </div>    
            </section>
            <?php Router::import("templates/footer.php"); ?>
        </section>
    </body>
</html>