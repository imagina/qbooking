import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from 'modules/qbooking/_components/bookingForm/services';
import store from 'modules/qbooking/_components/bookingForm/store';
import { i18n, alert, moment } from 'src/plugins/utils';

export default function controller (props: any, emit: any)
{
  const proxy = getCurrentInstance()!.appContext.config.globalProperties;

  // Refs
  const refs = {
    stepsForm: ref()
  };

  // States
  const state = reactive({
    loading: false,
    step: 'category',
    steps: [
      {
        value: 'category',
        title: i18n.tr('ibooking.cms.titleStepCategory'),
        description: i18n.tr('ibooking.cms.descriptionStepCategory'),
        label: '',//kepp this to work with q-option
        required: 'categoryId'
      },
      {
        value: 'service',
        title: i18n.tr('ibooking.cms.titleStepService'),
        description: i18n.tr('ibooking.cms.descriptionStepService'),
        label: '',//kepp this to work with q-option
        required: 'serviceId'
      },
      {
        value: 'resource',
        title: i18n.tr('ibooking.cms.titleStepResource'),
        description: i18n.tr('ibooking.cms.descriptionStepResource'),
        label: ''//kepp this to work with q-option
      },
      {
        value: 'availability',
        title: i18n.tr('ibooking.cms.titleStepAvailability'),
        description: i18n.tr('ibooking.cms.descriptionStepAvailability'),
        label: '',//kepp this to work with q-option
        required: 'availabilityId'
      }
    ],
    categories: [],
    services: [],
    resources: [],
    reservations: [],
    newEvent: null,
    selected: {
      categoryId: null,
      serviceId: [],
      resourceId: null,
      date: moment().format('YYYY/MM/DD'),
      startDate: null,
      endDate: null,
      customerId: null
    },
    customers: [] //store the loaded customers
  });

  // Computed
  const computeds = {
    //Return the selected information
    selectedInformation: computed(() => ({
      category: !state.selected.categoryId ? null :
        state.categories.find(item => item.id == state.selected.categoryId),
      services: !state.selected.serviceId ? null :
        state.services.filter(item => state.selected.serviceId.includes(item.id)),
      resource: !state.selected.resourceId ? null :
        state.resources.find(item => item.id == state.selected.resourceId)
    })),
    // Validate if current step is allow to continue
    allowNext: computed(() =>
    {
      //Get the data of current step
      let currentStep = state.steps.find(item => item.value == state.step);
      let requiredSelected = currentStep?.required ?? null;
      //Validate if has required and is selected
      if (requiredSelected)
      {
        let selected = state.selected[requiredSelected];
        if (Array.isArray(selected)) return selected.length;
        else return selected;
      }
      //Default response
      return true;
    })
  };

  // Methods
  const methods = {
    //Get categories
    getData: (serviceName, stateName, { refresh, params }) =>
    {
      state.loading = true;
      //Request Services
      service[serviceName](refresh, params)
        .then(response =>
        {
          state[stateName] = response.data;
          state.loading = false;
        }).catch(error => state.loading = false);
    },
    //Select item
    selectItem (stateName, value)
    {
      //Validate if is an array put a new value or remove a duplicate
      if (Array.isArray(state.selected[stateName]))
      {
        const index = state.selected[stateName].indexOf(value);
        if (index === -1) state.selected[stateName].push(value);
        else state.selected[stateName].splice(index, 1);
      } else
      {
        //Validate if step is not required, then allow unselec item
        if (state.selected[stateName] == value)
        {
          const step = state.steps.find(item => item.value == state.step);
          if (!step.required) state.selected[stateName] = null;
        } else state.selected[stateName] = value;//Put the select item
      }
    },

    // Validate if item (category,service,resource) is selected
    isValueSelected: (stateName, value) =>
    {
      let isSelected = false;
      //Validated if is selected
      if (Array.isArray(state.selected[stateName]))
      {
        if (state.selected[stateName].includes(value)) isSelected = true;
      } else if (state.selected[stateName] == value) isSelected = true;

      //Response
      return isSelected ? 'selected' : '';
    },
    //Go to next step
    nextStep: () =>
    {
      //Action by step
      switch (state.step)
      {
        case'category':
          methods.getData('getServices', 'services', {
            refresh: true, params: state.selected.categoryId
          });
          break;
        case'service':
          methods.getData('getResources', 'resources', {
            refresh: true, params: state.selected.serviceId
          });
          break;
        case'resource':
        case'availability':
          state.newEvent = null;
          methods.getData('getReservations', 'reservations', {
            refresh: true, params: {
              include: 'customer,items.service',
              filter: {
                resourceId: state.selected.resourceId,
                date: {
                  field: 'start_date',
                  from: state.selected.date,
                  to: state.selected.date
                }
              }
            }
          });
          break;
      }
      //Next step
      if (state.step != 'availability') refs.stepsForm.value.next();
    },
    //Create the reservation
    createReservation ()
    {
      state.loading = true;
      //Get the availability
      //const availability = computeds.selectedInformation.value.availability;
      //Instance the reservation data

      let reservationData = {
        startDate: state.newEvent.start,
        endDate: state.newEvent.end,
        customerId: state.formEvent.customerId,
        //resourceId: computeds.selectedInformation.value.resource.title,
        //resourceTitle: computeds.selectedInformation.value.resource.title
        items: computeds.selectedInformation.value.services.map(item => ({
          serviceId: item.id,
          serviceTitle: item.title,
          categoryId: item.category.id,
          categoryTitle: item.category.title,
          price: item.price,
          resourceId: computeds.selectedInformation.value.resource.id,
          resourceTitle: computeds.selectedInformation.value.resource.title
        }))
      };
      //Request
      service.createReservation(reservationData).then(response =>
      {
        alert.info({ message: `${i18n.tr('isite.cms.message.recordCreated')}` });
        state.loading = false;
        emit('created');
      }).catch(error =>
      {
        alert.error({ message: `${i18n.tr('isite.cms.message.recordNoCreated')}` });
        state.loading = false;
      });
    }
  };

  // Mounted
  onMounted(() =>
  {
    methods.getData('getCategories', 'categories', {
      refresh: true, params: {}
    });
  });

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods, store };
}
