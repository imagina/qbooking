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
          <div class="box box-auto-height q-mb-md">
            <div class="text-center text-h3 q-mb-md text-green">
              {{ dashboard.reservations.quantity }}
            </div>
            <q-separator class="q-mb-sm" />
            <q-item class="q-pa-none">
              <q-item-section>
                <div class="text-green text-bold">{{ $trp('ibooking.cms.reservation') }}</div>
                <div class="text-caption"> {{ '$' + $trn(dashboard.reservations.total) }}</div>
              </q-item-section>
              <q-item-section side>
                <q-avatar color="green" text-color="white" icon="fa-light fa-check-to-slot" />
              </q-item-section>
            </q-item>
          </div>
          <!-- By Services -->
          <div class="box">
            <!-- Title -->
            <div class="text-center q-mb-md">
              <q-avatar size="lg" color="blue" text-color="white"
                        icon="fa-light fa-handshake" class="q-mb-xs" />
              <div class="text-blue text-bold">
                {{ $trp('ibooking.cms.service') }}
              </div>
            </div>
            <!-- Information -->
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
        <!--By Resource-->
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-md">
            <div v-for="(resource, resourceName) in dashboard.serviceByResource"
                 :key="resourceName" class="col-12 col-md-4">
              <div class="box">
                <!-- Title -->
                <div class="text-center q-mb-md">
                  <q-avatar size="lg" color="deep-purple" text-color="white"
                            icon="fa-light fa-chess-knight" class="q-mb-xs" />
                  <div class="text-deep-purple text-bold">
                    {{ resourceName }}
                  </div>
                </div>
                <!-- Information -->
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
</style>
