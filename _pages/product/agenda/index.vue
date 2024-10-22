<template>
  <div id="adminAgendaPage">
    <!--Dynamic List-->
    <dynamic-list :list-config="listConfig" @new="showBookingForm = true"
                  ref="dynamicListComponent" />
    <!-- Booking Form -->
    <master-modal v-model="showBookingForm" custom-position
                  :title="$tr('ibooking.cms.newReservation')">
      <booking-form @created="reservationCreated" :update-reservation="rowToUpdate" />
    </master-modal>
    <!-- Customer Form -->
    <master-modal v-model="showCustomerForm" custom-position
                  :title="$tr('ibooking.cms.updateReservation')">
      <customer-form @chooseCustomer="changeCustomer" />
    </master-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from '../agenda/controller';

//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';
import bookingForm from 'modules/qbooking/_components/bookingForm/index.vue';
import customerForm from 'modules/qbooking/_components/bookingForm/views/customer.vue';

export default defineComponent({
  props: {},
  components: { dynamicList, bookingForm, customerForm },
  setup (props, { emit })
  {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
</style>
