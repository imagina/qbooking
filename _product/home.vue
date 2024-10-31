<template>
  <div id="productHomeBooking">
    <!--Dashboard-->
    <dashboard v-if="$hasAccess('ibooking.reservations.manage')" />
    <!-- Resource Workspace -->
    <resource-workspace v-else-if="$hasAccess('ibooking.resources.workspace')" />
    <!--Logo-->
    <div v-else class="wrapp__logo row items-center justify-center">
      <img :src="$store.state.qsiteApp.logo"></img>
    </div>
  </div>
</template>
<script>
import dashboard from 'modules/qbooking/_pages/product/dashboard';
import resourceWorkspace from 'modules/qbooking/_pages/product/resourceWorkspace';

export default {
  props: {},
  components: { dashboard, resourceWorkspace },
  watch: {},
  mounted() {
    this.$nextTick(function() {
    });
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss">
#productHomeBooking {
  .wrapp__logo {
    text-align: center;
    position: relative;
    padding: 80px 15px;
    border-radius: 10px;
    overflow: hidden;

    img {
      height: 150px;
      max-width: 100%;
    }
  }
}
</style>
