CKEDITOR.dom.event=function(t){this.$=t},CKEDITOR.dom.event.prototype={getKey:function(){return this.$.keyCode||this.$.which},getKeystroke:function(){var t=this.getKey();return(this.$.ctrlKey||this.$.metaKey)&&(t+=CKEDITOR.CTRL),this.$.shiftKey&&(t+=CKEDITOR.SHIFT),this.$.altKey&&(t+=CKEDITOR.ALT),t},preventDefault:function(t){var e=this.$;e.preventDefault?e.preventDefault():e.returnValue=!1,t&&this.stopPropagation()},stopPropagation:function(){var t=this.$;t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},getTarget:function(){var t=this.$.target||this.$.srcElement;return t?new CKEDITOR.dom.node(t):null},getPhase:function(){return this.$.eventPhase||2},getPageOffset:function(){var t=this.getTarget().getDocument().$;return{x:this.$.pageX||this.$.clientX+(t.documentElement.scrollLeft||t.body.scrollLeft),y:this.$.pageY||this.$.clientY+(t.documentElement.scrollTop||t.body.scrollTop)}}},CKEDITOR.CTRL=1114112,CKEDITOR.SHIFT=2228224,CKEDITOR.ALT=4456448,CKEDITOR.EVENT_PHASE_CAPTURING=1,CKEDITOR.EVENT_PHASE_AT_TARGET=2,CKEDITOR.EVENT_PHASE_BUBBLING=3;