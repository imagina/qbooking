import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from '../agenda/services';
import store from '../agenda/store';
import { i18n, array, moment } from 'src/plugins/utils';


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
            field: 'resource',
            align: 'left',
            format: val => val?.title ?? '-',
            dynamicField: row =>
            {
              return {
                name: 'resourceId',
                type: 'select',
                props: {
                  label: i18n.tr('isite.cms.label.resource')
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qbooking.resources',
                  requestParams: {
                    filter: { serviceId: row.items.map(item => item.serviceId) }
                  }
                }
              };
            }
          },
          {
            name: 'items',
            label: i18n.trp('isite.cms.label.service'),
            field: 'items',
            align: 'left',
            format: val => val.length ? val.map(item => item.service.title).join(',') : '-',
            dynamicField: row =>
            {
              return {
                name: 'changeServices',
                type: 'select',
                mapValue: value => value?.serviceId,
                props: {
                  label: i18n.tr('isite.cms.label.resource'),
                  useInput: true,
                  useChips: true,
                  multiple: true
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qbooking.services',
                  requestParams: {
                    filter: { categoryId: row.items[0].categoryId }
                  }
                }
              };
            }
          },
          {
            name: 'customer',
            label: i18n.tr('isite.cms.label.customer'),
            field: 'customer',
            align: 'left',
            format: val => val ? `${val.firstName} ${val.lastName}` : '-',
            onClick: (val, row) =>
            {
              state.rowToUpdate = row;
              state.showCustomerForm = true;
            }
          },
          {
            name: 'statusModel',
            label: i18n.tr('isite.cms.form.status'),
            field: 'statusModel',
            align: 'left',
            format: val => `<i class="${val.icon}" style="color: ${val.color}" /> <span>${val.title}</span>`,
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
            format: val => val ? i18n.trd(val, { type: 'time' }) : '-',
            dynamicField: {
              name: 'startTime',
              type: 'hour',
              mapValue: value =>
              {
                let timeMoment = moment(value, 'YYYY-MM-DD HH:mm:ss', true);
                return timeMoment.isValid() ? timeMoment.format('HH:mm') : value;
              },
              props: {
                label: i18n.tr('isite.cms.startTime')
              }
            }
          },
          {
            name: 'endTime',
            label: i18n.tr('isite.cms.endTime'),
            field: 'endDate',
            align: 'left',
            format: val => val ? i18n.trd(val, { type: 'time' }) : '-',
            dynamicField: {
              name: 'endTime',
              type: 'hour',
              mapValue: value =>
              {
                let timeMoment = moment(value, 'YYYY-MM-DD HH:mm:ss', true);
                return timeMoment.isValid() ? timeMoment.format('HH:mm') : value;
              },
              props: {
                label: i18n.tr('isite.cms.endTime')
              }
            }
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
            format: (val, row) =>
            {
              let total = 0;
              val.forEach(item => total += item.price);

              let config = row.transactions.length ?
                { color: '#007bff', icon: 'fal fa-check-square' } :
                { color: '#f39c12', icon: 'fal fa-hourglass-half' };

              return `<i class="${config.icon}" style="color: ${config.color}" /> <span>$ ${i18n.trn(total)}</span>`;
            },
            dynamicField: row =>
            {
              if (row.transactions.length) return null;
              return {
                name: 'pocketId',
                type: 'select',
                props: {
                  label: i18n.tr('iwallet.cms.pocket')
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qwallet.pockets'
                }
              };
            }
          }
        ],
        requestParams: {
          include: 'customer,items.service,resource,transactions',
          order: { field: 'start_date', way: 'desc' }
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
        }
      },
      beforeUpdate: ({ val, row, fieldName }) =>
      {
        return new Promise(resolve =>
        {
          switch (fieldName)
          {
            case'startTime':
              row.startDate = `${moment(row.startDate).format('YYYY-MM-DD')} ${val}`;
              break;
            case'endTime':
              row.endDate = `${moment(row.endDate).format('YYYY-MM-DD')} ${val}`;
              break;
          }

          resolve(row);
        });
      }
    },
    showBookingForm: false,
    showCustomerForm: false,
    rowToUpdate: null
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
    },
    // Update the reservation customer
    changeCustomer: (customer) =>
    {
      //Use the dynamicList to update the row
      refs.dynamicListComponent.value.updateRow({
        ...state.rowToUpdate,
        customerId: customer.id
      });
      //Reset values
      state.showCustomerForm = false;
      state.rowToUpdate = null;
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
