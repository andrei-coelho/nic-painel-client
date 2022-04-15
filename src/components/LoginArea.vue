<template>
  <v-container>
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
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="senha"
            :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            prepend-inner-icon="mdi-key"
            variant="outlined"
            label="Senha"
            @click:append-inner="showPass = !showPass"
            required
          ></v-text-field>
          <v-btn
            color="primary"
            flat
          > Entrar</v-btn>
          
        </v-form>
        <v-btn
            class="mt-4"
            color="primary"
            variant="text"
          > esqueci minha senha</v-btn>
      </div>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import logo from '../assets/logo.svg'

export default {
  name: 'LoginArea',

  data(){
    return {
      logo: logo,
      showPass: false,
    }
  },
}
</script>
