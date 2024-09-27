<template>
  <div id="bookingFormComponent" class="relative-position">
    <!--Header Stepper-->
    <q-tab-panels v-model="step" animated>
      <q-tab-panel v-for="(item , index) in steps" :key="index"
                   :name="item.value" class="text-center">
        <!--Title-->
        <div class="text-weight-bold text-subtitle1 text-grey-8">{{ item.title }}</div>
        <!--Description-->
        <div class="text-grey-8">{{ item.description }}</div>
      </q-tab-panel>
    </q-tab-panels>
    <!--controller tabs-->
    <div class="text-center q-mb-md">
      <q-option-group v-model="step" inline dense size="30px"
                      :options="steps" disable />
    </div>
    <!--Booking content-->
    <div class="row q-col-gutter-md">
      <!--Stepper content-->
      <div class="col-8">
        <q-tab-panels v-model="step" animated ref="stepsForm" keep-alive>
          <!--Step Category-->
          <q-tab-panel name="category">
            <div class="row q-col-gutter-sm">
              <div v-for="(category, keyCategory) in categories" :key="keyCategory" class="col-12"
                   @click="selectItem('categoryId', category.id)">
                <div :class="`item-selectable ${isValueSelected('categoryId',category.id)}`">
                  <!--Icon-->
                  <q-icon name="fas fa-layer-group" />
                  <!--Title-->
                  <label>{{ category.title }}</label>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <!--Step Service-->
          <q-tab-panel name="service">
            <div class="row q-col-gutter-sm">
              <div v-for="(service, keyService) in services" :key="keyService" class="col-12"
                   @click="selectItem('serviceId',service.id)">
                <div :class="`item-selectable row items-center ${isValueSelected('serviceId',service.id)}`">
                  <!--Icon-->
                  <q-icon name="fas fa-concierge-bell" />
                  <!--Description-->
                  <div class="text-left">
                    <label class="text-grey-6 text-caption"> {{ service.category.title }} </label>
                    <div>{{ service.title }}</div>
                    <div class="text-grey-6 text-caption">
                      {{ service.humanShiftTime }}
                    </div>
                    <div class="text-caption">
                      $ {{ $trn(service.price) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <!--Step Resource-->
          <q-tab-panel name="resource">
            <div class="row q-col-gutter-sm">
              <div v-for="(resource, keyResource) in resources" :key="keyResource" class="col-12"
                   @click="selectItem('resourceId', resource.id)">
                <div :class="`item-selectable row items-center ${isValueSelected('resourceId', resource.id)}`">
                  <!--icon-->
                  <q-icon name="fas fa-chess-knight" />
                  <!--Description-->
                  <div class="text-left">
                    <div>{{ resource.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <!--availability-->
          <q-tab-panel name="availability">
            <calendar @openModal="val => openModal(val)"
                      @updateEvent="val => updateNewEvent(val)"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <!--Resume-->
      <div class="col-4">
        <resume />
        <pre>{{selected}}</pre>
      </div>
    </div>
    <!-- Inner loading-->
    <inner-loading :visible="loading" />
  </div>
</template>
<script lang="ts">
import { defineComponent, provide } from 'vue';
import controller from 'modules/qbooking/_components/bookingForm/controller';
import resume from 'modules/qbooking/_components/bookingForm/views/resume.vue';
import calendar from 'modules/qbooking/_components/bookingForm/views/calendar.vue';

export default defineComponent({
  props: {},
  components: { resume, calendar },
  setup (props, { emit })
  {
    // Initialize the controller instance
    const controllerInstance = controller(props, emit);
    // Provide the controller for child components
    provide('controller', controllerInstance);
    // Return the controller instance to make it available to the template
    return controllerInstance;
  }
});
</script>
<style lang="scss">
#bookingFormComponent {
  .item-selectable {
    cursor: pointer;
    padding: 15px;
    border: 2px solid $grey-4;
    border-radius: $custom-radius;
    color: $grey-9;
    line-height: 1.2;

    &.selected {
      border: 2px solid $primary;
    }

    .q-icon {
      background-color: $grey-4;
      border-radius: 50%;
      color: white;
      height: 40px;
      width: 40px;
      font-size: 18px;
      margin-right: 15px;
    }

    label {
      color: $grey-9;
      cursor: pointer;
    }
  }

  .chip-selectable {
    cursor: pointer;
    border: 2px solid $grey-4;
    border-radius: $custom-radius;
    color: $grey-9;
    padding: 5px 10px;

    &.selected {
      border: 2px solid $primary;
    }
  }

  .q-tab-panel {
    padding: 0 !important;
  }
}
</style>
