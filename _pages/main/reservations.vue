<template>
  <div id="reservationsPage">
    <!--Calendar-->
    <div v-if="view == 'calendar'" class="relative-position">
      <!-- Page actions -->
      <page-actions :title="$tr($route.meta.title)" :extra-actions="extraPageActions" @refresh="getData(true)"
                    @new="$router.push({name : 'qbooking.panel.reservations.create'})" class="q-mb-md" />
      <!--Calendar-->
      <calendar v-if="reservationsCalendar.length" :events-data="reservationsCalendar" />
      <!--Empty result-->
      <div v-else class="box row items-center justify-center">
        <not-result />
      </div>
      <!--Inner loading-->
      <inner-loading :visible="loading" />
    </div>
    <!--Crud-->
    <crud v-else :crud-data="import('modules/qbooking/_crud/reservations')" :title="$tr($route.meta.title)" />
  </div>
</template>
<script>
//Components
import calendar from 'modules/qsite/_components/master/calendar';

export default {
  props: {},
  components: { calendar },
  watch: {},
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      view: config('app.mode') == 'ipanel' ? 'calendar' : 'crud',
      reservationsCalendar: []
    };
  },
  computed: {
    //Extra Page actions
    extraPageActions() {
      return [
        'search',
        'new',
        {//action to turn view type
          label: this.$tr(`isite.cms.label.view`),
          vIf: false,
          props: {
            icon: this.view == 'calendar' ? 'fas fa-list-ul' : 'fas fa-calendar-alt'
          },
          action: () => {
            this.view = (this.view == 'calendar') ? 'crud' : 'calendar';
          }
        }
      ];
    }
  },
  methods: {
    init() {
      this.getData();
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'reservation.customer,meetings',
            filter: config('app.mode') == 'iadmin' ? {} : { userId: this.$store.state.quserAuth.userId }
          }
        };
        //Request
        this.$crud.index('apiRoutes.qbooking.reservationItems', requestParams).then(response => {
          this.mapReservations(response.data);
          this.loading = false;
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false;
          });
        });
      });
    },
    //Map the reservations data
    mapReservations(data) {
      this.reservationsCalendar = data.reverse().map(item => {
        return {
          icon: 'fas fa-calendar',
          color: 'primary',
          date: item.startDate,
          title: item.serviceTitle,
          mainDetails: [
            { value: `${this.$tr('isite.cms.form.status')}: ${item.statusName}` },
            {
              icon: 'fas fa-play-circle',
              value: `${item.reservation.customer?.firstName || ''} ${item.reservation.customer?.lastName || ''}`
            },
            { icon: 'fas fa-play-circle', value: item.categoryTitle },
            { icon: 'fas fa-play-circle', value: item.resourceTitle }
          ],
          card: {
            title: this.$tr('isite.cms.label.meet'),
            component: import('modules/qbooking/_components/crud/reservationCard'),
            row: item
          }
        };
      });
    }
  }
};
</script>
<style lang="scss">
</style>
