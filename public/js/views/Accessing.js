/**
 * Pseudoclass to manage the Accessing page
 **/
function Accessing(){
    "use strict";
    
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ATTRIBUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    var obj=this;
    obj.currentForm="login";
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> METHODS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    /**
     * Configure and init the systems Scripts 
     * @param {Object} parameters Objeto que contiene los parámetros del script
     **/
    obj.init=function(parameters){
        //Genera los eventos para los objetos del home
        obj.events(parameters);
        obj.initFacebook();
    };
    /**
     * Set the login, logout and signup events
     * @param {Object} parameters Objeto que contiene los parámetros del script
     **/
    obj.events=function(parameters){
        
        parameters.signupForm.find(".buttonGreen").click(function(){
            obj.signup(parameters.signupForm);
        });
        parameters.signupForm.find(".buttonGreen").click(function(){
            obj.signup(parameters.signupForm);
        });
       // parameters.signupForm.find("#facebookLogin").click(function(){
      //      maqinato.debug("holaa");
      //  });
        parameters.signupForm.find("input").click(function(){
            $(this).removeClass("errorPlaceholder");
        }).focus(function(){
            obj.currentForm="signup";
        });
        parameters.loginForm.find("input").click(function(){
            $(this).removeClass("errorPlaceholder");
        }).focus(function(){
            obj.currentForm="login";
        });
        parameters.loginForm.find("input").first().focus();
        //Cuando se hace click en enter
        $(document).keypress(function(e) {
            if(e.which===13) {
                if(obj.currentForm==="login"){
                    obj.login(parameters.loginForm);
                }else{
                    obj.signup(parameters.signupForm);
                }
            }
        });
    };
    /**
     * Clear the fields of a form
     * @param {Object} form Formulario para limpiar
     **/
    obj.formReset=function(form){
        form.find("input").val("");
        form.find("input").first().val("").focus();
    };
    /**
     *  Main method to signup, executed when the signup event is executed
     *  @param {Object} form Formulario de registro
     **/
    obj.signup=function(form){
        var fields=obj.signupValidate(form);
        if(fields){
            maqinato.ajax.signup(fields.email,fields.password,fields.name,fields.lastname,function(response){
                if(response==="exist"){
                    maqinato.dialog({
                        title:_("Correo ya existe"),
                        html:_("El correo ya está registrado, por favor intente de nuevo")
                    });
                }else if(response==="success"){
                    maqinato.redirect("main");
                }else{
                    maqinato.dialog({
                        title:_("Correo o contraseña erroneos"),
                        html:_("Por favor verifique los datos e intente de nuevo")
                    });
                }
            });
            obj.formReset(form);
        }
    };
 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FACEBOOK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
    obj.initFacebook=function(){
        maqinato.facebookEmailExist=false;
        //Indica si se intenta un nuevo registro con el botón de login
        maqinato.facebookLoginButton=false;
        var appId='602127853167511';
        if(maqinato.config.server==="production"){
            appId='602127853167511';
        }else if(maqinato.config.server==="release"){
            appId='171864399646299';
        }
        // Additional JS functions here
        window.fbAsyncInit = function(){
            FB.init({
                appId      : appId, // App ID
                channelUrl : '//localhost/vendors/facebook/channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true,  // parse XFBML
                frictionlessRequests: true
            });
            //Se ejecuta el registro cuando se da click en el botón de Facebook
//            $("#facebookSignup").click(function(){
//                FB.login(function(){},{scope:'email'});
//            });
            //Se ejecuta el login cuando se da click en el botón de Facebook
            $("#facebookLogin,#facebookSignup").click(function(){
                maqinato.facebookLoginButton=true;
                FB.getLoginStatus(function(response){
                    maqinato.debug(response.status);
                    if (response.status === 'connected') {
                        var token=response.authResponse.accessToken;
                        loginWithFacebook(token);
                    }else{
                        FB.login(function(){},{scope:'email'});
                    }
                });
            });
            //Verifica cuando cambia el estado de la sesión en Facebook
            FB.Event.subscribe('auth.authResponseChange', function(response){
                if (response.status === 'connected'&&obj.options.landing){
                    //La persona está registrada en FB y agrega la app por primera vez
                    var token=response.authResponse.accessToken;
                    signinWithFacebook(token);
                }
            });     
            //Verifica el estado de la persona en FB y la aplicación
//            FB.getLoginStatus(function(response){
//                if(response.status === 'not_authorized'&&maqinato.config.user&&maqinato.config.provider==="facebook"){
//                    maqinato.message("The Facebook app was deleted.");
//                    obj.ajax.logout();
//                }else{
//                    //Verifica cuando cambia el estado de la sesión en Facebook
//                    FB.Event.subscribe('auth.authResponseChange', function(response){
//                        if (response.status === 'connected'){
//                            //La persona está registrada en FB y agrega la app por primera vez
//                            var token=response.authResponse.accessToken;
//                            signinWithFacebook(token);
//                        }else{
//                            if(!maqinato.facebookEmailExist&&obj.options.landing){
//                                //Si la persona no está registrada en FB, no se sabe si tiene la app
//                                FB.login(function(){},{scope:'email'});
//                            }
//                        }
//                    });
//                }
//            });
            
        };
        // Load the SDK Asynchronously
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));
        //Función para registro en bonfolio
        function signinWithFacebook(token){
            if(obj.options.landing){
                var url = '/me';
                FB.api(url, function(data){
                    var email=data.email;
                    var name=data.name.split(" ")[0];
                    var lastname=data.name.split(" ")[1];
                    var password=Tools.sha512(data.id+data.email);
                    obj.ajax.signup(name,lastname,email,password,function(data){
                        if(data==="exist"){
                            maqinato.facebookEmailExist=true;
                            maqinato.message("The email is already registered");
                            //Si el usuario existe, borra la aplicación para que no aparezca como registrada
                            FB.api("/me/permissions","DELETE",function(){});
                        }
                    },"facebook",data.id,token);
                });
            }
        }
        function loginWithFacebook(token){
            if(obj.options.landing){
                var url = '/me';
                FB.api(url, function(data){
                    var email=data.email;
                    var password=Tools.sha512(data.id+data.email);
                    if(!obj.config.user){
                        obj.ajax.login(email,password,true,function(data){
                            if(data==="error"){
                                signinWithFacebook(token);
                            }
                        },"facebook",token);
                    }
                });
            }
        }
    };
    /**
     * Valida los campos del formulario de registro
     * @param {Object} form Formulario a verificar
     * @return {mixed} false si los datos no son válidos, un obejto con los valores
     *      si los datos son válidos
     * */
    obj.signupValidate=function(form){
        var email=form.find("#sgn_email");
        var password=form.find("#sgn_password");
        var confirm=form.find("#sgn_confirm");
        var name=form.find("#sgn_name");
        var lastname=form.find("#sgn_lastname");
        var fields={};
        if($.trim(name.val()).length>2){
            fields.name=$.trim(name.val());
            if($.trim(lastname.val()).length>2){
                fields.lastname=$.trim(lastname.val());
                if(Security.isEmail($.trim(email.val()))){
                    fields.email=$.trim(email.val());
                    if(Security.isPassword($.trim(password.val()))){
                        if($.trim(password.val())===$.trim(confirm.val())){
                            fields.password=$.trim(password.val());
                        }else{
                            confirm.val("").addClass("errorPlaceholder").attr("Placeholder",_("No coincide con el password"));
                            fields=false;
                        }
                    }else{
                        password.val("").addClass("errorPlaceholder").attr("Placeholder",_("Entre 6 and 18 characters: @#$%_-."));
                        fields=false;
                    }
                }else{
                    email.val("").addClass("errorPlaceholder").attr("Placeholder",_("correo@ejemplo.com"));
                    fields=false;
                }
            }else{
                lastname.val("").addClass("errorPlaceholder").attr("Placeholder",_("El apellido no puede estar vacío"));
                fields=false;
            }
        }else{
            name.val("").addClass("errorPlaceholder").attr("Placeholder",_("El nombre no puede estar vacío"));
            fields=false;
        }
        return fields;
    };
    
    /**
     *  Main method to login, executed when the login event is executed
     *  @param {Object} form Formulario de login
     **/
    obj.login=function(form){
        var fields=obj.validateLogin(form);
        if(fields){
            maqinato.ajax.login(fields.email,fields.password,fields.keep,function(response){
                if(response==="success"){
                    maqinato.redirect("main");
                }else{
                    maqinato.dialog({
                        title:_("Correo o contraseña erroneos"),
                        html:_("Por favor verifique los datos e intente de nuevo")
                    });
                }
            });
            obj.formReset(form);
        }
    };
    /**
     * Valida los campos del formulario de login
     * @param {Object} form Formulario a verificar
     * @return {mixed} false si los datos no son válidos, un obejto con los valores
     *      si los datos son válidos
     * */
    obj.validateLogin=function(form){
        var email=form.find("#email");
        var password=form.find("#password");
        var keep=form.find("#keep").is(':checked');
        var fields={};
        if(Security.isEmail($.trim(email.val()))){
            fields.email=$.trim(email.val());
            if(Security.isPassword($.trim(password.val()))){
                fields.password=$.trim(password.val());
                fields.keep=true;
            }else{
                password.val("").addClass("errorPlaceholder").attr("Placeholder",_("Entre 6 and 18 characters: @#$%_-."));
                fields=false;
            }
        }else{
            email.val("").addClass("errorPlaceholder").attr("Placeholder",_("correo@ejemplo.com"));
            fields=false;
        }
        return fields;
    };
}