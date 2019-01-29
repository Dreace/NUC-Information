// import {  } from '../../lib/utils';

Component({
    properties: {
        id: {
            type: String,
            default: '',
        },
        edit: {
            type: Boolean,
            default: false,
        },
        del: {
            type: Boolean,
            default: false,
        }
    },
    data: {
        transitionTime: 0,
        translateX: 0,
        translateXDel: 60,
        translateXEdit: 120,
        __lastXs: [], // 内部使用，记录上一个x
        __startX: 0, // 内部使用，开始的X
        __currentX: 0, // 内部使用，当前X
        __btns: [], // 内部使用，有几个按钮
        __maxX: 0, // 内部使用，最大X的偏移 单位像素
    },
    methods: {
        __start(e) {
            if (e.touches.length !== 1) {
                return;
            }
            this.data.__lastXs = [];
            this.data.__startX = e.touches[0].clientX;
            this.data.__lastXs.push(e.touches[0].clientX);
            this.setData({
                transitionTime: 0
            });
        },
        __move(e) {
            if (e.touches.length !== 1) {
                return;
            }
            this.data.__lastXs.push(e.touches[0].clientX);
            let moveed = this.data.__startX - e.touches[0].clientX;
            let cX = this.data.__currentX + moveed;
            if (cX < 0) {
                cX = 0;
            }
            if (cX > this.data.__maxX) {
                cX = this.data.__maxX;
            }

            this.setData({
                translateX: cX,
                translateXDel: 60 - (this.data.__btns.length === 1 ? cX : cX / 2),
                translateXEdit: 120 - cX,
            });
        },
        __end(e) {
            if (e.changedTouches.length !== 1) {
                return;
            }
            let moveed = this.data.__startX - e.changedTouches[0].clientX;
            let cX = this.data.__currentX + moveed;
            let __lastXs = this.data.__lastXs;
            let __lastXsLength = __lastXs.length;
            let __open = (__lastXs[__lastXsLength - 1] - (__lastXs[__lastXsLength - 2] || __lastXs[__lastXsLength - 1])) < 0 ? true : false;
            if (cX < 0) {
                cX = 0;
            }
            if (cX > this.data.__maxX) {
                cX = this.data.__maxX;
            }
            if(__open && cX < 10) {
                __open = false;
            }
            this.setData({
                transitionTime: __open ? 400 : 200,
                translateX: __open ? this.data.__maxX : 0,
                translateXDel: __open ? 0 : 60,
                translateXEdit: __open ? 0 : 120,
            });
            this.data.__currentX = __open ? this.data.__maxX : 0;
        },
        __taped(e) {
            // 延迟
            setTimeout(() => {
                this.triggerEvent(e.target.dataset.type, this.data.id);
            }, 300);
        }
    },
    ready() {
        let __btns = [];
        if (this.data.edit) {
            __btns.push({
                text: '编辑',
                color: 'primary',
                type: 'edit'
            });
        }
        if (this.data.del) {
            __btns.push({
                text: '删除',
                color: 'danger',
                type: 'del'
            });
        }
        this.setData({
            __btns: __btns,
            __maxX: __btns.length * 60
        });
    }
});
