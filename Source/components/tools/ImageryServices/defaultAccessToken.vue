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
            show: false,
            token: '',
            langs: {
                zh: {
                    defaultToken: 'defaultAccessToken',
                },
                en: {
                    defaultToken: 'defaultAccessToken',
                }
            }
        }
    },
    mounted(){
        this.token = Cesium.Ion.defaultAccessToken;
    },
    methods:{
        cancel () {
            this.show = false;
        },
        ok () {

            this.show = false;
            // this._imagelayer = undefined;
            Cesium.Ion.defaultAccessToken = this.token;
        },
    }
}
</script>

<style scoped>
.field {
  display: inline-block;
  width: 100px;

  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
  vertical-align: bottom;
}
.inputItem {
  width:222px;
  height:26px;
  background:rgba(56,56,56,1);
  border:1px solid rgba(46,46,46,1);
  opacity:1;
  border-radius:3px;
  outline: none;
  margin:0px 0px 6px 0px;
  padding: 0 6px;
  color: #ffffff;
}
</style>