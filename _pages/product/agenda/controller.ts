import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from '../agenda/services';
import store from '../agenda/store';
import { i18n, array } from 'src/plugins/utils';


export default function controller (props: any, emit: any)
{
  const proxy = getCurrentInstance()!.appContext.config.globalProperties;

  // Refs
  const refs = {
    dynamicListComponent: ref()
  };

  // States
  const state = reactive({
    listConfig: {
      apiRoute: 'apiRoutes.qbooking.reservations',
      permission: 'ibooking.reservations',
      search: true,
      pageActions: {
        extraActions: ['search', 'new']
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
            contentType: (row) => {
              return {
                template: 'colorCell',
                props: {
                  label: row.statusModel.title,
                  color: row.statusModel.color,
                  icon: row.statusModel.icon
                }
              }
            } ,
            dynamicField: row =>
            {
              return {
                name: 'status',
                type: 'select',
                props: {
                  label: i18n.tr('isite.cms.form.status'),
                  options: [
                    { label: row.statusModel.title, value: row.statusModel.id },
                    ...array.select(row.statusModel?.nextStatus ?? [])
                  ]
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
          order: { field: 'start_date', way: 'asc' }
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
          },
          categoryId: {
            value: [],
            type: 'select',
            quickFilter: true,
            props: {
              label: i18n.tr('isite.cms.form.category'),
              clearable: true,
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.categories'
            }
          }
        },
        help: {}
      }
    },
    showBookingForm: false
  });

  // Computed
  const computeds = {
    // key: computed(() => {})
  };

  // Methods
  const methods = {
    reservationCreated: () =>
    {
      state.showBookingForm = false;
      refs.dynamicListComponent.value.getData({ page: 1 }, true);
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
