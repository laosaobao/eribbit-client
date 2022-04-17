<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
    props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
   setup (props, { emit }) {
       // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    // const checked = ref(false)
    const changeChecked = () => {
      //虽然checked.value = '数据' 会自动触发emit('update:modelvalue', '数据')
      //但在该函数结束前，函数内得到的checked.value值仍为原值，后面还需要用到修改后的值则需要创建中间变量newVal记录修改
      const newVal = !checked.value
      checked.value = newVal
      // emit('update:modelValue', !checked.value)
      // console.log(checked.value)
      // 使用emit通知父组件数据的改变
    //   emit('update:modelValue', checked.value)
    // 让组件支持change事件
      emit('change', newVal)
    }
    // 使用侦听器，得到父组件传递数据，给checked数据
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, { immediate: true })
    return { checked, changeChecked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>