function createVertexShad() {

    return {
        props: {
            getBind: Function
        },
        template: `
   <Window :width="530" :height="400" title="地质顶点着色" @cancel="close"   class="vertexShadWindow">

 <div style="display:flex;" class="custom-item">
   <label class="custom-label">字段:</label> 
   <div class="custom-item-box">
   <XbsjSelect v-model="selected" :list="nodeDatas" :title="'name'" @input="updateShad"></XbsjSelect>
   </div>
</div>

<div style="display:flex;" class="custom-item" v-if="selected">
    <label class="custom-label">单位:</label> 
    <div class="custom-item-box">
       <input v-model="selected.unit" readonly> 
    </div>
</div>

<div style="display:flex;" class="custom-item" v-if="selected">
    <label class="custom-label">最小值:</label> 
    <div class="custom-item-box">
       <input v-model.number="selected.min"   @input="updateShad" > 
    </div>
</div>

<div style="display:flex;" class="custom-item" v-if="selected">
    <label class="custom-label">最大值:</label> 
    <div class="custom-item-box">
       <input v-model.number="selected.max" @input="updateShad" > 
    </div>
</div>

<div style="display:flex;" class="custom-item" v-if="selected">
    <label class="custom-label">色带:</label> 
    <div class="custom-item-box">
         <XbsjRampSelect   @selected="setImg"></XbsjRampSelect>
    </div>
</div>



 
 
    </Window>`,
        data() {
            return {
                conditions: [],
                fields: [],
                selected: undefined,
                xbsjStyle: "",
                url: "",
                nodeDatas: [],
                image: undefined
            };
        },
        created() {

        },
        mounted() {
            let czmObject = this.getBind();

            this.nodeDatas = czmObject._tileset._properties.nodeDatas;
            if(this.nodeDatas.length ==0)
            return;
            //设置一个默认选中
            this.selected = this.nodeDatas[0];

            //这里需要重新载入tileset 通过修改url
            var url = czmObject.url;
            czmObject.url = "";
            czmObject.url = url;

            function customShader(tileset, attribNum = 3) {
                if (attribNum > 32) {
                    throw new Error('attribNum不能大于32！');
                }

                //注意这个大小和下面必须一致
                var t = new Cesium.Texture({ context: uia.earth.czm.scene.context, width: 282, height: 10 });

                // var header = `varying vec${attribNum < 4 ? attribNum : 4} v_custom_1;` + 
                //     (attribNum > 4 ? `varying vec${attribNum - 4} v_custom_2;` : '');

                var header = '';
                var vsBody = '';
                var fsComp = '';
                const an = Math.floor(attribNum / 4);
                const last = attribNum % 4;
                for (let i=0; i<an; i+=1) {
                    header += `varying vec4 v_custom_${i+1};`;
                    vsBody += `v_custom_${i+1}=a_custom_${i+1};`;
                    const sub = (i*4).toFixed(1);
                    fsComp += `xbsjv += dot(step(vec4(0.0-0.1, 1.0-0.1, 2.0-0.1, 3.0-0.1), vec4(xbsji-${sub})) * step(vec4(xbsji-${sub}), vec4(0.0+0.1, 1.0+0.1, 2.0+0.1, 3.0+0.1)), vec4(v_custom_${i+1}));`;
                }
                if (last > 0) {
                    const la = an;
                    header += (last >= 2 ? `varying vec${last} v_custom_${la+1};` : `varying float v_custom_${la+1};`);
                    vsBody += `v_custom_${la+1}=a_custom_${la+1};`;
                    const sub = (la*4).toFixed(1);
                    const patch = ', 0.0'.repeat(4 - last);
                    fsComp += `xbsjv += dot(step(vec4(0.0-0.1, 1.0-0.1, 2.0-0.1, 3.0-0.1), vec4(xbsji-${sub})) * step(vec4(xbsji-${sub}), vec4(0.0+0.1, 1.0+0.1, 2.0+0.1, 3.0+0.1)), vec4(v_custom_${la+1}${patch}));`;
                }

                var cs = {
                    vsHeader: header,
                    vsBody: vsBody,
                    fsHeader: header,
                    fsBody: '',
                };

                cs.fsBody = `
                    float xbsji = u_xbsjCustomParams.z; 
                    float xbsjv = 0.0;
                    ${fsComp}
                    float xbsjvv = smoothstep(u_xbsjCustomParams.x, u_xbsjCustomParams.y, xbsjv);
                    vec4 color = texture2D(u_xbsjCustomTexture, vec2(xbsjvv, u_xbsjCustomParams.w)); 
                    gl_FragColor *= vec4(color.xyz, 1.0); 
                `;

                tileset._xbsjCustomTexture = t;
                tileset.xbsjCustomShader = cs;
                tileset._xbsjCustomParams = tileset._xbsjCustomParams || new Cesium.Cartesian4(0, 0, 1, 1);
            }


           var unBind = XE.MVVM.watch(czmObject, 'ready', () => {
                customShader(czmObject._tileset, this.nodeDatas.length);
                this.setTexture();
                this.setParam();
                unBind();
            });

        },
        methods: {
            close() {
                this.$parent.destroyTool(this);
            },
            updateShad() {

                this.setParam(this.selected.min, this.selected.max);
            },
            setImg(it) {
                this.image = it.img;
                this.setTexture();
            },
            setTexture() {
                if (!this.image)
                    return;
                var tileset = this.getBind()._tileset;

                var img = new Image();
                img.src = this.image;
                img.width = 282;
                img.height = 10;
                img.onload = function () {
                    tileset._xbsjCustomTexture.copyFrom(img);
                }
            },
            setParam() {

                if (!this.selected)
                    return;
                var idx = this.nodeDatas.findIndex(s => s.name == this.selected.name);
                if (idx < 0)
                    return;

                var tileset = this.getBind()._tileset;
                var params = tileset._xbsjCustomParams;
                params.x = this.selected.min;
                params.y = this.selected.max;
                params.z = idx;
                params.w = 0.5;
            }
        },
        beforeDestroy(){
            //重新加载，恢复样式
            var czmObject =  this.getBind();
            var url = czmObject.url;
            czmObject.url = "";
            czmObject.url = url;
        }

    };
}
