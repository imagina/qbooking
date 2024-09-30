<template>
  <div id="adminAgendaPage">
    <!--Dynamic List-->
    <dynamic-list :list-config="listConfig" @new="showBookingForm = true"
                  ref="dynamicListComponent" />
    <!-- Booking Form -->
    <master-modal v-model="showBookingForm"
                  :title="$tr('ibooking.cms.newReservation')"
                  custom-position
    >
      <booking-form @created="reservationCreated" />
    </master-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from '../agenda/controller';

//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';
import bookingForm from 'modules/qbooking/_components/bookingForm/index.vue';

export default defineComponent({
  props: {},
  components: { dynamicList, bookingForm },
  setup (props, { emit })
  {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
</style>
