import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import request from './plugins/request'
import { loadFonts } from './plugins/webfontloader'
import router from './plugins/router'
import notify from './plugins/notify'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(request, {
    production:false,
    url_production: 'http://nicapp.servicos.ws/',
    url_development: 'http://localhost:8800/',
    session_name: 'nic_user_client_sess',
    //session: 'session-gustavo'
  })
  .use(notify, {
    production:false,
    icon_production: 'http://nicapp.servicos.ws/',
    icon_development: 'http://localhost:8800/',
  })
  .mount('#app')
