<template>
  <v-app>
    <component 
      :is="component"
      @restartApp="onRestart"
      />
  </v-app>
</template>

<script>
import AuthArea from './components/AuthArea.vue'
import ClientAdminArea from './components/ClientAdminArea.vue'
import LoadingPage from './components/LoadingPage.vue'

export default {
  
  name: 'App',

  created() {
    this.start_app()
  },

  components: {
    AuthArea,
    ClientAdminArea,
    LoadingPage
  },

  data(){
    return {
      component: 'LoadingPage'
    }
  },

  methods: {

    async start_app(){
      if(this.$has_session()){
        let status = await this.$request('@auth/refresh_user_client');
        this.component = status ? 'ClientAdminArea' : 'AuthArea';
        this.$router.push('/');
      } else {
        this.component = 'AuthArea'
      }
    },

    onRestart(){
      location.reload();
      return false;
    }

  },
}
</script>
