import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from '../agenda/services';
import store from '../agenda/store';
import { i18n, array } from 'src/plugins/utils';
import moment from 'moment/moment';
import colorCell from 'modules/qsite/_components/master/contentType/colorCell.vue';

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
        tableProps: {
          dense: true
        },
        title: i18n.tr('ibooking.cms.sidebar.panelReservations'),
        columns: [
          {
            name: 'id',
            label: 'ID',
            field: 'id',
            align: 'left'
          },
          {
            name: 'resource',
            label: i18n.tr('isite.cms.label.resource'),
            field: 'items',
            align: 'left',
            format: val => val.length ? val[0].resource.title : '-'
          },
          {
            name: 'service',
            label: i18n.trp('isite.cms.label.service'),
            field: 'items',
            align: 'left',
            format: val => val.length ? val.map(item => item.service.title).join(',') : '-'
          },
          {
            name: 'customer',
            label: i18n.tr('isite.cms.label.customer'),
            field: 'customer',
            align: 'left',
            format: val => val ? `${val.firstName} ${val.lastName}` : '-'
          },
          {
            name: 'statusModel',
            label: i18n.tr('isite.cms.form.status'),
            field: 'statusModel',
            style: 'padding: 0px 5px',
            component: colorCell,
            dynamicField: row =>
            {
              return {
                name: 'status',
                type: 'select',
                props: {
                  label: i18n.tr('isite.cms.form.status'),
                  options: array.select(row.statusModel?.nextStatus ?? [])
                }
              };
            }
          },
          {
            name: 'startDate',
            label: i18n.tr('isite.cms.label.date'),
            field: 'startDate',
            align: 'left',
            format: val => val ? i18n.trd(val, { type: 'dayHuman' }) : '-'
          },
          {
            name: 'startTime',
            label: i18n.tr('isite.cms.startTime'),
            field: 'startDate',
            align: 'left',
            format: val => val ? i18n.trd(val, { type: 'time' }) : '-'
          },
          {
            name: 'endTime',
            label: i18n.tr('isite.cms.endTime'),
            field: 'endDate',
            align: 'left',
            format: val => val ? i18n.trd(val, { type: 'time' }) : '-'
          },
          {
            name: 'shiftTime',
            label: i18n.tr('isite.cms.shiftTime'),
            field: 'humanShiftTime',
            align: 'left'
          },
          {
            name: 'price',
            label: i18n.tr('isite.cms.label.price'),
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
        filters: {
          date: {
            type: 'dateRange',
            quickFilter: true,
            props: {
              label: 'Date',
              clearable: true,
              removeTime: true,
              autoClose: true,
              field: 'start_date'
            }
          },
          resourceId: {
            value: [],
            type: 'select',
            quickFilter: true,
            props: {
              label: i18n.tr('isite.cms.label.resource'),
              clearable: true,
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.resources'
            }
          },
          serviceId: {
            value: [],
            type: 'select',
            quickFilter: true,
            props: {
              label: i18n.tr('isite.cms.label.service'),
              clearable: true,
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.services'
            }
          },
          customerId: {
            type: 'select',
            props: {
              label: i18n.tr('isite.cms.label.customer'),
              clearable: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.users',
              select: { label: 'fullName', id: 'id' }
            }
          },
          status: {
            value: [],
            type: 'select',
            props: {
              label: i18n.tr('isite.cms.form.status'),
              clearable: true,
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.statuses'
            }
          }
        },
        help: {}
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
