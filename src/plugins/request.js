export default {
    
    install : function (app, options) {
    
        const url_api = options.production ? options.url_production : options.url_development;
        var objApp;

        var session = 
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
            if(response.error && (response.code == 440 || response.code == 401)){
                if( objApp !== 'undefined') 
                    objApp.closeApp()
                return false;
            }
                
            if(response.error){
                if( objApp !== 'undefined')
                    objApp.showApiError(response.code, response.message)
                return false;
            }
                

            if(!response.error && response.message.trim() != ''){
                if( objApp !== 'undefined') 
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

        app.config.globalProperties.$upload = async function(route, file, id = 0, callback = null) {

            if(!session) return;
            
            var reader = new FileReader();

            reader.onload = async e => {

                const url = url_api+route+'/'+session+(id>0?`/${id}`:'');

                const response = await fetch(url, {
                    method: 'POST',
                    body: e.target.result
                })
                .then(res => res.json())
                .then(res => res);

                request__genResponse(response)
                // pare de mostrar o upload
                if(callback) callback(response);
            };


            await reader.readAsDataURL(file);

        }

    }

}

