<template>
  <q-layout id="layoutBooking" view="lHh LpR lFf">
    <!-- HEADER -->
    <div
      id="bookingHeader"
      :class="{ 'header-bottom-mobile': $q.screen.lt.md }"
    >
      <q-btn-group push class="q-mx-auto">
        <!--Menu-->
        <template v-for="(item, key) in menu" :key="key">
          <!-- Button with submenu -->
          <q-btn
            v-bind="{ ...propsMenuButton, ...(item.itemProps ?? {}) }"
            :icon="item.icon"
            :label="$q.screen.gt.sm ? $tr(item.title) : ''"
          >
            <q-menu v-if="item.children && item.children.length">
              <q-list style="min-width: 150px">
                <q-item
                  v-for="(subItem, keySItem) in item.children"
                  :key="keySItem"
                  clickable
                  v-bind="subItem.itemProps"
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon :name="subItem.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ $tr(subItem.title) }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <!--Separator-->
          <q-separator vertical class="q-my-xs" color="gray-4" />
        </template>
        <!-- Session menu -->
        <q-btn
          v-bind="propsMenuButton"
          icon="fa-light fa-user"
          :label="$q.screen.gt.sm ? $tr('isite.cms.label.profile') : ''"
        >
          <q-menu
            anchor="bottom right"
            self="top right"
            :offset="[0, 18]"
            class="tw-rounded-2xl tw-shadow-none tw-top-3 tw-border-2 tw-border-gray-100 tw-py-5"
          >
            <div
              class="tw-mb-5 tw-mx-5"
              :class="{ 'tw-text-center': profileImage.mediumThumb }"
            >
              <q-avatar
                v-if="profileImage.mediumThumb"
                size="84px"
                class="tw-mb-2.5"
              >
                <img :src="profileImage.mediumThumb" />
              </q-avatar>
              <div class="tw-font-bold tw-text-base">
                {{ quserState.userData.fullName }}
              </div>
              <div class="ellipsis text-caption tw-text-gray-500">
                {{
                  quserState.userData.roles.map((role) => role.name).join(', ')
                }}
              </div>
            </div>
            <div class="column">
              <template v-for="(btn, keyAction) in profileActions">
                <q-btn
                  :key="keyAction"
                  class="tw-px-5"
                  v-bind="{ ...defaultButtonProps, ...btn.props }"
                  v-if="btn?.vIf != undefined ? btn.vIf : true"
                  v-close-popup
                  @click="btn.action != undefined ? btn.action() : null"
                />
              </template>
            </div>
          </q-menu>
        </q-btn>
      </q-btn-group>
    </div>

    <!-- ROUTER VIEW -->
    <q-page-container class="layout-padding">
      <router-view v-if="appState.loadPage" />
    </q-page-container>
  </q-layout>
</template>

<script>
import siteActions from 'modules/qsite/_components/master/siteActions';
import sidebar from 'src/setup/sidebar';

export default {
  name: 'iadminLayout',
  components: { siteActions },
  mounted() {
    this.$nextTick(() => this.init());
  },
  data() {
    return {
      propsMenuButton: {
        size: '15px',
        padding: '14px 20px',
        'no-caps': true,
        color: 'brown-11',
        'text-color': 'grey-14',
      },
      menu: [],
      profileActions: [
        {
          name: 'clearCache',
          props: {
            label: this.$tr('isite.cms.configList.clearCache'),
            icon: 'fa-light fa-broom',
            id: 'clearCacheButton',
          },
          action: () =>
            this.$router.push({
              name: 'app.update.app',
              query: { fromCache: 1 },
            }),
        },
        {
          name: 'logout',
          props: {
            label: this.$tr('isite.cms.configList.signOut'),
            icon: 'fa-light fa-right-from-bracket',
            textColor: 'red',
          },
          action: () => this.$router.push({ name: 'auth.logout' }),
        },
      ],
    };
  },
  computed: {
    appState() {
      return this.$store.state.qsiteApp;
    },
    quserState() {
      return this.$store.state.quserAuth;
    },
    profileImage() {
      return this.$store.getters['quserAuth/profileImage'];
    },
    defaultButtonProps() {
      return {
        rounded: true,
        dense: true,
        color: 'white',
        unelevated: true,
        class: 'btn-small',
        textColor: 'blue-grey',
        noCaps: true,
      };
    },
  },
  methods: {
    init() {
      this.menu = this.validateMenu(sidebar);
    },
    validateMenu(menu) {
      return menu
        .map((item) => {
          let isValid = true;

          // Apply routing props
          item.itemProps = {};
          if (item.toRoute) {
            item.itemProps.href = item.toRoute;
          } else if (item.name) {
            item.itemProps.to = { name: item.name, params: item.params || {} };
          }

          // Handle children (only one level deep)
          if (Array.isArray(item.children)) {
            item.children = this.validateMenu(item.children);
            if (item.children.length === 0) isValid = false;
          } else {
            if (!item.activated || !item.name) isValid = false;
            if (item.permission && !this.$hasAccess(item.permission)) {
              isValid = false;
            }
          }

          return isValid ? item : null;
        })
        .filter((item) => item !== null);
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #F4E1D2;
}

#bookingHeader {
  position: fixed;
  z-index: 999;
  padding: 10px;
  top: 0;
  left: 0;
  right: 0;
  max-width: max-content;
  margin-left: auto;
  margin-right: auto;

  #header__toolbar {
    border-radius: 15px;
  }

  .q-btn{
    background-color: #D9B9A1 !important;
    color: #4A4A47 !important;
  }
}

@media (max-width: 767px) {
  #bookingHeader.header-bottom-mobile {
    top: auto !important;
    bottom: 0 !important;
  }

  .q-page-container {
    padding-bottom: 70px;
    padding-top: 10px !important;
  }
}

.q-page-container {
  padding-top: 70px;
}
</style>
