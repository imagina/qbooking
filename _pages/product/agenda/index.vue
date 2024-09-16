<template>
  <div id="adminAgendaPage">
    <dynamic-list :list-config="listConfig" />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from '../agenda/controller'

//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';

export default defineComponent({
  props: {},
  components: {dynamicList},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
