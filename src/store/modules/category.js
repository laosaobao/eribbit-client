//分类

import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
    namespaced: true,
    state() {
        return {
            //分类信息
            list: topCategory.map(item => ({ name: item }))
        }
    },

    //修改分类函数
    mutations: {
        setList(state, payload) {
            state.list = payload
        },

        // 修改当前一级分类下的open数据为true,鼠标移动到上方时调用该方法展示二级分类
        show(state, item) {
            const category = state.list.find(category => category.id === item.id)
            category.open = true
        },
          // 修改当前一级分类下的open数据为false
        hide(state, item) {
            const category = state.list.find(category => category.id === item.id)
            category.open = false
        }
    },
    //获取分类函数
    actions: {
        async getList({ commit }) {
            //获取分类数据
            const { result } = await findAllCategory()
            // 给一级分类加上一个控制二级分类显示隐藏的数据open
            result.forEach(item => {
                item.open = false
            })
            //修改分类数据
            commit('setList', result)
        }
    }
}