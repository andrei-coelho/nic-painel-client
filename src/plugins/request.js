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
            // domain=http://localhost:3000/;
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
                if( ___is_object(objApp) && objApp.showApiError !== 'undefined' && response.message.trim() != '')
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

            console.log(route, response);
            //await new Promise(resolve => setTimeout(resolve, 10000));
            
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

        async function request____save_file(url, data, callbackE, onLoad){
            
            data.flag = 'save';
            if(onLoad) onLoad(100);
            
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => res)
            .catch((error) => {
                if(callbackE)
                callbackE(error)
            });
            
            return response;
        }

        async function request____create_ghost_file(url, data, callbackE){
            data.flag = "create";
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => res)
            .catch((error) => {
                if(callbackE)
                callbackE(error)
            });
            return !response.error ? response.data.hashId : false;
        }

        async function request____append_file(url, data, callbackE){
            data.flag = "append";
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => res)
            .catch((error) => {
                if(callbackE)
                callbackE(error)
            });
            return !response.error;
        }

        async function request____commit_file(url, data, callbackE){
            data.flag = "commit";
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => res)
            .catch((error) => {
                if(callbackE)
                callbackE(error)
            });
            return response;
        }

        app.config.globalProperties.$upload = async function(route, file, data = {}, callbackS = null, callbackE, onLoad) {

            if(!session) return;
            
            data.hashId  = "";
            data.session = session; 

            let parts = file.name.split('.');
            data.mime = parts[parts.length -1];
            data.name = file.name.substring(0, file.name.length - (data.mime.length + 1));

            var reader = new FileReader();
            
            reader.addEventListener('error', e => {
                callbackE("O arquivo é muito grande para fazer upload.")
            })

            reader.onload = async e => {
                
                const file = e.target.result;
                let size = file.length;
                var status = true;
                const url = url_api+route;
                var response;
                const max = 7864320;

                if(size > max){
                    
                    data.file = "";
                    const content = file.split(";")[1].split(",")[1]
                    size = content.length;
                    let parts  = Math.ceil(size / max);
                    let step   = 0;
                    let partIn = 0;
                    let init   = true;
                    let quebra = max;

                    let nextBrak = quebra;

                    while(partIn < size){

                        if(init) {
                            data.hashId = await request____create_ghost_file(url, data, callbackE);
                            if(!data.hashId) {
                                status = false;
                                break;
                            }
                            init = false;
                            continue;
                        }
                        
                        nextBrak  = nextBrak > size ? size : partIn+quebra;
                        data.file = content.substring(partIn, nextBrak)

                        let s_append = await request____append_file(url, data, callbackE)
                        if(!s_append) {
                            status = false;
                            break;
                        }

                        step++;
                        const porcent = Math.ceil((step / parts) * 100);
                        if(onLoad) onLoad(porcent);
                        partIn = nextBrak;
                        
                    }

                    if(status)
                       response = await request____commit_file(url, data);
                    
                } else {
                    data.file = file
                    response = await request____save_file(url, data, callbackE, onLoad)
                }

                if(response){
                    status = true;
                    request__genResponse(response)
                }
                // pare de mostrar o upload
                if(status && callbackS) callbackS(response);
            };

            return await reader.readAsDataURL(file);

        }

    }

}

