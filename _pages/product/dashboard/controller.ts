import { computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue';
import service from 'modules/qbooking/_pages/product/dashboard/services';
import store from 'modules/qbooking/_pages/product/dashboard/store';
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
    dashboard: null,
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
    filters: {}
  });

  // Computed
  const computeds = {
    // key: computed(() => {})
  };

  // Methods
  const methods = {
    getDashboard: (refresh = false) =>
    {
      state.loading = true;
      service.getDashboard(refresh, { filter: state.filters }).then(response =>
      {
        state.dashboard = response.data;
        state.loading = false;
      }).catch(error => state.loading = false);
    },
    setFilters (val)
    {
      state.filters = val;
      methods.getDashboard(true);
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
