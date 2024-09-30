<template>
  <div id="bookingFormCalendar">
    <!-- Calendar -->
    <vue-cal
      v-bind="vueCalProps"
      :selected-date="selected.date"
      :events="events"
      :split-days="resourcesByDay"
      @view-change="viewChange"
      @cell-click="val => selectShift(val)"
      @event-click="val => selectShift(val)"
    >
      <!-- Custom title -->
      <template #title="{ title, view }">
        <div class="custom-title">
          {{ view.startDate.format('dddd, D MMMM YYYY') }}
          <!-- Calendar to choose the date-->
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="selected.date">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn :label="$tr('isite.cms.label.close')" color="primary"
                       flat v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </div>
      </template>
      <!-- Custom split label-->
      <template #split-label="{ split, view }">
        <div :style="`color: ${split.color}`" v-html="split.label" />
      </template>
    </vue-cal>
    <!-- Confirm Shift Modal-->
    <master-modal v-model="modal.show" :title="'(PT) Turno'"
                  @hide="modal.show = false" :actions="modal.actions">
      <q-form autocorrect="off" autocomplete="off" @submit="addNewEvent"
              @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
      >
        <template v-for="(field, keyField) in modal.dynamicFields" :key="keyField">
          <dynamic-field v-model="formEvent[keyField]" class="q-mx-sm" :field="field" />
        </template>
        <div class="row justify-end">
          <q-btn :label="$tr('isite.cms.label.save')" color="primary"
                 no-caps unelevated rounded type="submit" />
        </div>
      </q-form>
    </master-modal>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { computed, defineComponent, inject } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const startBookTime = '08:00';
const endBookTime = '20:00';
const formatTime = 'HH:mm';
const hourOptions = Array.from({ length: 13 }, (_, index) => index + 8); //from 8h to 20h

export default defineComponent({
  setup ()
  {
    return inject('controller'); // Inject the controller;
  },
  components: { VueCal },
  watch: {
    'formEvent.startDate': function()
    {
      this.defineEndDate();
    }
  },
  data ()
  {
    return {
      vueCalProps: {
        'time-from': parseInt(startBookTime.split(':')[0]) * 60, // start of the day
        'time-to': parseInt(endBookTime.split(':')[0]) * 60, // end of the day
        'time-step': 30,
        'snap-to-time': 15,
        'active-view': 'day',
        'disable-views': ['years', 'year', 'month', 'week'],
        'hide-view-selector': true,
        locale: 'es',
        'stickySplitLabels': true,
        style: 'height: 600px',
        'twelveHour': true,
        'min-date': new Date()
      },
      modal: {
        show: false,
        dynamicFields: {
          startDate: {
            value: null,
            type: 'hour',
            props: {
              label: this.$tr('isite.cms.form.startDate'),
              hourOptions,
              rules: [
                (val) => !!val || this.$tr('isite.cms.message.fieldRequired'),
                (val) => (!!val && (parseInt(val.split(':')[0]) >= hourOptions[0] && parseInt(val.split(':')[0]) <= hourOptions[hourOptions.length - 1])) || `hour should between: 8 - 20`
              ]
            }
          },
          endDate: {
            value: null,
            type: 'hour',
            props: {
              disable: true,
              label: this.$tr('isite.cms.form.endDate')
            }
          }
        }
      },
      formEvent: {}
    };
  },
  computed: {
    //Map the resource to use as split in calendar
    resourcesByDay ()
    {
      //Map the resources
      let resources = this.resources.map((item, index) => ({
        id: item.id,
        label: item.title,
        class: !(index % 2) ? 'resource1' : 'resource2',
        workTimes: (item?.schedule?.workTimes || [])
      }));

      //Move at first the favorite resource
      let selectedIndex = resources.findIndex(item => item.id == this.selected.resourceId);
      if (selectedIndex >= 0)
      {
        const [item] = resources.splice(selectedIndex, 1);
        resources.unshift({ ...item, label: `<span>★</span> ${item.label} <span>★</span>` });
      }

      //Response
      return resources;
    },
    // Map the Reservations to show in the calendar
    events ()
    {
      //Map all the day events
      const events = this.reservations.map(item => ({
        start: item.startDate,
        end: item.endDate,
        title: item.customer ? `${item.customer.firstName} ${item.customer.lastName}` : '-',
        content: item.items.map(item => item.service.title).join(','),
        split: item.resourceId
      }));
      //Include new event
      if (this.newReservation) events.push(this.newReservation);
      //Include the disabled workTimes by resource schedule
      this.resourcesByDay.forEach(resource =>
      {
        this.getDisableSlots(resource.workTimes).forEach(item => events.push({
          start: `${this.selected.date} ${item.startTime}`,
          end: `${this.selected.date} ${item.endTime}`,
          title: '(pt) No Disponible',
          split: resource.id,
          class: 'slot-disabled'
        }));
      });
      //Response
      return events;
    }
  },
  methods: {
    //Handle the event view change from calendar
    viewChange (event)
    {
      this.selected.date = this.$moment(event.startDate).format('YYYY/MM/DD');
      this.nextStep();
    },
    //Return the disable slot
    getDisableSlots (availableSlots)
    {
      //Turn time String "mm:ss" to minutes
      const timeToMinutes = (time) =>
      {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      // Sort the time slots by startTime
      const sortedSlots = availableSlots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      let disableSlots = [];
      let lastEnd = startBookTime;

      // Loop through each time slot and find gaps
      sortedSlots.forEach(workTime =>
      {
        if (this.$moment(this.selected.date).weekday() == workTime.dayId)
        {
          if (timeToMinutes(workTime.startTime) > timeToMinutes(lastEnd)) disableSlots.push({
            startTime: lastEnd, endTime: workTime.startTime
          });
          lastEnd = workTime.endTime;
        }
      });

      // Check for any time after the last slot
      if (timeToMinutes(lastEnd) < timeToMinutes(endBookTime)) disableSlots.push({
        startTime: lastEnd,
        endTime: endBookTime
      });

      //Response
      return disableSlots;
    },
    selectShift (item)
    {
      if (item.start && item.class != 'new-reservation') return null;
      //@clic-cell returns item.date, @clic-event returns item.start
      const startDate = item.start ?? item.date;
      this.formEvent.startDate = this.$moment(startDate)
        .set('minute', (this.$moment(startDate).minutes() >= 30 ? 30 : 0))
        .format(formatTime);
      this.formEvent.split = item.split;
      this.modal.show = true;
    },
    defineEndDate ()
    {
      this.formEvent.endDate = this.$moment(this.formEvent.startDate, formatTime)
        .add(this.selectedInformation.services.reduce((sum, { shiftTime }) => sum + shiftTime, 0), 'minutes')
        .format(formatTime);
    },
    addNewEvent ()
    {
      //Put the data for new reservation
      this.newReservation = {
        start: this.$moment(`${this.selected.date} ${this.formEvent.startDate}`).format('YYYY/MM/DD HH:mm'),
        end: this.$moment(`${this.selected.date} ${this.formEvent.endDate}`).format('YYYY/MM/DD HH:mm'),
        title: this.selected.customerId.fullName,
        content: this.selectedInformation.services.map(item => item.title).join(', '),
        class: 'new-reservation',
        split: this.formEvent.split,
        resourceId: this.formEvent.split
      };

      //Close modal
      this.modal.show = false;
    }
  }
});
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

  .day-split-header {
    span {
      color: $orange
    }
  }

  .vuecal__cell-content {
    cursor: pointer;
  }

  .vuecal__event {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 10px;
    cursor: not-allowed;

    .vuecal__event-time {
      font-weight: bold;
    }
  }

  //----- Custom colors by resources
  .resource1 {
    &.day-split-header {
      color: $teal;
      font-weight: bold;
    }

    &.vuecal__cell-split {
      background-color: rgb($teal, 0.08);
    }

    .vuecal__event {
      background-color: $teal;
    }
  }

  .resource2 {
    &.day-split-header {
      color: $indigo;
      font-weight: bold;
    }

    &.vuecal__cell-split {
      background-color: rgb($indigo, 0.08);
    }

    .vuecal__event {
      background-color: $indigo;
    }
  }

  .slot-disabled {
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba($blue-grey, 0.15) 10px, rgba($blue-grey, 0.15) 20px) !important;
    color: $blue-grey;
    cursor: not-allowed;
  }

  .new-reservation {
    background-color: $orange !important;
    font-weight: bold !important;
    cursor: pointer;
  }
}


</style>
