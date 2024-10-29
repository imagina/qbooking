import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from 'modules/qbooking/_pages/product/resourceWorkspace/services';
import store from 'modules/qbooking/_pages/product/resourceWorkspace/store';
import { i18n } from '../../../../../plugins/utils';

export default function controller (props: any, emit: any)
{
  const proxy = getCurrentInstance()!.appContext.config.globalProperties;

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  };

  // States
  const state = reactive({
    loading: false,
    dynamicFilters: {
      date: {
        type: 'dateRange',
        quickFilter: true,
        props: {
          label: i18n.tr('isite.cms.form.date'),
          clearable: true,
          removeTime: true,
          autoClose: true,
          field: 'start_date'
        }
      }
    },
    showDynamicFilterModal: false,
    filters: {},
    dashboard: null,
    reservations: {
      inProgress: [],
      approved: []
    },
    confirm: {
      showModal: false,
      data: null,
      dynamicField: null,
      items: []
    }
  });

  // Computed
  const computeds = {
    reservationsData: computed(() =>
    {
      //Merge the reservations
      const reservations = [
        ...state.reservations.inProgress.map(item => ({ ...item, isInProgress: true })),
        ...state.reservations.approved
      ];
      //Map the reservations
      return reservations.map(item => ({
        ...item,
        info: {
          customer: {
            icon: 'fal fa-user',
            label: `${item.customer.firstName} ${item.customer.lastName}`
          },
          services: {
            icon: 'fa-light fa-handshake',
            label: item.items.map(item => item.serviceTitle).join(', ')
          },
          time: {
            icon: 'fa-light fa-clock',
            label: i18n.trd(item.startDate, { type: 'time' })
          },
          date: {
            icon: 'fa-light fa-calendar',
            label: i18n.trd(item.startDate, { type: 'dayHuman' })
          }
        }
      }));
    })
  };

  // Methods
  const methods = {
    getData: async (refresh) =>
    {
      state.loading = true;
      await Promise.all([
        //Get in progress reservations
        service.getReservations(refresh, {
          filter: { ...state.filters, statusName: 'INPROGRESS' },
          include: 'customer,items',
          order: { field: 'start_date', way: 'asc' }
        }).then(response => state.reservations.inProgress = response.data),
        //Get in progress reservations
        service.getReservations(refresh, {
          filter: { ...state.filters, statusName: 'APPROVED' },
          include: 'customer,items',
          order: { field: 'start_date', way: 'asc' }
        }).then(response => state.reservations.approved = response.data),
        //Get in progress reservations
        service.getDashboard(refresh, {
          filter: {...state.filters, userResourceId: proxy.$store.state.quserAuth.userId}
        }).then(response => state.dashboard = response.data)
      ]);
      state.loading = false;
    },
    setFilters (val)
    {
      state.filters = val;
      methods.getData(true);
    },
    openConfirmation (reservation)
    {
      state.confirm.data = reservation;
      state.confirm.items = reservation.items.map(item => item.serviceId);
      //Set dynamic field to edit items
      state.confirm.dynamicField = {
        value: [],
        type: 'select',
        props: {
          label: i18n.trp('ibooking.cms.service'),
          useInput: true,
          useChips: true,
          multiple: true
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qbooking.services',
          requestParams: {
            filter: { categoryId: reservation.items[0].categoryId }
          }
        }
      };
      // show modal
      state.confirm.showModal = true;
    },
    completeReservation ()
    {
      state.loading = true;
      //Order the reservation data to update
      let reservationNewData = {
        ...state.confirm.data,
        changeServices: [...state.confirm.items],
        statusName: 'COMPLETED'
      };
      //Request to update service
      service.updateReservation(reservationNewData).then(response =>
      {
        methods.getData(true);
      }).catch(error => state.loading = false);
    }
  };

  // Mounted
  onMounted(() =>
  {

  });

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods, store };
}
