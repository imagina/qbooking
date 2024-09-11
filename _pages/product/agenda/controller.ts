import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from '../agenda/services';
import store from '../agenda/store';
import { i18n } from 'src/plugins/utils';

export default function controller (props: any, emit: any)
{
  const proxy = getCurrentInstance()!.appContext.config.globalProperties;

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  };

  // States
  const state = reactive({
    listConfig: {
      apiRoute: 'apiRoutes.qbooking.reservations',
      permission: 'ibooking.reservations',
      search: true,
      create: {
        title: i18n.tr('isite.cms.new')
      },
      read: {
        title: i18n.tr('ibooking.cms.sidebar.panelReservations'),
        columns: [
          {
            name: 'resource',
            label: i18n.tr('isite.cms.label.resource'),
            field: 'items',
            align: 'left',
            format: val => val.length ? val[0].resourceTitle : '-'
          },
          {
            name: 'service',
            label: i18n.trp('isite.cms.label.service'),
            field: 'items',
            align: 'left',
            format: val => val.length ? val.map(item => item.serviceTitle).join('/') : '-'
          },
          {
            name: 'customer',
            label: i18n.tr('isite.cms.label.customer'),
            field: 'customer',
            align: 'left',
            format: val => val ? `${val.firstName} ${val.lastName}` : '-'
          },
          {
            name: 'statusName',
            label: i18n.tr('isite.cms.form.status'),
            field: 'statusName',
            align: 'left'
          },
          {
            name: 'startDate',
            label: i18n.tr('isite.cms.label.hour'),
            field: 'items',
            align: 'left',
            format: val => val.length ? i18n.trd(val[0].startDate, { type: 'time' }) : '-'
          },
          {
            name: 'startDate',
            label: i18n.tr('isite.cms.label.day'),
            field: 'items',
            align: 'left',
            format: val => val.length ? i18n.trd(val[0].startDate, { type: 'dayHuman' }) : '-'
          },
          {
            name: 'estimateTime',
            label: '(pt) Tiempo Estimado',
            field: 'items',
            align: 'left',
            format: val => '-'
          },
          {
            name: 'spendTime',
            label: '(pt) Duración',
            field: 'items',
            align: 'left',
            format: val => '-'
          },
          {
            name: 'price',
            label: '(pt) Precio',
            field: 'items',
            align: 'left',
            format: val =>
            {
              let total = 0;
              val.forEach(item => total += item.price);
              return `$ ${i18n.trn(total)}`;
            }
          }
        ],
        requestParams: {
          include: 'customer,items.service,items.resource',
          filter: { orderByItemsDate: true }
        },
        filters: {},
        help: {}
      },
      beforeUpdate: ({ val, row }) =>
      {
      }
    }
  });

  // Computed
  const computeds = {
    // key: computed(() => {})
  };

  // Methods
  const methods = {
    // methodKey: () => {}
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
