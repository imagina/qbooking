<template>
  <div id="masterFooter">
    <q-footer class="shadow-2">
      <div id="footerContent" class="row q-md-hide items-center">
        <q-toolbar id="toolbarTop">
          <q-btn icon="fas fa-bars" unelevated
                 class="text-white buttonToogleMenuClose"
                 @click="eventBus.emit('toggleMasterDrawer','menu')" />
          <q-toolbar-title />
          <!--Site Actions-->
          <site-actions :replace-actions="replaceActions" />
        </q-toolbar>
      </div>
    </q-footer>
  </div>
</template>
<script>
import { eventBus } from 'src/plugins/utils';
import siteActions from 'modules/qsite/_components/master/siteActions';

export default {
  props: {},
  components: { siteActions },
  mounted() {
    this.$nextTick(function() {

    });
  },
  data() {
    return {
      eventBus,
      replaceActions: {
        buttons: [],
        menu: [
          //Profile
          {
            name: 'clearCache',
            props: {
              label: this.$tr('isite.cms.configList.clearCache'),
              icon: 'fa-light fa-broom',
              round: false,
              square: true,
              align: 'left',
              id: 'clearCacheButton'
            },
            action: () => this.$router.push({
              name: 'app.update.app',
              query: { fromCache: 1 }
            })
          },
          //logout
          {
            name: 'logout',
            props: {
              label: this.$tr('isite.cms.configList.signOut'),
              icon: 'fa-light fa-right-from-bracket',
              round: false,
              square: true,
              textColor: 'red',
              align: 'left'
            },
            action: () => this.$router.push({ name: 'auth.logout' })
          }
        ]
      }
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss">
#footerContent {
}
</style>
