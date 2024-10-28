<template>
  <div id="resourceWorkspacePage" class="relative-position">
    <!--Page Actions-->
    <div class="q-mb-md">
      <!--Page Actions-->
      <page-actions :title="$tr('ibooking.cms.sidebar.resourceWorkspace')"
                    @refresh="getData(true)"
                    :dynamic-filter="dynamicFilters"
                    @toggleDynamicFilterModal="showDynamicFilterModal = true" />
      <!-- dynamicFilter -->
      <dynamicFilter
        systemName="bookingReservationDashboard"
        :modelValue="showDynamicFilterModal"
        :filters="dynamicFilters"
        @showModal="showDynamicFilterModal = true"
        @hideModal="showDynamicFilterModal = false"
        @update:modelValue="setFilters"
      />
    </div>
    <!-- Content -->
    <div class="row q-col-gutter-md">
      <!-- Dashboard -->
      <div class="col-12 col-md-4" v-if="dashboard">
        <div class="box">
          <!-- Title -->
          <div class="text-center bg-deep-purple-1 q-pa-md">
            <q-icon name="fa-light fa-handshake" size="md" color="deep-purple" />
            <div class="text-deep-purple text-bold">
              {{ $trp('ibooking.cms.service') }}
            </div>
          </div>
          <!-- Resumen -->
          <div class="resume row">
            <div class="col">
              <div class="text-caption">Total</div>
              <div class="text-deep-purple text-bold">
                {{ '$' + $trn(dashboard.reservations.data.total || 0) }}
              </div>
            </div>
            <q-separator vertical color="deep-purple-1" size="2px" />
            <div class="col">
              <div class="text-caption">{{ $trp('isite.cms.label.customer') }}</div>
              <div class="text-deep-purple text-bold">
                {{ dashboard.reservations.data.quantity }}
              </div>
            </div>
            <div class="col-12">
              <q-separator color="deep-purple-1" size="2px" />
            </div>
          </div>
          <!-- Information -->
          <div class="q-pa-md">
            <q-list separator>
              <q-item v-for="(service, index) in dashboard.services.data" :key="index"
                      class="q-pa-none" active>
                <q-item-section>
                  <q-item-section>
                    <div class="text-blue-grey text-bold">{{ service.service }}</div>
                    <div class="text-caption"> {{ '$' + $trn(service.total) }}</div>
                  </q-item-section>
                </q-item-section>
                <q-item-section side>{{ service.quantity }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <!-- Description -->
          <div class="desciption-content">
            <q-icon name="fa-light fa-circle-info" size="sm" />
            <div v-html="dashboard.services.description"></div>
          </div>
        </div>
      </div>
      <!-- Reservations-->
      <div class="col-12 col-md-8">
        <!-- In Porgress -->
        <div class="row q-col-gutter-md">
          <div v-for="(item, key) in reservationsData" :key="key" class="col-12 col-md-4">
            <div class="box">
              <div class="q-pa-md">
                <!-- Status -->
                <div class="text-center text-bold" :style="`color: ${item.statusModel.color}`">
                  <q-icon :name="item.statusModel.icon" size="sm" class="q-mb-xs" />
                  <div>{{ item.statusModel.title }}</div>
                </div>
                <q-separator class="q-my-md" />
                <!-- Info -->
                <div v-for="(element, key) in item.info">
                  <q-icon :name="element.icon" class="q-mr-sm" color="green" />
                  {{ element.label }}
                </div>
              </div>
              <!--Actions-->
              <q-btn v-if="item.isInProgress" class="full-width" color="green"
                     @click="openConfirmation(item)" unelevated no-caps>
                {{ $tr('ibooking.cms.complete') }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal confirm complete-->
    <q-dialog v-model="confirm.showModal">
      <div class="box bg-white" style="padding: 0 !important;">
        <!-- Title -->
        <div class="text-center bg-deep-purple-1 q-pa-md">
          <q-icon name="fa-light fa-handshake" size="md" color="deep-purple" />
          <div class="text-deep-purple text-bold">
            {{ $trp('ibooking.cms.service') }}
          </div>
        </div>
        <div class="q-pa-md">
          <div class="q-mb-md"> {{ $tr('ibooking.cms.confirmServicesToComplete') }}</div>
          <dynamic-field v-model="confirm.items" :field="confirm.dynamicField" />
          <div class="row q-gutter-xs justify-end">
            <q-btn unelevated :label="$tr('isite.cms.label.cancel')" color="grey"
                   v-close-popup />
            <q-btn unelevated :label="$tr('isite.cms.label.save')" color="green"
                   v-close-popup @click="completeReservation" />
          </div>
        </div>
      </div>
    </q-dialog>
    <!--Inner loading-->
    <inner-loading :visible="loading" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from 'modules/qbooking/_pages/product/resourceWorkspace/controller';
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';

export default defineComponent({
  props: {},
  components: { dynamicFilter },
  setup (props, { emit })
  {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
#resourceWorkspacePage {
  .box {
    padding: 0 !important;
    max-height: max-content !important;
  }

  .resume {
    .col {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 15px;
    }
  }

  .desciption-content {
    background-color: $cyan-1;
    text-align: center;
    line-height: 1.2;
    padding: 15px;

    .q-icon {
      color: $cyan;
    }

    div {
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>
