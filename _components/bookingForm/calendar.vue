<template>
  <div id="bookingFormCalendar">
    <vue-cal
      v-bind="vueCalProps"
      :selected-date="selectedDate"
      :events="events"
      :split-days="splitDays"
      @event-change="(val) => {console.log(val)}"
      @view-change="(event) => selectedDate = $moment(event.startDate).format('YYYY/MM/DD')"
    >
      <!-- Custom title -->
      <template #title="{ title, view }">
        <div class="custom-title">
          {{ view.startDate.format('dddd, D MMMM YYYY') }}
          <!-- Calendar to choose the date-->
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn :label="$tr('isite.cms.label.close')" color="primary" flat v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </div>
      </template>
    </vue-cal>
  </div>
</template>
<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { moment } from '../../../../plugins/utils';

export default {
  emits: ['updateDate'],
  props: {
    splitDays: { type: Array },
    events: { type: Array, default: () => ([]) }
  },
  components: { VueCal },
  watch: {
    selectedDate(newValue) {
      this.$emit('updateDate', newValue)
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      data: [],
      selectedDate: moment().format('YYYY/MM/DD'),
      vueCalProps: {
        'time-from': 8 * 60, //start of the day
        'time-to': 20 * 60, //end of the day
        'time-step': 30,
        'active-view': 'day',
        'disable-views': ['years', 'year', 'month', 'week'],
        'editable-events': {
          title: false,
          drag: true,
          resize: false,
          delete: true,
          create: true
        },
        'hide-view-selector': true,
        locale: 'es',
        'stickySplitLabels': true,
        style: 'height: 600px',
        'todayButton': true,
        'min-date': new Date() //TODO: this is not working for active-view day
      }
    };
  },
  computed: {},
  methods: {
    init() {
    }
  }
};
</script>
<style lang="scss">
#bookingFormCalendar {
  .vuecal__title-bar {
    background-color: $primary;
    color: white;

    .custom-title {
      cursor: pointer;
      font-size: 16px;
    }
  }
}
</style>
