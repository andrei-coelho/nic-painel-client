<template>
  <v-app>
    <component :is="component"/>
  </v-app>
</template>

<script>
import LoginArea from './components/LoginArea.vue'
import ClientAdminArea from './components/ClientAdminArea.vue'

export default {
  name: 'App',

  components: {
    LoginArea,
    ClientAdminArea
  },

  data(){
    return {
      component: 'ClientAdminArea'
    }
  },
}
</script>
