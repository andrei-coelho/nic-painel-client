<template>
    <v-row>
        <v-dialog
            v-model="showEdit"
            fullscreen
            style="z-index: 999999999;"
        >   
            <EditUserArea :client="client_slug" :user="atualUser" @refresh="refresh" @fecharModal="closeModal"/>
        </v-dialog>

        <v-col cols="12" md="6" lg="3"
            v-for="user,k in usuarios" :key="k">
            <v-card
                class="mx-auto"
                max-width="310"
            >
                <v-card-text class="">
                    <p class="text-h5">
                        {{ user.nome }}
                    </p>
                    <p class="pb-3">{{ user.cargo }}</p>
                    <small><b>{{ user.slug }}</b></small>
                    <div class="text-teal">
                        <v-icon>mdi-whatsapp</v-icon> {{ user.telefone }}
                    </div>
                    <div class="text-primary">
                        <v-icon>mdi-email</v-icon> {{ user.email }}
                    </div>
                    <div v-if="user.ativo == 1">
                        <p class="text-teal">ativo</p>
                    </div>
                    <div v-else>
                        <p class="text-error">bloqueado</p>
                    </div>
                </v-card-text>
                <v-card-actions v-show="showBtns">
                    <v-btn
                        variant="text"
                        color="info"
                        icon="mdi-account-edit"
                        @click="openEditor(k)"
                    >
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

import EditUserArea from './EditUserArea.vue'

export default {

    components:{EditUserArea},

    props:{
        list:Array,
        showEditor:Boolean,
        slug:String
    },

    data() {
        return {
            usuarios:this.list,
            client_slug:this.slug,
            showBtns:this.showEditor,
            showEdit:false,
            atualUser:{}
        }
    },

    methods: {
        closeModal(){
            this.showEdit = false
        },

        openEditor(k){
            this.atualUser = this.usuarios[k];
            this.showEdit = true
        },
        refresh(){
            this.$emit('refresh')
        }
    },
}
</script>