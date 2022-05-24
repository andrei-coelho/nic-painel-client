<template>
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
            </v-card-text>
            <v-card-actions v-if="showEditor">
                <v-btn
                    variant="text"
                    color="info"
                    icon="mdi-account-edit"
                    @click="reveal = true"
                >
                    Learn More
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
export default {
    props:{
        list:Array,
        showEditor:Boolean
    },
    data() {
        return {
            usuarios:this.list
        }
    },
}
</script>