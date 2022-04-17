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
            `${options.session_name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        function request__setCookie(cookie = '') {
            session || cookie != '' ? (function(){
                const d = new Date();
                d.setTime(d.getTime() + (2*24*60*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = options.session_name + "=" + (session ? session : cookie) + ";" + expires + ";path=/";
            })() : request__resetCookie();
        }

        app.config.globalProperties.$close_session = function (){
            request__resetCookie()
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

            if(response.error && response.code == 440 && objApp !== 'undefined'){
                objApp.closeApp()
                return;
            }
                
            if(response.error && objApp !== 'undefined')
                objApp.showApiError(response.code, response.message)

            if(!response.error && objApp !== 'undefined' && response.message.trim() != '')
                objApp.showApiSuccess(response.message)

            if(response.hasOwnProperty('session')) {
                session = response.session
                request__setCookie();
            }

            return response;

        }

        app.config.globalProperties.$showCookie = function() {
            console.log(session);
        }

    }

}

