<template>
  <div id="ReservationDashboardPage" class="relative-position">
    <div class="q-mb-md">
      <!--Page Actions-->
      <page-actions :title="$tr('ibooking.cms.sidebar.dashboard')"
                    @refresh="getDashboard(true)"
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
    <!--Content-->
    <div v-if="dashboard && dashboard.reservations.quantity">
      <div class="row q-col-gutter-md">
        <!--General-->
        <div class="col-12 col-md-4">
          <!--Total-->
          <div class="box q-mb-md">
            <!-- Title -->
            <div class="text-center bg-green-1 q-pa-md">
              <q-icon name="fa-light fa-check-to-slot" size="md" color="green" />
              <div class="text-green text-bold">
                {{ $trp('ibooking.cms.reservation') }}
              </div>
            </div>
            <!-- Resumen -->
            <div class="resume row">
              <div class="col">
                <div class="text-caption">Total</div>
                <div class="text-green text-bold">{{ '$' + $trn(dashboard.reservations.total) }}</div>
              </div>
              <q-separator vertical color="green-1" size="2px" />
              <div class="col">
                <div class="text-caption">{{ $trp('isite.cms.label.customer') }}</div>
                <div class="text-green text-bold">{{ dashboard.reservations.quantity }}</div>
              </div>
              <div class="col-12">
                <q-separator color="green-1" size="2px" />
              </div>
            </div>
            <!-- Information -->
            <div class="q-pa-md">
              <q-list separator>
                <q-item v-for="(category, index) in dashboard.reservationsByCategory" :key="index"
                        class="q-pa-none">
                  <q-item-section>
                    <div class="text-blue-grey text-bold">{{ category.category }}</div>
                    <div class="text-caption"> {{ '$' + $trn(category.total) }}</div>
                  </q-item-section>
                  <q-item-section side>{{ category.quantity }}</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <!-- By Services -->
          <div class="box">
            <!-- Title -->
            <div class="text-center bg-blue-1 q-pa-md">
              <q-icon name="fa-light fa-handshake" size="md" color="blue" />
              <div class="text-blue text-bold">
                {{ $trp('ibooking.cms.service') }}
              </div>
            </div>
            <!-- Information -->
            <div class="q-pa-md">
              <q-list separator>
                <q-item v-for="(service, index) in dashboard.services" :key="index"
                        class="q-pa-none">
                  <q-item-section>
                    <div class="text-blue-grey text-bold">{{ service.service }}</div>
                    <div class="text-caption"> {{ '$' + $trn(service.total) }}</div>
                  </q-item-section>
                  <q-item-section side>{{ service.quantity }}</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
        <!--By Resource-->
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-md">
            <div v-for="(resource, resourceName) in dashboard.serviceByResource"
                 :key="resourceName" class="col-12 col-md-4">
              <div class="box">
                <!-- Title -->
                <div class="text-center bg-deep-purple-1 q-pa-md">
                  <q-icon name="fa-light fa-chess-knight" size="md" color="deep-purple" />
                  <div class="text-deep-purple text-bold">
                    {{ resourceName }}
                  </div>
                </div>
                <!-- Resumen -->
                <div class="resume row">
                  <div class="col">
                    <div class="text-caption">Total</div>
                    <div class="text-deep-purple text-bold">
                      {{ '$' + $trn(resource.reduce((acc, item) => acc + item.total, 0)) }}
                    </div>
                  </div>
                  <q-separator vertical color="deep-purple-1" size="2px" />
                  <div class="col">
                    <div class="text-caption">{{ $trp('isite.cms.label.customer') }}</div>
                    <div class="text-deep-purple text-bold">
                      {{ dashboard.reservationsByResource[resourceName].quantity }}
                    </div>
                  </div>
                  <div class="col-12">
                    <q-separator color="deep-purple-1" size="2px" />
                  </div>
                </div>
                <!-- Information -->
                <div class="q-pa-md">
                  <q-list separator>
                    <q-item v-for="(service, index) in resource" :key="index"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Empty-->
    <not-result v-else />
    <!--Inner loading-->
    <inner-loading :visible="loading" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from 'modules/qbooking/_pages/product/dashboard/controller';
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
#ReservationDashboardPage {
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
}
</style>
