<template>
  <div id="bookingFormCalendar">
    <!-- Calendar -->
    <vue-cal
      v-bind="vueCalProps"
      :selected-date="selected.date"
      :events="events"
      :split-days="resourcesByDay"
      @event-drop="updateNewEvent"
      @view-change="viewChange"
      @cell-click="selectShift"
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
    </vue-cal>
    <!-- Confirm Shift Modal-->
    <master-modal v-model="modal.show" :title="'(PT) Turno'"
                  @hide="modal.show = false" :actions="modal.actions">
      <q-form autocorrect="off" autocomplete="off" @submit="addNewEvent"
              @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
      >
        <div class="row">
          <div v-for="(field, keyField) in modal.dynamicFields" :key="keyField" :class="field.class">
            <dynamic-field v-model="formEvent[keyField]" class="q-mx-sm" :field="field" />
          </div>
        </div>
        <div class="row justify-end">
          <q-btn :label="$tr('isite.cms.label.save')" color="primary"
                 no-caps unelevated rounded type="submit" />
        </div>
      </q-form>
    </master-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const formatTime = 'HH:mm';
//TODO: define available schedule
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
        'time-from': 8 * 60, // start of the day
        'time-to': 20 * 60, // end of the day
        'time-step': 30,
        'snap-to-time': 15,
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
        'min-date': new Date() // TODO: this is not working for active-view day
      },
      modal: {
        show: false,
        dynamicFields: {
          startDate: {
            value: null,
            type: 'hour',
            class: 'col-6',
            props: {
              label: this.$tr('isite.cms.form.startDate'),
              hourOptions,
              rules: [
                (val) => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          endDate: {
            value: null,
            type: 'hour',
            class: 'col-6',
            props: {
              disable: true,
              label: this.$tr('isite.cms.form.endDate')
            }
          },
          customerId: {
            value: null,
            class: 'col-12',
            type: 'crud',
            permission: 'profile.user.index',
            props: {
              crudType: 'select',
              crudData: import('modules/quser/_crud/users'),
              crudProps: {
                label: this.$tr('isite.cms.label.customer'),
                rules: [
                  (val) => !!val || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'fullName',
                  value: 'id'
                },
                loadedOptions: (data) => this.customers = data
              }
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
      return this.resources.map(item => ({ id: item.id, label: item.title, class: '' }));
    },
    // Map the Reservations to show in the calendar
    events ()
    {
      const events = this.reservations.map(item => ({
        start: item.startDate,
        end: item.endDate,
        title: item.customer ? `${item.customer.firstName} ${item.customer.lastName}` : '-',
        content: item.items.map(item => item.service.title).join(','),
        class: '',
        split: item.resourceId
      }));
      //Include new event
      if (this.newEvent) events.push(this.newEvent);
      //Response
      return events;
    },
    reservation ()
    {
      const customer = this.formEvent?.customerId ? this.customers.find(item => item.id == this.formEvent.customerId) : false;
      const title = customer ? `${customer?.firstName} ${customer?.lastName}` : '-';
      const resource = this.resources.find(item => item.id == this.formEvent.split);
      const content = this.selectedInformation.services.map(item => item.title).join(', ');
      const time = this.selectedInformation.services.reduce((sum, { shiftTime }) => sum + shiftTime, 0);
      const isReady = this.newEvent?.start && this.newEvent?.end && this.selected?.resourceId && this.formEvent?.customerId;
      return { title, resource, content, time, isReady };
    }
  },
  methods: {
    //Handle the event view change from calendar
    viewChange (event)
    {
      this.selected.date = this.$moment(event.startDate).format('YYYY/MM/DD');
      this.nextStep();
    },
    selectShift (item)
    {
      this.formEvent.startDate = this.$moment(item.date)
        .set('minute', (this.$moment(item.date).minutes() >= 30 ? 30 : 0))
        .format(formatTime);
      this.formEvent.split = item.split;
      this.modal.show = true;
    },
    defineEndDate ()
    {
      this.formEvent.endDate = this.$moment(this.formEvent.startDate, formatTime)
        .add(this.reservation.time, 'minutes')
        .format(formatTime);
    },
    addNewEvent ()
    {
      const selectedDate = this.$moment(new Date(this.selected.date)).format('YYYY/MM/DD');
      const startDate = this.$moment(`${selectedDate} ${this.formEvent.startDate}`).format('YYYY/MM/DD HH:mm');
      const endDate = this.$moment(`${selectedDate} ${this.formEvent.endDate}`).format('YYYY/MM/DD HH:mm');
      this.selected.resourceId = this.formEvent.split;
      this.newEvent = {
        start: startDate,
        end: endDate,
        title: this.reservation.title,
        content: this.reservation.content,
        class: '',
        split: this.formEvent.split
      };
      this.selected.startDate = startDate;
      this.selected.endDate = endDate;
      this.modal.show = false;
    },
    updateNewEvent ({ event, originalEvent })
    {
      //update resource
      this.formEvent.split = event.split;
      this.selected.resourceId = event.split;
      this.newEvent.split = event.split;
      //update the date
      this.newEvent.start = this.$moment(event.start).format('YYYY/MM/DD HH:mm');
      this.newEvent.end = this.$moment(event.end).format('YYYY/MM/DD HH:mm');
      this.selected.startDate = this.newEvent.start;
      this.selected.endDate = this.newEvent.end;
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
}
</style>
