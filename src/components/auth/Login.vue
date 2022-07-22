<template>
    <div>
        <v-overlay :model-value="overlay" 
        class="align-center justify-center">
            <v-progress-circular
                color="info"
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
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
            @click="entrar()"
            flat
          > Entrar</v-btn>
          
        </v-form>
        <v-btn
            class="mt-4"
            color="primary"
            variant="text"
            @click="changeTo('Forgot')"
          > esqueci minha senha</v-btn>
          
    </div>
</template>

<script>
export default {

  created() {

    let device = this.$preference('device')
    //console.log(device);
  },

    data() {
        return {
            showPass: false,
            overlay:false,
            email:'',
            senha:''
        }
    },
    methods: {
        changeTo(component){
            this.$emit('changeComponentAuth', component)
        },
        async entrar(){
            this.overlay = true;
            let device = this.$preference('device')
            
            const resp = await this.$request('@auth/logar', {
                email:this.email,
                senha:this.senha,
                device:  device == null ? "" : device
            });
            this.overlay = false;
            if(!resp.error) this.$emit('loged');
        } 
    },
}
</script>