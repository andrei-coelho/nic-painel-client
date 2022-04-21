<template>
    <v-container
        style="
        background-color: #4087F3; 
        position:fixed; 
        height:100%;"
        fluid>
        <div class="row">
            <div class="col" style="
                position:absolute;
                margin-left: auto;
                margin-right: auto;
                left: 0;
                right: 0;
                top: 20%;
                text-align: center;">
                <img :src="logo" class="pb-3" style="width: 80px;"/><br>
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="info"
                    indeterminate
                ></v-progress-circular> <br> 
                <p class="text-white pt-4">
                <small>Carregando Informações</small></p>
            </div>
        </div>
    </v-container>
</template>

<script>

import logo from '../assets/logo-white.svg'

export default {
    data() {
        return {
            logo:logo
        }
    },
}
</script>