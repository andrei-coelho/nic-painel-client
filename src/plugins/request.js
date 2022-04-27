export default {
    
    install : function (app, options) {
        
        const url = options.production ? options.url_production : options.url_development,
              url_api = url + 'api/';

        var objApp,
            client_path,
            session = 
                !options.production && options.hasOwnProperty('session') 
                ? (()=>{
                    request__setCookie(options.session);
                    return options.session;
                })()
                : (() => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${options.session_name}=`);
                    return parts.length === 2 ? parts.pop().split(';').shift() : null;
                })()

        function ___is_object(variable){
            return typeof variable === 'object' &&
            !Array.isArray(variable) &&
            variable !== null
        }

        function request__resetCookie(){
            document.cookie = `${options.session_name}=; Max-Age=-99999999; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        function request__setCookie(cookie = '') {
            session || cookie != '' ? (function(){
                const d = new Date();
                d.setTime(d.getTime() + (2*24*60*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = options.session_name + "=" + (session ? session : cookie) + ";" + expires + ";path=/";
            })() : request__resetCookie();
        }

        function request__genResponse(response){
            
            const isObj = ___is_object(objApp);

            if(response.error && (response.code == 440 || response.code == 401)){
                if(isObj && objApp.closeApp !== 'undefined') 
                    objApp.closeApp()
                return false;
            }
                
            if(response.error){
                if( ___is_object(objApp) && objApp.showApiError !== 'undefined')
                    objApp.showApiError(response.code, response.message)
                return false;
            }
                

            if(!response.error && response.message.trim() != ''){
                if( ___is_object(objApp) && objApp.showApiSuccess !== 'undefined') 
                    objApp.showApiSuccess(response.message)
                return false;
            }
                

            if(response.hasOwnProperty('session')) {
                session = response.session
                request__setCookie();
            }

        }

        app.config.globalProperties.$close_session = function (){
            request__resetCookie();
            session = null;
        }

        app.config.globalProperties.$set_responses_on_request = function (obj){
            objApp = obj;
        }
        
        app.config.globalProperties.$request = async function (route, data = {}) {
            
            if(session) data.session = session;

            const response = await fetch(url_api+route, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => res);
            
            request__genResponse(response); 
            return response;

        }

        if(!options.production)
        app.config.globalProperties.$showCookie = function() {
            console.log(session);
        }

        app.config.globalProperties.$has_session = function() {
            return  session !== null;
        }

        app.config.globalProperties.$set_client_path = function(client_path){
            client_path = client_path;
        }

        app.config.globalProperties.$get_client_path = function(){
            return client_path;
        }

        app.config.globalProperties.$file = function(module, file) {
            return url + module +'/'+session+'/'+client_path+'/'+file;
        }

        app.config.globalProperties.$upload = async function(route, file, data = {}, callbackS = null, callbackE) {

            if(!session) return;
            
            data.session = session; 
            data.mime = file.name.substring(file.name.length -3, file.name.length);
            data.name = file.name.substring(0, file.name.length -4);
            

            var reader = new FileReader();
            
            reader.onload = async e => {
                
                data.file = e.target.result;

                console.log(data);
                
                var status = true;

                const url = url_api+route;
                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(res => res)
                .catch((error) => {
                    status = false;
                    if(callbackE)
                    callbackE(error)
                });

                if(status)
                request__genResponse(response)
                // pare de mostrar o upload
                if(status && callbackS) callbackS(response);
            };

            return await reader.readAsDataURL(file);

        }

    }

}

