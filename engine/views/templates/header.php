<?php
/** Header File
 * @package web @subpackage templates */
/**
 * Header template
 * 
 * @author https://github.com/maparrar/maqinato
 * @package views
 * @subpackage templates
 */
//Verifica si hay usuario registrado, sino, elimina la sesión y vuelve al root
if(!Maqinato::user()){
    Router::redirect("accesing"); 
}
$user=AccessController::getSessionUser();
?>
<header>

     <h1 class="logo"><a href="<?php echo Router::path('root'); ?>"><?php echo Maqinato::application(); ?></a></h1>
     <a href="<?php echo Router::path('root').'profile'; ?>"><p id="userName"><?php echo $user->name();?></p></a>
     <div id="links">
         <a href="<?php echo Router::path('root'); ?>">
            <img src="<?php echo Maqinato::img("icons/news.png");?>" id="news"/>
        </a>
         <img src="<?php echo Maqinato::img("icons/salirico.png");?>" id="logout" title="<?php echo _("logout")?>"/>
     </div>
</header>