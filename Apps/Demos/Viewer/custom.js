//演示基本vue组件
//演示我们的自定义组件
//演示语言切换
var myTool = {
    props: {
        getBind: Function
    },
    template: `
            <div>
                <Window
                :footervisible="true"
                @cancel="cancel"
                @ok="ok" 
                :width="463"
                :minWidth="202"
                :height="500"
                :left="5"
                :top="138"
                :title="title" 
                v-show="show"
                >

                <div style="display:flex;" class="custom-item">
                    <label class="custom-label">原生组件:</label>
                    <div class="custom-item-box">
                     <button @click="click" style="margin-top: 6px;" >点击</button>
                    </div>
                   
                 </div>

                <div style="display:flex;" class="custom-item">
                   <label class="custom-label">颜色按钮:</label> 
                   <div class="custom-item-box">
                     <XbsjColorButton style="height:30px;" v-model="color"> </XbsjColorButton>
                   </div>
                </div>

                <div style="display:flex;" class="custom-item">
                   <label class="custom-label">选择框:</label> 
                   <div class="custom-item-box">
                     <XbsjCheckBox v-model="checkboxV"> </XbsjCheckBox>
                   </div>
                </div>

                <div style="display:flex;" class="custom-item">
                   <label class="custom-label">切换框:</label>  
                   <div class="custom-item-box">
                     <XbsjSwitch v-model="switchV" style="margin-top: 6px;"> </XbsjSwitch>
                   </div>
                    
                </div>
                
                <div style="display:flex;" class="custom-item">
                   <label class="custom-label">滑动条:</label> 
                   <div class="custom-item-box">
                   <XbsjSlider style="margin-top: 16px;"  :min="0" :max="10" :step="0.1" showTip="always" v-model="sliderV" > 
                    </XbsjSlider>
                    </div>
                </div>

                <div style="display:flex;" class="custom-item">
                   <label class="custom-label">右键菜单:</label> 
                   <div class="custom-item-box">
                      <div style="width:100px;background:red;height: 35px;" @contextmenu.prevent="popMenu()"></div>
                   </div>
                </div>

                <div style="display:flex;" class="custom-item">
                    <label class="custom-label">输入框:</label> 
                    <div class="custom-item-box">
                     <XbsjInput style="height: 30px;width: 80%;"></XbsjInput>
                    </div>
                </div>

                <div style="display:flex;" class="custom-item">
                    <label class="custom-label">经纬度:</label> 
                    <div class="custom-item-box">
                        <XbsjLngLatHeight v-model="LngLatHeight" style="height: 30px;width: 80%;"></XbsjLngLatHeight>
                    </div>
                </div>

                <div style="display:flex;" class="custom-item">
                    <label class="custom-label">旋转:</label> 
                    <div class="custom-item-box">
                        <XbsjHeadingPitchRoll v-model="rotation" style="height: 30px;width: 80%;"></XbsjHeadingPitchRoll>
                    </div>
                </div>

                <div style="display:flex;" class="custom-item">
                    <label class="custom-label">缩略图:</label> 
                    <div class="custom-item-box">
                        <XbsjCaptureThumbnail style="float:right;width:100%;height: 95px;" :value="thumbnail" @changed="updateThumbNail"></XbsjCaptureThumbnail>
                    </div>
                </div>



                
                </Window>
            </div>`,
    data() {
        return {
            show: true,
            langs: {
                zh: {
                    title: '自定义窗口',
                    confirm: '确认删除?'
                },
                en: {
                    title: 'custum window',
                    confirm: 'confirm delete?'
                }
            },
            t1: 'test custom tool',
            lang: undefined,
            color: {
                rgba: {
                    r: 255,
                    g: 0,
                    b: 255,
                    a: 1
                }
            },
            checkboxV: false,
            switchV: false,
            sliderV: 5,
            LngLatHeight: [1, 0, 300],
            rotation: [1.223, 0.444, 23.444],
            thumbnail: ""
        }
    },
    created() {
        
    },
    mounted() {


        console.log('my tool mounted');
    },
    methods: {
        updateThumbNail(img) {
            //更新场景名称
            if (!this.sceneID) return;

            var labServer = this.$root.$labServer;
            labServer
                .updateLayerThumbnail("scenes", this.sceneID, img)
                .then(id => {
                    console.log("update scene thumbnail success");

                    this.thumbnail = img;
                })
                .catch(ex => {
                    console.log("update scene thumbnail failed " + ex.message || ex);
                });
        },
        popMenu() {
            this.$root.$earthUI.contextMenu.pop([{
                text: '测试菜单项',
                func: () => {
                    this.click();
                }
            }]);
        },
        click() {
            this.$root.$earthUI.confirm(this.lang.confirm, () => {
                console.log('confirmed')
            });
        },
        ok() {
            //通过 ok 销毁，销毁后再打开是新建
            this.$parent.destroyTool(this);

            /*
            var binded = this.getBind();
            //5 秒后再次打开 不会保留当前页面状态
            setTimeout(() => {
                this.$root.$earthUI.showPropertyWindow(binded, {
                    component: myTool
                })
            }, 5000);
            */
        },

        cancel() {

            //示意，通过cancel 隐藏
            this.show = !this.show;
            //5 秒后再次打开 会保留当前页面状态
            setTimeout(() => {
                this.show = true;
                //再次调用这个方法，可以确保当前tool在最前面                        
                this.$root.$earthUI.showPropertyWindow(this.getBind(), {
                    component: myTool
                })
            }, 5000);

        }
    },
    watch: {
        color(v) {
            console.log('color' + v);
        }
    },
    computed: {
        title() {
            return this.lang.title + ' [' + this.getBind().name + ']';
        }
    }

};