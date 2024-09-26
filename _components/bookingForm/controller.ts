import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from 'modules/qbooking/_components/bookingForm/services';
import store from 'modules/qbooking/_components/bookingForm/store';
import { i18n, alert, moment } from 'src/plugins/utils';

export default function controller (props: any, emit: any)
{
  const proxy = getCurrentInstance()!.appContext.config.globalProperties;


  const hourOptions = Array.from({length: 13}, (_, index) => index + 8) //from 8h to 20h 
  const minuteOptions = [ 0, 15, 30, 45 ];

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
    formEvent: {},
    modal: {
      show: false,
      dynamicFields: {
        startDate: {
          value: null,
          type: 'hour',
          class: 'col-6',
          props: {
            label: i18n.tr('isite.cms.form.startDate'),
            hourOptions,
            minuteOptions,
            rules: [
              (val) => !!val || i18n.tr("isite.cms.message.fieldRequired"),
              (val) => (!!val && (parseInt(val.split(':')[0]) >= hourOptions[0] && parseInt(val.split(':')[0]) <= hourOptions[hourOptions.length -1]) )  || `hour should between: 8 - 20`,
              (val) => (!!val && minuteOptions.includes(parseInt(val.split(':')[1]))) || `minutes should be: ${minuteOptions}`
            ],
          }
        },
        endDate: {          
          value: null,
          type: 'hour',
          class: 'col-6',
          props: {
            disable: true,
            label: i18n.tr('isite.cms.form.endDate'),
          }
        },
        customerId: {
          value: null,
          class: 'col-6',
          type: "crud",
          permission: 'profile.user.index',
          props: {
            crudType: "select",
            crudData: import("modules/quser/_crud/users"),
            crudProps: {
              label: i18n.tr('isite.cms.label.customer'),
              rules: [
                (val) => !!val || i18n.tr("isite.cms.message.fieldRequired"),
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: "fullName",
                value: "id",
              },
              loadedOptions: (data) => state.customers = data
            },
          },
        },
      }
    },
    availabilities: [],
    selected: {
      categoryId: null,
      serviceId: [],
      resourceId: null,
      date: moment().format('YYYY/MM/DD'),
      availabilityId: null
    },
    dynamicFields: {
      availabilityDate: {
        value: null,
        type: 'date',
        props: {
          label: i18n.tr('isite.cms.label.date'),
          hintAsHuman: true
        }
      }
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
        state.resources.find(item => item.id == state.selected.resourceId),
      availability: !state.selected.availabilityId ? null :
        state.availabilities.find(item => item.id == state.selected.availabilityId)
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
    }),
    resourcesByDay: computed(() =>
    {
      return state.resources.map(item => ({ id: item.id, label: item.title, class: '' }));
    }),
    events: computed(() =>
    {
      const events =  state.reservations.map(item => ({
        start: item.startDate,
        end: item.endDate,
        title: item.customer? `${item.customer.firstName} ${item.customer.lastName}` : '-',
        content: item.items.map(item => item.service.title).join(','),
        class: '',
        split: item.resourceId
      }))
      if(state.newEvent) events.push(state.newEvent)
      return events
    }),
    
    reservation: computed(() => {
      const customer = state.formEvent?.customerId ? state.customers.find(item => item.id == state.formEvent.customerId) : false
      const title = customer ? `${customer?.firstName} ${customer?.lastName}` : '-'
      const resource = state.resources.find(item => item.id == state.formEvent.split)
      const content = computeds.selectedInformation.value.services.map(item => item.title).join(', ')
      const time = computeds.selectedInformation.value.services.reduce(( sum, { shiftTime } ) => sum + shiftTime, 0)
      const isReady = state.newEvent?.start && state.newEvent?.end && state.selected?.resourceId && state.formEvent?.customerId
      return {title, resource, content, time, isReady}
    }),
    
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
          state.newEvent = null
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
    //Edit especific section
    editSection (section)
    {
      //Action by step
      switch (section)
      {
        case'category':
          state.selected.serviceId = [];
          state.selected.resourceId = null;
          state.selected.availabilityId = null;
          state.newEvent = null
          break;
        case'service':
          state.selected.resourceId = null;
          state.selected.availabilityId = null;
          state.newEvent = null
          break;
        case'resource':
          state.selected.availabilityId = null;
          state.newEvent = null
          break;
      }
      //Next step
      refs.stepsForm.value.goTo(section);
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
    },

    addNewEvent(){
      const selectedDate = moment(new Date(state.selected.date)).format('YYYY/MM/DD')
      const startDate = moment(`${selectedDate} ${state.formEvent.startDate}`).format('YYYY/MM/DD HH:mm')
      const endDate = moment(`${selectedDate} ${state.formEvent.endDate}`).format('YYYY/MM/DD HH:mm')
      state.selected.resourceId = state.formEvent.split 
      state.newEvent = {
        start: startDate,
        end: endDate,
        title: computeds.reservation.value.title,
        content: computeds.reservation.value.content,
        class: '',
        split: state.formEvent.split 
      }
    },
    updateNewEvent({event, originalEvent}){
      //update resource
      state.formEvent.split = event.split
      state.selected.resourceId = event.split
      state.newEvent.split = event.split
      //update the date
      state.newEvent.start = moment(event.start).format('YYYY/MM/DD HH:mm')
      state.newEvent.end = moment(event.end).format('YYYY/MM/DD HH:mm')
    },
    openModal (item){
      if(item){      
        let date = moment(item.date).format('YYYY/MM/DD HH:mm')
        const minutes = moment(date).minutes()
        //set minutes
        date = moment(date).set('minute', (minutes >= 30 ? 30 : 0))
        const endDate = moment(date).add(computeds.reservation.value.time, 'minutes')

        state.formEvent.startDate = moment(date).format('HH:mm')
        state.formEvent.endDate = moment(endDate).format('HH:mm')
        state.formEvent.split = item.split        
      }
      state.modal.show = true
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
