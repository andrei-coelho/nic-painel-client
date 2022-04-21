<template>
  <v-container>
    <v-snackbar
        v-model="snackbarError"
        color="red"
        top="true"
    >
        <span class="text-white">{{ messageError }}</span>
        <template v-slot:actions>
            <v-btn
            color="white"
            variant="text"
            @click="snackbarError = false"
            >
            X
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar
        v-model="snackbarSuccess"
        color="green"
        top="true"
    >
        <span class="text-white">{{ messageSuccess }}</span>
        <template v-slot:actions>
            <v-btn
            color="white"
            variant="text"
            @click="snackbarSuccess = false"
            >
            X
            </v-btn>
        </template>
    </v-snackbar>
    <v-row class="text-center"
    justify="center">
      <v-col cols="12">
        <v-img
          :src="logo"
          class="my-3"
          contain
          height="100"
        />
      </v-col>

      <v-col
        lg="6"
      >
      <div 
        class="pa-5 elevation-10 rounded-xl"
      >
        <component 
          :is="component" 
          @loged="userLogin"
          @forgoted="userForgot"
          @changeComponentAuth="changeComponentAuth"
          ></component>
      </div>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import logo from '../assets/logo.svg'
import Login from './auth/Login.vue'
import Forgot from './auth/Forgot.vue'

export default {
  name: 'LoginArea',
  components:{Login, Forgot},
  created() {
    this.$set_responses_on_request(this)
  },
  data(){
    return {
      component:'Login',
      logo: logo,
      snackbarError: false,
      messageError:'',

      snackbarSuccess: false,
      messageSuccess:'',
    }
  },
  methods: {
    userLogin(){
      this.$emit("restartApp");
    },

    userForgot(){

    },

    changeComponentAuth(component){
      this.component = component;
    },


    showApiError(code, message){
        this.messageError = `Erro: ${code} - ${message}`;
        this.snackbarError = true;
    },
    showApiSuccess(message){
        this.messageSuccess = message;
        this.snackbarSuccess = true;    
    },
    closeApp(){
        this.$close_session();
        // faça algo
    },

  },
}
</script>
