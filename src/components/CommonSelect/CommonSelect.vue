<template>
  <el-select v-model="selectedValue" @change="handleChange">
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
      required: true,
    },
    selectedValue: {
      type: [String, Number],
      default: '',
    },
    labelKey: {
      type: String,
      default: 'label', // 默认列名映射关系
    },
    valueKey: {
      type: String,
      default: 'value', // 默认列名映射关系
    },
  },
  data() {
    return {
      // 在组件内部使用的选中值
      internalSelectedValue: this.selectedValue,
    };
  },
  watch: {
    selectedValue(newValue) {
      // 监听外部传入的选中值变化，更新内部选中值
      this.internalSelectedValue = newValue;
    },
  },
  methods: {
    getOptionLabel(option) {
      // 根据 labelKey 获取选项的标签值
      return option[this.labelKey];
    },
    getOptionValue(option) {
      // 根据 valueKey 获取选项的值
      return option[this.valueKey];
    },
    handleChange(value) {
      // 触发 change 事件，并将选中值传递给父组件
      this.$emit('change', value);
    },
  },
};
</script>
