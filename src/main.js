import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import request from './plugins/request'
import { loadFonts } from './plugins/webfontloader'
import router from './plugins/router'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(request, {
    production:false,
    url_production: 'http://',
    url_development: 'http://localhost:8800/',
    session_name: 'nic_user_client_sess',
    //session: 'session-gustavo'
  })
  .mount('#app')
