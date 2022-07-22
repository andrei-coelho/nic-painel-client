import { Buffer } from 'buffer'

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

        function request__getPref(key){
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${key}=`);
            return parts.length === 2 ? parts.pop().split(';').shift() : null;
        }

        function request__setPref(key, value){
            const d = new Date();
            d.setTime(d.getTime() + (730*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = key + "=" + value + ";" + expires + ";path=/";
        }

        function request__setCookie(cookie = '') {
            session || cookie != '' ? (function(){
                const d = new Date();
                d.setTime(d.getTime() + (400*24*60*60*1000));
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

        app.config.globalProperties.$preference = function (key, value = ''){
            return value !== '' ? request__setPref(key, value) : request__getPref(key)
        }
        
        app.config.globalProperties.$request = async function (route, data = {}) {
            
            if(session) data.session = session;

            const response = await fetch(url_api+route, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => res)
            .catch(e => console.log(e))
            
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
            .then(res => {
                console.log(res.text());
                return res.json();
            })
            .then(res => res)
            .catch((error) => {
                console.log(error);
                if(callbackE)
                callbackE(error)
            });
            return response;
        }

        app.config.globalProperties.$upload = async function(route, file, data = {}, callbackS = null, callbackE, onLoad) {

            if(!session) return;
            
            data.hashId  = "";
            data.session = session; 
            let prts  = file.name.split('.');
            data.mime = prts[prts.length -1];
            data.name = file.name.substring(0, file.name.length - (data.mime.length + 1));
            data.file = "";

            const limitSize = (300000 * 16) - 1

            let start  = 0
            let end    = file.size > limitSize ? limitSize : file.size
            let finish = false
            let init   = true
            var status = false
            var parts  = Math.ceil((file.size > limitSize ? file.size / limitSize : 1));
            var step   = 0;
            const url  = url_api+route;
            
            var response;

            while(true){
                
                if(init) {
                    data.hashId = await request____create_ghost_file(url, data, callbackE);
                    status = data.hashId !== false
                    if(!status) break;
                    init = false;
                    continue;
                }

                if(!status) break;

                if(end >= file.size){
                    finish = true 
                    end = file.size    
                }

                await new Promise((resolve, reject) => {

                    const reader = new FileReader();

                    reader.onerror = e => {
                        callbackE("Ocorreu um erro no navegador.")
                        //return reject
                    }

                    reader.onload = async e => {

                        const fresult = e.target.result;
                        const buf = Buffer.alloc(fresult.byteLength);
                        const view = new Uint8Array(fresult);
                        
                        for (let i = 0; i < buf.length; ++i) 
                            buf[i] = view[i];

                        let base64String = buf.toString('base64');
                        // envia o resultado
                        data.file = base64String;
                        let s_append = await request____append_file(url, data, callbackE)
                        status = s_append
                        
                        step++;
                        const porcent = Math.ceil((step / parts) * 100);
                        onLoad(porcent);
                        //await new Promise(resolve => setTimeout(resolve, 300));
                        resolve();

                    }
                    
                    let slice = file.slice(start, end);
                    reader.readAsArrayBuffer(slice);

                })

                if(status && finish) {
                    if(status){
                        response = await request____commit_file(url, data);
                    }

                    console.log(response);
                        
                    if(response){
                        status = true;
                        request__genResponse(response)
                    }
                    // pare de mostrar o upload
                    callbackS(response);
                };

                start = end
                end += limitSize

            }

           
            
        }

    }

}

