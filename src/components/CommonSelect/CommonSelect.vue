<template>
  <el-select v-model="selectedValue" @change="handleChange">
    <el-option
      :label="customLabel"
      :value="customValue"
    ></el-option>
    <el-option
      v-for="(option, index) in options"
      :key="index"
      :label="getOptionLabel(option)"
      :value="getOptionValue(option)"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedValue: {
      type: [String, Number],
      default: ''
    },
    labelKey: {
      type: String,
      default: 'label' // 默认列名映射关系
    },
    valueKey: {
      type: String,
      default: 'value' // 默认列名映射关系
    },
    customValue: {
      type: String,
      default: '0'
    },
    customLabel: {
      type: String,
      default: '所有'
    }
  },
  data() {
    return {
      internalSelectedValue: this.selectedValue,
      //customLabel: '所有', // 用户自定义选项的标签
      //customValue: '0'// 用户自定义选项的值
    }
  },
  watch: {
    selectedValue(newValue) {
      // 监听外部传入的选中值变化，更新内部选中值
      this.internalSelectedValue = newValue
    },
    customLabel() {
      debugger
      this.handleCustomOptionChange()
    },
    customValue() {
      this.handleCustomOptionChange()
    }
  },
  methods: {
    getOptionLabel(option) {
      // 根据 labelKey 获取选项的标签值
      return option[this.labelKey]
    },
    getOptionValue(option) {
      // 根据 valueKey 获取选项的值
      return option[this.valueKey]
    },
    handleChange(value) {
      // 触发 change 事件，并将选中值传递给父组件
      this.$emit('change', value)
    },
    handleCustomOptionChange() {
      // 在这里处理用户自定义选项的更改
      // 更新 customLabel 和 customValue
      this.$emit('change', this.customValue)
    }
  }
}
</script>

<style scoped>
/* 可以添加样式 */
</style>
