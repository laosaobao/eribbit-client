<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="clickSpecs(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="clickSpecs(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
const spliter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  //skus是后端返回 包含所有sku以及sku的库存信息
  //路径字典
  const pathMap = {}
  skus.forEach(sku => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组
      //sku对象信息很多 只取每个规格的name 数组
      const specs = sku.specs.map(spec => spec.valueName)
      // 3. 得到sku属性值数组的子集，通过getPowerSet工具
      // 例如：[1,2,3] ==> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象
      powerSet.forEach(set => {
        //[1,2,3]拼接为1★2★3作为路径
        const key = set.join(spliter)
        if (pathMap[key]) {  //判断key是否存在，不同sku拆分出来的子集可能重复，
          //重复时往里追加push sku.id即可
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }

      })
    }
  })
  //   console.log(pathMap)
  return pathMap
}

// 获取已选中的值数组
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中的按钮对象
    const seletedVal = item.values.find(val => val.selected)
    arr.push(seletedVal ? seletedVal.name : undefined)
  })
  return arr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {

  specs.forEach((spec, i) => {
    //得到当前已选择的选项列表,
    // 必须写在外层foreach里面，因为下面会往列表里填充值，再拼接为路径，通过路径是否存在判断是否可选
    //写在foreach里面能保证每次都是修改前的原始列表
    const selectedArr = getSelectedValues(specs)
    spec.values.forEach(val => {
      // 已经选中的按钮不用判断
      if (val.selected) return
      // 未选中的套入选项列表对应的位置，形成路径，判断路径是否存在
      selectedArr[i] = val.name
      //过滤undefined值
      const key = selectedArr.filter(v => v).join(spliter)
      //根据是否有该路径，设置禁用状态
      val.disabled = !pathMap[key]
    //   console.log(key)

    })
  })
}
// 初始化默认选中状态
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach(val => {
        val.selected = val.name === value
      })
    })
  }
}


export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId:{
        type:String,
        default:''
    }
  },
  setup(props,{emit}) {
    //得到可选选项的路径字典
    const pathMap = getPathMap(props.goods.skus)
    // 根据传入的skuId默认选中规格按钮
    initSelectedStatus(props.goods, props.skuId)
    // 组件初始化的时候更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    const clickSpecs = (item, val) => {
      //禁用状态 不操作
      if (val.disabled) return
      // 1. 选中与取消选中逻辑
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(bv => { bv.selected = false })
        val.selected = true
      }
      // 点击的时候更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
       // 触发change事件将sku数据传递出去
        const selectedArr = getSelectedValues(props.goods.specs).filter(v => v)
      if (selectedArr.length === props.goods.specs.length) {
        const skuIds = pathMap[selectedArr.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // 传递
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', '')
        })
      } else {
        emit('change', {})
      }

    }
    return { clickSpecs }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>