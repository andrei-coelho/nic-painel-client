<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Minha Conta</h1>
                <p><small>Você precisará entrar novamente no sistema após qualquer alteração</small></p>
            </v-col>

            <v-col cols="12">
                
                <h5 class="pb-1">{{ email }}</h5>
                <h5 class="pb-5">{{ slug }}</h5>

                <v-text-field
                    class="mb-0 pb-0"
                    v-model="nome"
                    label="Nome"
                ></v-text-field>

            </v-col>

            <v-divider></v-divider>
            
            <v-col cols="12" class="pa-4">

                <h3 class="pb-4">Alterar Senha:</h3>         

                <v-text-field
                    class="mb-0 pb-0"
                    v-model="oldpass"
                    label="Senha Atual"
                ></v-text-field>

                <small class="text-error" v-show="errorPass">A senha precisa ter mais de 5 caracteres</small>
                <v-text-field
                    class="mb-0 pb-0"
                    v-model="newpass"
                    label="Nova Senha"
                ></v-text-field>
                
                <small class="text-error" v-show="errorPassConfirm">A nova senha não é a mesma digitada abaixo</small>
                <v-text-field
                    class="mb-0 pb-0"
                    v-model="confirmpass"
                    label="Confirme a Nova Senha"
                ></v-text-field>

            </v-col>
            
            <v-divider></v-divider>

            <v-col cols="12">
                <v-btn color="info" class="float-right" @click="salvar()">SALVAR ALTERAÇÕES</v-btn>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
export default {
    props:{
        _email:String,
        _nome: String,
        _slug: String
    },

    data() {
        return {
            email:this._email,
            slug: this._slug,
            nome: this._nome,
            oldpass:'',
            newpass:'',
            confirmpass:'',
            errorPass: false,
            errorPassConfirm:false
        }
    },

    methods: {
        
        async salvar(){
            
            if( (this.newpass.trim().length > 0 
                && this.newpass.trim().length < 5 )
                || this.nome.trim().length < 3
                || this.newpass != this.confirmpass
                ){
                return;
            }

            let res = await this.$request('@auth/change_me', {
                nome:this.nome,
                oldPass:this.oldpass,
                newPass:this.newpass
            })

            if(!res.error){
                this.$emit('changed')
            }

        }

    },


    watch:{
       
       newpass(value){
            this.errorPass = 
                value.trim().length > 0 && 
                value.trim().length < 5;
        },

        confirmpass(value){
            this.errorPassConfirm = 
                value.trim().length > 0  && 
                value != this.newpass;
        }

    }

}
</script>