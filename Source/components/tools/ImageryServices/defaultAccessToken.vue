<template>
    <Window
        :footervisible="true"
        @cancel="cancel"
        @ok="ok"
        v-show="show"
        :width="463"
        :minWidth="202"
        :height="500"
        :left="5"
        :top="138"
        :title="lang.title"
    >
        <span class="field">{{lang.defaultToken}}:</span>
        <input class="inputItem" v-model="token"/><br/>

    </Window>
</template>

<script>
export default {
    data(){
        return{
            token: '',
            langs: {
                zh: {
                    Token
                },
                en: {

                }
            }
        }
    },
    mounted(){
        XE.MVVM.bind(this, 'token', )
    }
}
</script>

<style scoped>

</style>