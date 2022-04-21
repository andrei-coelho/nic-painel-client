<template>
    <div>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
            <h4 class="pa-3">Digite seu e-mail para recuperar a senha</h4>
          <v-text-field
            v-model="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            label="E-mail"
            required
          ></v-text-field>
          <v-btn
            color="primary"
            flat
          > Enviar</v-btn>
          
        </v-form>
        <v-btn
            class="mt-4"
            color="primary"
            variant="text"
            @click="changeTo('Login')"
          > <v-icon>mdi-arrow-left</v-icon> voltar para login</v-btn>

    </div>
</template>

<script>
export default {
    methods: {
        changeTo(component){
            this.$emit('changeComponentAuth', component)
        }
    },
}
</script>