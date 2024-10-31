<template>
  <div id="masterAdminHeader">
    <!-- HEADER -->
    <q-header>
      <!-- Toolbar  -->
      <div class="q-hide q-md-show">
        <q-toolbar id="toolbarTop">
          <q-btn icon="fas fa-bars" unelevated
                 class="text-primary buttonToogleMenuClose" @click="eventBus.emit('toggleMasterDrawer','menu')" />
          <q-toolbar-title />
          <!--Site Actions-->
          <site-actions :replace-actions="replaceActions" />
        </q-toolbar>
      </div>
    </q-header>
  </div>
</template>
<script>
//Components
import siteActions from 'modules/qsite/_components/master/siteActions';
import { eventBus } from 'src/plugins/utils';

export default {
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
#masterAdminHeader {
  .q-header {
    background-color: white;

    .buttonToogleMenuClose {
      position: absolute;
      top: 8px;
      left: 5px;
    }
  }

  #toolbarTop {
    position: relative;
  }
}
</style>
