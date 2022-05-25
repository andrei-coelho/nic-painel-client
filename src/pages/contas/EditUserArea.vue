<template>
    <v-container class="mt-2" style="background-color:white; height: 100%; overflow:auto;">
        
        <v-row style="border-bottom: 1px solid gray;">
            <v-col><h5 class="text-start">Informações do Usuário</h5></v-col>
            <v-btn
                icon="mdi-close-box-outline"
                color="error"
                @click="fechar()"
            ></v-btn>
        </v-row>

        <v-row>
            
            <v-col cols="12">
                <v-overlay
                    v-model="overlay"
                    style="z-index: 999999999999;"
                    persistent
                    >
                </v-overlay>
                <v-overlay
                    v-model="showPass"
                    style="z-index: 999999999999;"
                    persistent
                    >
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-card-title class="text-h5">
                                        NOVA SENHA:
                                    </v-card-title>
                                    <v-card-text>{{ senhaTemp }}</v-card-text>
                                    <v-card-actions>
                                        <v-btn color="info" @click="showPass = false">OK</v-btn>
                                    </v-card-actions>
                                </v-card>
                                
                            </v-col>
                        </v-row>
                    </v-container>
                   
                </v-overlay>
                <v-form class="mt-2">
                    
                    <div v-if="ativo ">
                        <p class="text-teal">ativo</p>
                    </div>
                    
                    <div v-else>
                        <p class="text-error">bloqueado</p>
                    </div>

                    <h4 class="pa-0 ma-0">{{ slug }}</h4>
                    
                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="nome"
                        label="Nome"
                    ></v-text-field>

                   <v-text-field
                        class="mb-0 pb-0"
                        v-model="cargo"
                        label="Cargo"
                    ></v-text-field>

                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="email"
                        label="E-mail"
                    ></v-text-field>

                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="telefone"
                        label="Telefone"
                    ></v-text-field>

                    <v-checkbox
                        v-model="ismaster"
                        label="Usuário Master"
                        color="indigo-darken-3"
                        hide-details
                    ></v-checkbox>
                    
                    <v-container fluid v-if="!ismaster">
                        <v-row>
                            <h3>Permissões:</h3>
                            <v-col cols="12" >
                                <v-checkbox v-for="permission, k in permissions" :key="k"
                                    v-model="permission.selected"
                                    :label="`${permission.nome} (${permission.description})`"
                                    color="indigo-darken-3"
                                    hide-details
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>

                    <v-btn color="info" @click="salvar()">SALVAR ALTERAÇÔES</v-btn>
                    <br><br><br><br><br><br><br><br><br>
                    
                    <v-container fluid>
                        <v-row>
                            <v-col cols="6">
                                <p><small>Use este botão para gerar uma nova senha para o usuário</small></p>
                                <v-btn color="error" @click="resetPass()">RESETAR SENHA</v-btn>
                            </v-col>
                            <v-col cols="6" v-if="ativo">
                                <v-btn color="error float-right" @click="ativar(0)">BLOQUEAR USUÁRIO</v-btn>
                            </v-col>
                            <v-col cols="6" v-else>
                                <v-btn color="success" class="float-right" @click="ativar(1)">ATIVAR USUÁRIO</v-btn>
                            </v-col>
                            
                        </v-row>
                    </v-container>
                    
                    <br><br><br><br><br><br><br><br><br>
                    <v-btn color="error" @click="deletar()">DELETAR USUÁRIO</v-btn>
                    
                </v-form>
            </v-col>

        </v-row>

    </v-container>
</template>

<script>
export default {

    props:{
        user:Object,
        client:String
    },

    mounted() {
        this.list_permissions()
    },

    data() {
        
        return {
            usuario:this.user,
            nome: this.user.nome,
            client_slug: this.client,
            slug: this.user.slug,
            telefone: this.user.telefone,
            email: this.user.email,
            cargo: this.user.cargo,
            ativo: this.user.ativo == 1,
            overlay: false,
            showPass:false,
            ismaster: this.user.master == 1,
            senhaTemp:'',
            permissions:[]
        }

    },

    methods: {
        
        fechar(){
            this.$emit('fecharModal')
        },

        refresh(){
            this.$emit('refresh')
        },

        async list_permissions(){
            let res = await this.$request('client@users/get_permissions_user', {
                user_id: this.usuario.id
            })

            if(!res.error){
                this.permissions = res.data
            }
        },

        async salvar(){
            this.overlay = true

            let permiss = [];
            for (let i = 0; i < this.permissions.length; i++) {
                const per = this.permissions[i];
                if(per.selected) permiss.push(per);
            }
            
            let res = await this.$request('client@users/update_user', {
                user_id: this.usuario.id,
                nome: this.nome,
                email:this.email,
                cargo:this.cargo,
                telefone:this.telefone,
                master:this.ismaster ? 1 : 0,
                permissions:permiss
            })

            if(!res.error) {
                this.refresh();
                this.fechar();
            }

            this.overlay = false
        },

        async deletar(){

            this.overlay = true
            
            let res = await this.$request('client@users/delete_user', {
                user_id: this.usuario.id
            })

            if(!res.error) {
                this.refresh();
                this.fechar();
            }

            this.overlay = false
        },

        async ativar(status){
            
            this.overlay = true
            
            let res = await this.$request('client@users/ativar_user', {
                user_id: this.usuario.id,
                status: status
            })

            if(!res.error) {
                this.refresh();
                this.ativo = !this.ativo
            }
            this.overlay = false
        },

        async resetPass(){
            
            this.overlay = true
            
            let res = await this.$request('client@users/reset_pass', {
                user_id: this.usuario.id
            })

            if(!res.error){
                this.senhaTemp = res.data.pass
                this.showPass = true;
            }

            this.overlay = false
        },
        
        genUserSlug(value){
            
            value = value.replace(/^\s+|\s+$/g, ''); // trim
            value = value.toLowerCase();
            var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            var to   = "aaaaeeeeiiiioooouuuunc------";
            
            for (var i=0, l=from.length ; i<l ; i++) {
                value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
            
            value = value.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-') 
                .replace(/-+/g, '-'); 

            this.slug = value+"@"+this.client_slug
            
        }

    },

    watch:{
        nome(value){
            this.genUserSlug(value)
        }
    }
}
</script>