<template>
  <div id="crudCardAppoinments">
    <!--Card content-->
    <div class="box box-auto-height" v-if="rowData">
      <!--Resource data-->
      <div class="resource-content">
        <!--Label-->
        <div class="text-grey-6 text-caption">
          {{ rowData.categoryTitle }}, {{ rowData.serviceTitle }}
        </div>
        <!--Resource-->
        <div class="q-mb-xs">{{ rowData.resourceTitle }}</div>
        <!--Shifts date-->
        <div class="text-blue">
          {{ $trd(rowData.startDate, {type: 'shortHuman'}) }}
        </div>
      </div>
      <!--Separator-->
      <q-separator class="q-my-sm"/>
      <!--Status data-->
      <div class="customer-content">
        <!--Title-->
        <div class="q-mb-xs">{{ $tr('isite.cms.form.status') }}</div>
        <!--full name-->
        <div class="text-grey-6 text-caption">
          {{ rowData.statusName }}
        </div>
      </div>
      <!--Separator-->
      <q-separator class="q-my-sm"/>
      <!--Customer data-->
      <div class="customer-content" v-if="rowData.reservation && rowData.reservation.customer">
        <!--Title-->
        <div class="q-mb-xs">{{ $tr('isite.cms.label.customer') }}</div>
        <!--full name-->
        <div class="text-grey-6 text-caption">
          {{ rowData.reservation.customer.firstName }} {{ rowData.reservation.customer.lastName }}
        </div>
      </div>
      <!--Separator-->
      <q-separator class="q-my-sm" v-if="rowData.meetings.length"/>
      <!--Meet data-->
      <div v-if="rowData.meetings.length" class="meet-content">
        <div class="row q-gutter-y-sm">
          <q-btn v-for="(meet, keyMeet) in rowData.meetings" :key="keyMeet" :label="meet.btnLabel"
                 unelevated rounded color="primary" class="full-width" @click="$helper.openExternalURL(meet.meetUrl)"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    row: {default: false},
    permitAction: {default: false},
    fieldActions: {default: false}
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      configApp: config('app'),
      loading: false,
      showAllInfo: false,
      showConversation: false
    }
  },
  computed: {
    rowData() {
      let rowData = this.$clone(this.row)

      //parse meet data
      if (rowData.meetings.length) {
        rowData.meetings = rowData.meetings.map(meet => {
          return {
            ...meet,
            meetUrl: (this.$store.state.quserAuth.userId == rowData.reservation.customerId) ? meet.joinUrl : meet.starUrl,
            btnLabel: this.$tr('isite.cms.label.goTo', {string: meet.providerName})
          }
        })
      }

      //Response
      return rowData
    }
  },
  methods: {
    init() {

    }
  }
}
</script>
<style lang="scss">
</style>
