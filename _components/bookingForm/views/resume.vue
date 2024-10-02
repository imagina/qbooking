<template>
  <div id="bookingFormResume">
    <!-- Customer -->
    <div>
      <div class="top-content">
        {{ $tr('isite.cms.label.customer') }}
        <q-btn icon="fa-light fa-pen" round outline size="xs"
               @click="editSection('customer')" />
      </div>
      <div v-if="selected.customerId">
        {{ selected.customerId.fullName }}
      </div>
      <q-separator class="q-my-sm" />
    </div>

    <!-- Category -->
    <div v-if="selected.categoryId">
      <div class="top-content">
        {{ $tr('isite.cms.label.category') }}
        <q-btn icon="fa-light fa-pen" round outline size="xs"
               :disabled="!selected?.customerId"
               @click="editSection('category')" />
      </div>
      <div v-if="selectedInformation.category">
        {{ selectedInformation.category.title }}
      </div>
      <q-separator class="q-my-sm" />
    </div>

    <!-- Services -->
    <div v-if="selected.serviceId.length">
      <div class="top-content">
        {{ $trp('isite.cms.label.service') }}
        <q-btn icon="fa-light fa-pen" round outline size="xs"
               :disabled="!selected.categoryId"
               @click="editSection('service')" />
      </div>
      <template v-for="(service, index) in selectedInformation.services"
                :key="index">
        <div class="row justify-between no-wrap q-my-sm">
          <div>
            {{ service.title }}
            <div class="text-caption text-blue-grey">
              {{ service.humanShiftTime }}
            </div>
          </div>
          <div> ${{ $trn(service.price) }}</div>
        </div>
      </template>
      <q-separator class="q-my-sm" />
    </div>

    <!-- Resource -->
    <div v-if="selectedInformation.resource">
      <div class="top-content">
        {{ $tr('isite.cms.label.resource') }}
        <q-btn icon="fa-light fa-pen" round outline size="xs"
               :disabled="!selected.serviceId.length"
               @click="editSection('resource')" />
      </div>
      <div>
        {{ selectedInformation.resource.title }}
      </div>
      <q-separator class="q-my-sm" />
    </div>

    <!-- Availability -->
    <div v-if="newReservation">
      <div class="top-content">
        {{ $tr('ibooking.cms.shift') }}
      </div>
      <div>
        {{ $trd(newReservation.start, { type: 'dayHuman' }) }} <br>
        {{ $trd(newReservation.start, { type: 'time' }) }}
      </div>
    </div>

    <!-- Total -->
    <div v-if="selected.serviceId.length">
      <q-separator class="q-mb-sm q-mt-xl" />
      <div class="row justify-between text-bold">
        <span>Total:</span>
        <span>${{ $trn(selectedInformation.services.reduce((total, item) => total + item.price, 0)) }}</span>
      </div>
    </div>

    <!--Actions-->
    <div class="q-mt-lg">
      <!--Next step-->
      <q-btn color="primary" unelevated rounded :label="$tr('isite.cms.label.continue')"
             class="full-width" :disabled="!allowNext"
             @click="nextStep" v-if="step != 'availability'" />
      <!--Book step-->
      <q-btn color="green" unelevated rounded :label="$tr('ibooking.cms.book')"
             class="full-width" v-else-if="newReservation"
             @click="createReservation" />
    </div>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';

export default defineComponent({
  setup(props) {
    // Inject the controller from the parent
    return inject('controller');
  },
  computed: {},
  methods: {
    //Edit especific section
    editSection(section) {
      //Action by step
      //TODO: reset start/end date and customerId
      switch (section) {
        case'customer':
          this.selected.categoryId = null;
          this.selected.serviceId = [];
          this.selected.resourceId = null;
          this.newReservation = null;
          this.selected.startDate = null;
          this.selected.endDate = null;
          break;
        case'category':
          this.selected.serviceId = [];
          this.selected.resourceId = null;
          this.newReservation = null;
          this.selected.startDate = null;
          this.selected.endDate = null;
          break;
        case'service':
          this.selected.resourceId = null;
          this.newReservation = null;
          this.selected.startDate = null;
          this.selected.endDate = null;
          break;
        case'resource':
          this.newReservation = null;
          this.selected.startDate = null;
          this.selected.endDate = null;
          break;
      }
      //Next step
      this.stepsForm.goTo(section);
    }
  }
});
</script>

<style lang="scss">
#bookingFormResume {
  padding: 15px;
  border: 2px solid $grey-4;
  border-radius: $custom-radius;

  .top-content {
    color: $blue-grey;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
