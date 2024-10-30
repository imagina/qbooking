<template>
  <div id="ReservationDashboardPage" class="relative-position">
    <!--Page Actions-->
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
    <div v-if="dashboard && dashboard.reservations.data.quantity">
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
                <div class="text-green text-bold">{{ '$' + $trn(dashboard.reservations.data.total) }}</div>
              </div>
              <q-separator vertical color="green-1" size="2px" />
              <div class="col">
                <div class="text-caption">{{ $trp('isite.cms.label.customer') }}</div>
                <div class="text-green text-bold">{{ dashboard.reservations.data.completedQuantity }}</div>
              </div>
              <div class="col-12">
                <q-separator color="green-1" size="2px" />
              </div>
            </div>
            <!-- Information -->
            <div class="q-pa-md">
              <q-list separator>
                <q-item v-for="(category, index) in dashboard.reservationsByCategory.data" :key="index"
                        class="q-pa-none">
                  <q-item-section>
                    <div class="text-blue-grey text-bold">{{ category.category }}</div>
                    <div class="text-caption"> {{ '$' + $trn(category.total) }}</div>
                  </q-item-section>
                  <q-item-section side>{{ category.quantity }}</q-item-section>
                </q-item>
              </q-list>
            </div>
            <!-- Description -->
            <div class="desciption-content">
              <q-icon name="fa-light fa-circle-info" size="sm" />
              <div v-html="dashboard.reservations.description"></div>
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
                <q-item v-for="(service, index) in dashboard.services.data" :key="index"
                        class="q-pa-none">
                  <q-item-section>
                    <div class="text-blue-grey text-bold">{{ service.service }}</div>
                    <div class="text-caption"> {{ '$' + $trn(service.total) }}</div>
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
        <!--By Resource & Category-->
        <div class="col-12 col-md-8">
          <!-- Statuses By Category-->
          <div class="row q-col-gutter-md q-mb-md">
            <div v-for="(category, categoryName) in dashboard.statusByCategory.data"
                 :key="categoryName" class="col-12 col-md-4">
              <div class="box">
                <!-- Title -->
                <div class="text-center bg-deep-orange-1 q-pa-md">
                  <q-icon name="fa-light fa-layer-group" size="md" color="deep-orange" />
                  <div class="text-deep-orange text-bold">
                    {{ categoryName }}
                  </div>
                </div>
                <!-- Information -->
                <div class="q-pa-md">
                  <q-list separator>
                    <q-item v-for="(item, index) in category" :key="index"
                            class="q-pa-none" active>
                      <q-item-section>
                        <q-item-section>
                          <div :style="`color: ${item.status.color}`">
                            <q-icon :name="item.status.icon" :color="item.status.color" class="q-mr-xs" />
                            {{ item.status.title }}
                          </div>
                          <div class="text-caption"> {{ '$' + $trn(item.total) }}</div>
                        </q-item-section>
                      </q-item-section>
                      <q-item-section side>{{ item.quantity }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
          </div>
          <!--By Resource-->
          <div class="row q-col-gutter-md">
            <div v-for="(resource, resourceName) in dashboard.serviceByResource.data"
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
                      {{ dashboard.reservationsByResource.data[resourceName].quantity }}
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
                <!-- Description -->
                <div class="desciption-content">
                  <q-icon name="fa-light fa-circle-info" size="sm" />
                  <div v-html="dashboard.serviceByResource.description"></div>
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

  .desciption-content {
    background-color: $cyan-1;
    text-align: center;
    line-height: 1.2;
    padding: 15px;

    .q-icon{
      color: $cyan;
    }

    div {
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>
