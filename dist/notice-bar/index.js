import baseComponent from '../helpers/baseComponent'
import classNames from '../helpers/classNames'


baseComponent({
    properties: {
        prefixCls: {
            type: String,
            value: 'wux-notice-bar',
        },
        content: {
            type: String,
            value: '',
        },
        mode: {
            type: String,
            value: '',
        },
        loop: {
            type: Boolean,
            value: false,
        },
        leading: {
            type: Number,
            value: 500,
        },
        trailing: {
            type: Number,
            value: 800,
        },
        speed: {
            type: Number,
            value: 25,
        },
    },
    data: {
        animatedWidth: 0,
        overflowWidth: 0,
        visible: true,
    },
    computed: {
        classes() {
            const { prefixCls } = this.data
            const wrap = classNames(prefixCls)
            const hd = `${prefixCls}__hd`
            const icon = `${prefixCls}__icon`
            const bd = `${prefixCls}__bd`
            const container = `${prefixCls}__marquee-container`
            const marquee = `${prefixCls}__marquee`
            const ft = `${prefixCls}__ft`
            const action = `${prefixCls}__action`

            return {
                wrap,
                hd,
                icon,
                bd,
                container,
                marquee,
                ft,
                action,
            }
        },
    },
    methods: {
        clearMarqueeTimer() {
            if (this.marqueeTimer) {
                clearTimeout(this.marqueeTimer)
                this.marqueeTimer = null
            }
        },
        startAnimation() {
            this.clearMarqueeTimer()
            const { overflowWidth, loop, leading, trailing, speed } = this.data
            const isLeading = this.data.animatedWidth === 0
            const timeout = isLeading ? leading : speed
            const animate = () => {
                let animatedWidth = this.data.animatedWidth + 1
                const isRoundOver = animatedWidth > overflowWidth

                // 判断是否完成一次滚动
                if (isRoundOver) {
                    if (!loop) {
                        return false
                    }
                    // 重置初始位置
                    animatedWidth = 0
                }

                // 判断是否等待一段时间后进行下一次滚动
                if (isRoundOver && trailing) {
                    setTimeout(() => {
                        this.setData({
                            animatedWidth,
                        })

                        this.marqueeTimer = setTimeout(animate, speed)
                    }, trailing)
                } else {
                    this.setData({
                        animatedWidth,
                    })
                    this.marqueeTimer = setTimeout(animate, speed)
                }
            }

            if (this.data.overflowWidth !== 0) {
                this.marqueeTimer = setTimeout(animate, timeout)
            }
        },
        initAnimation() {
            const { prefixCls } = this.data
            const query = wx.createSelectorQuery().in(this)
            query.select(`.${prefixCls}__marquee-container`).boundingClientRect()
            query.select(`.${prefixCls}__marquee`).boundingClientRect()
            query.exec((rects) => {
                if (rects.filter((n) => !n).length) return

                const [container, text] = rects
                const overflowWidth = text.width - container.width

                if (overflowWidth !== this.data.overflowWidth) {
                    this.setData({ overflowWidth }, this.startAnimation)
                }
            })
        },
        onAction() {
            if (this.data.mode === 'closable') {
                this.clearMarqueeTimer()
                this.setData({
                    visible: false
                })
            }
            this.triggerEvent('click')
        },
        onClick() {
            this.triggerEvent('click')
        },
    },
    ready() {
        this.initAnimation()
    },
    detached() {
        this.clearMarqueeTimer()
    },
})
