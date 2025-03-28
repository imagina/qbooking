<template>
  <div id="panelReservationForm">
    <!--No Allow-->
    <div v-if="!allowPublicReservation">
      <not-found/>
    </div>
    <!--Content-->
    <div v-else class="q-container">
      <!--Success content-->
      <div class="box text-center" v-if="successReserve">
        <div class="q-py-lg">
          <q-icon name="fas fa-check-circle" color="green" size="50px" class="q-mb-md"/>
          <div class="text-grey-8 q-mb-md">
            <div class="text-h5">
              ¡{{ $tr('isite.cms.label.reserved') }} {{ reservationData ? `#${reservationData.id}` : '' }}!
            </div>
            <div v-if="reservationData"> {{ $tr('isite.cms.label.state') }}: {{ reservationData.statusName }}</div>
          </div>
          <!-- Reservation Items-->
          <div v-if="reservationData" class="q-px-sm q-mb-md">
            <q-list bordered separator>
              <q-item v-for="(item, keyItem) in reservationData.items" :key="keyItem">
                <q-item-section class="text-grey-9 text-left">
                  <q-item-label v-if="item.categoryTitle"> {{ item.categoryTitle }}</q-item-label>
                  <q-item-label v-if="item.serviceTitle">{{ item.serviceTitle }}</q-item-label>
                  <q-item-label v-if="item.resourceTitle">{{ item.resourceTitle }}</q-item-label>
                  <q-item-label v-if="item.startDate" class="q-pt-sm">
                    {{ $trd(item.startDate, {type: 'long'}) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator class="q-mb-md"/>
          <!--Action-->
          <div class="row q-gutter-md justify-center">
            <q-btn :label="$tr('ibooking.cms.newReservation')" color="blue" rounded unelevated
                   @click="actionAfterReservation(true)" flat/>
            <q-btn :label="$tr('isite.cms.label.finalize')" color="green" rounded unelevated
                   @click="actionAfterReservation()" flat/>
          </div>
        </div>
      </div>
      <!--Form content-->
      <div class="box relative-position" v-else>
        <!--Title-->
        <div class="col-12 text-primary text-weight-bold text-subtitle1 text-center q-mb-md">
          {{ $tr('ibooking.cms.newReservation') }}
        </div>
        <!--Resource data-->
        <q-banner v-if="resourceData" id="bannerResourceData" class="bg-primary text-white">
          <template v-slot:avatar>
            <div
              class="resource-image img-as-bg"
              :style="`background-image : url('${resourceData?.mediaFiles?.mainimage.path}')`"
            />
          </template>
          <div class="ellipsis text-weight-bold">{{ resourceData.title }}</div>
          <div class="ellipsis-2-lines text-caption" v-html="resourceData.description"/>
        </q-banner>
        <!--Separator-->
        <q-separator v-else class="q-mb-sm"/>
        <!--Header Stepper-->
        <q-tab-panels v-model="step" animated>
          <q-tab-panel v-for="(stepName , keyName) in steps" :key="keyName" :name="stepName" class="text-center">
            <!--Title-->
            <div class="text-weight-bold text-subtitle1 text-grey-8">{{ headerSteps[stepName].title }}</div>
            <!--Description-->
            <div class="text-grey-8">{{ headerSteps[stepName].description }}</div>
          </q-tab-panel>
        </q-tab-panels>
        <!--controller tabs-->
        <div class="text-center q-mb-md">
          <q-option-group v-model="step" inline dense size="30px" :options="optionsRadioTabs" disable/>
        </div>
        <!--Stepper content-->
        <q-tab-panels v-model="step" animated ref="stepsForm" keep-alive>
          <!--Step Category-->
          <q-tab-panel name="category">
            <q-scroll-area style="height: 350px; width: 100%;">
              <div class="row q-col-gutter-sm">
                <div v-for="(category, keyCategory) in categories" :key="keyCategory" class="col-12"
                     @click="selectItem('categoryId',category.id)">
                  <div :class="`item-selectable ${classSelected('categoryId',category.id)}`">
                    <!--Icon-->
                    <q-icon name="fas fa-layer-group"/>
                    <!--Title-->
                    <label>{{ category.title }}</label>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-tab-panel>
          <!--Step Service-->
          <q-tab-panel name="service">
            <q-scroll-area style="height: 350px; width: 100%;">
              <div class="row q-col-gutter-sm">
                <div v-for="(service, keyService) in services" :key="keyService" class="col-12"
                     @click="selectItem('serviceId',service.id)">
                  <div :class="`item-selectable row items-center ${classSelected('serviceId',service.id)}`">
                    <!--Icon-->
                    <q-icon name="fas fa-concierge-bell"/>
                    <!--Description-->
                    <div class="text-left">
                      <div>{{ service.title }}</div>
                      <label class="text-grey-6 text-caption"> {{ selected.category.title }} </label>
                    </div>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-tab-panel>
          <!--Step Form Service-->
          <q-tab-panel v-if="serviceForm.id" name="formService">
            <q-scroll-area style="height: 350px; width: 100%;">
              <dynamic-form v-model="serviceForm.fields" form-type="grid" :form-id="serviceForm.id"
                            no-actions ref="formService" @obtainedForm="form => serviceForm.data = form"
                            @validated="val => serviceForm.isValid = val"/>
            </q-scroll-area>
          </q-tab-panel>
          <!--Step Resource-->
          <q-tab-panel name="resource" v-if="!filterByResource">
            <q-scroll-area style="height: 350px; width: 100%;">
              <div class="row q-col-gutter-sm">
                <div v-for="(resource, keyResource) in resources" :key="keyResource" class="col-12"
                     @click="selectItem('resourceId', resource.id)">
                  <div :class="`item-selectable row items-center ${classSelected('resourceId', resource.id)}`">
                    <!--icon-->
                    <q-icon name="fas fa-chess-knight"/>
                    <!--Description-->
                    <div class="text-left">
                      <div>{{ resource.title }}</div>
                      <label class="text-grey-6 text-caption">
                        {{ selected.category.title }}, {{ selected.service.title }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-tab-panel>
          <!--Step Date-->
          <q-tab-panel name="date">
            <div class="row q-col-gutter-md">
              <dynamic-field v-for="(field, keyField) in formFields" :key="keyField" :field="field"
                             v-model="filters[keyField]" class="col-12"/>
            </div>
          </q-tab-panel>
          <!--availability-->
          <q-tab-panel name="availability">
            <q-scroll-area style="height: 370px; width: 100%;">
              <!--Not result-->
              <div v-if="!availabilities.length" class="q-mt-md">
                <not-result/>
              </div>
              <!--Availabilities-->
              <div v-else class="row q-col-gutter-sm">
                <template
                  v-for="(availability, keyService) in availabilities"
                  :key="keyService"
                >
                  <div
                    class="col-12"
                    @click="selectItem('availabilityId',availability.id)"
                    v-if="!availability.isBusy"
                  >
                    <div :class="`item-selectable row items-center ${classSelected('availabilityId',availability.id)}`">
                      <!--Icon-->
                      <q-icon name="fas fa-chess-knight"/>
                      <!--Description-->
                      <div class="text-left">
                        <!--Category and services selected-->
                        <div class="text-grey-6 text-caption">
                          {{ selected.category.title }}, {{ selected.service.title }}
                        </div>
                        <!--Resource-->
                        <div class="q-mb-xs">{{ availability.resource.title }}</div>
                        <!--Shifts date-->
                        <div class="text-blue">
                          {{ $trd(`${availability.calendarDate} ${availability.startTime}`, {type: 'shortHuman'}) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
        <q-separator class="q-mb-md q-mt-sm"/>
        <!--Actions-->
        <div id="actionsContent" class="row">
          <!--Previous-->
          <div class="col-4">
            <q-btn unelevated rounded v-bind="stepActions.previous.props" @click="stepActions.previous.action()"/>
          </div>
          <!--Next Action-->
          <div class="col-8 text-right">
            <!--Skip-->
            <q-btn unelevated rounded v-bind="stepActions.skip.props" class="q-mr-sm"
                   @click="stepActions.skip.action()" v-if="stepActions.skip.vIf"/>
            <!--Next-->
            <q-btn unelevated rounded @click="stepActions.next.action()" v-bind="stepActions.next.props"/>
          </div>
        </div>
        <!--inner loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      successReserve: false,
      step: 'category',
      filters: {
        categoryId: null,
        serviceId: null,
        resourceId: null,
        date: null,
        time: null,
        availabilityId: null
      },
      filterByResource: this.$route.query.resource,
      resourceData: false,
      categories: [],
      services: [],
      resources: [],
      availabilities: [],
      serviceForm: {},
      reservationData: null
    }
  },
  computed: {
    //Return settings data
    settings() {
      var timeRangeFilterSetting = this.$getSetting('ibooking::timeRangeFilter') || '{}'

      return {
        timeRangeFilter: typeof timeRangeFilterSetting === 'string' ? JSON.parse(timeRangeFilterSetting) : timeRangeFilterSetting,
        allowPublicReservation: parseInt(this.$getSetting('ibooking::allowPublicReservation'))
      }
    },
    //Allow public reservations
    allowPublicReservation() {
      if (!this.settings.allowPublicReservation && !this.$store.state.quserAuth.userId) return false
      return true
    },
    //Options to timeFilter
    optTimeFilter() {
      let response = []
      let labels = Object.keys(this.settings.timeRangeFilter).filter(item => item.includes('label'))
      let ranges = this.settings.timeRangeFilter

      labels.forEach((labelKey, index) => {
        let tmpIndex = index + 1
        if (ranges[`label${tmpIndex}`] && ranges[`startTime${tmpIndex}`] && ranges[`endTime${tmpIndex}`]) {
          response.push({label: ranges[labelKey], value: tmpIndex})
        }
      })

      return response
    },
    //steps
    steps() {
      //Instance response
      let response = this.filterByResource ? ['category', 'service', 'date', 'availability'] :
          ['category', 'service', 'resource', 'date', 'availability']

      //Add formService Step
      if (this.serviceForm.id) response.splice(2, 0, "formService")

      //Response
      return response
    },
    //Headers steppers
    headerSteps() {
      return {
        category: {
          title: this.$tr('ibooking.cms.titleStepCategory'),
          description: this.$tr('ibooking.cms.descriptionStepCategory')
        },
        service: {
          title: this.$tr('ibooking.cms.titleStepService'),
          description: this.$tr('ibooking.cms.descriptionStepService')
        },
        formService: {
          title: this.serviceForm.data?.title || this.$tr('ibooking.cms.titleStepService'),
          description: ''
        },
        resource: {
          title: this.$tr('ibooking.cms.titleStepResource'),
          description: this.$tr('ibooking.cms.descriptionStepResource')
        },
        date: {
          title: this.$tr('ibooking.cms.titleStepDate'),
          description: this.$tr('ibooking.cms.descriptionStepDate')
        },
        availability: {
          title: this.$tr('ibooking.cms.titleStepAvailability'),
          description: this.$tr('ibooking.cms.descriptionStepAvailability')
        }
      }
    },
    //Return options radio to progress
    optionsRadioTabs() {
      return this.steps.map(item => {
        return {label: '', value: item}
      })
    },
    //Step Actions
    stepActions() {
      return {
        previous: {
          props: {
            label: this.$tr('isite.cms.label.back'),
            color: "grey-7",
            outline: true
          },
          action: () => this.$refs.stepsForm.previous()
        },
        skip: {
          props: {
            label: this.$tr('isite.cms.label.skip'),
            color: "grey-7",
            outline: true
          },
          vIf: ['resource', 'date'].includes(this.step),
          action: () => this.$refs.stepsForm.next()
        },
        next: {
          props: {
            label: this.$tr('isite.cms.label.next'),
            color: "green",
            disable: ['category', 'service', 'availability'].includes(this.step) ?
                (this.filters[`${this.step}Id`] ? false : true) : false
          },
          action: () => {
            //Actions tƒo next step
            let actions = {
              category: this.filterByResource ? false : () => this.getServices(true),
              service: () => this.filterByResource ? false : this.getResources(true),
              formService: () => {
                //Validate form
                if (this.$refs.formService) this.$refs.formService.changeStep('next', true)
                //Change step if form is valid
                setTimeout(() => {
                  if (this.serviceForm.isValid) this.$refs.stepsForm.next()
                }, 200)
              },
              date: () => this.getAvailabilities(true),
              availability: () => this.createReservation()
            }

            //Call action
            if (actions[this.step]) actions[this.step]()

            //go to next step
            if (!['formService', 'availability'].includes(this.step)) this.$refs.stepsForm.next()
          }
        }
      }
    },
    //Selected items
    selected() {
      let category = this.categories.find(item => item.id == this.filters.categoryId)
      let service = this.services.find(item => item.id == this.filters.serviceId)
      let availability = this.availabilities.find(item => item.id == this.filters.availabilityId)

      return {
        category: category ? category : {},
        service: service ? service : {},
        availability: availability ? availability : {},
      }
    },
    //FormField
    formFields() {
      return {
        date: {
          type: 'date',
          props: {
            clearable: true,
            label: this.$tr('ibooking.cms.chooseDateReservation'),
            options: (date) => {
              //Limit to date from today
              return date >= this.$moment().format('YYYY/MM/DD')
            },
          }
        },
        time: {
          type: 'select',
          props: {
            clearable: true,
            label: this.$tr('ibooking.cms.chooseTimeReservation'),
            options: this.optTimeFilter
          }
        }
      }
    },
    //Default data to service for
    dataServiceForm() {
      //Instance fields
      let fields = {}
      try {
        fields = JSON.parse(this.$route.query.fields)
      } catch {
      }

      return {
        id: null,
        data: null,
        isValid: false,
        fields: this.$clone(fields)
      }
    }
  },
  methods: {
    init() {
      this.serviceForm = this.$clone(this.dataServiceForm)
      this.successReserve = false
      this.getData(true)
    },
    //get data
    async getData(refresh = false) {
      this.loading = true
      await this.getResourceData(true)
      if (!this.filterByResource) await this.getCategories(true)
      this.loading = false
    },
    //Get resource data
    getResourceData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.resourceData = false
        //Instance criteria
        let criteria = this.$route.meta.authenticated ? this.$store.state.quserAuth.userId : null;
        criteria = this.filterByResource || criteria;
        //Validate to get resources
        if (!criteria) return resolve(null)
        //Request params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'services.category',
            filter: {field: this.filterByResource ? 'id' : 'created_by'}
          }
        }

        //Request
        this.$crud.show('apiRoutes.qbooking.resources', criteria, requestParams).then(response => {
          if (!response.data) return resolve(null)
          //Set userId as resourceId
          this.filterByResource = criteria
          //Set resource data
          this.resourceData = response.data
          //Set resource selected
          this.selectItem('resourceId', this.filterByResource)
          //Set unique categories
          this.categories = Object.values(this.resourceData.services).map(item => item.category)
          this.categories = [...new Map(this.categories.map(item => [item['id'], item])).values()]
          //Set services
          this.services = this.resourceData.services

          //Set service
          if (this.$route.query.service) {
            let service = this.services.find(item => item.id == this.$route.query.service)
            if (service) {
              this.selectItem('serviceId', service.id)
              this.selectItem('categoryId', service.categoryId)
              this.step = service.formId ? 'formService' : 'date'
            }
          }

          resolve(response.data)
        }).catch(error => {
          resolve(error)
        })
      })
    },
    //Get booking categories
    getCategories(refresh = false) {
      return new Promise((resolve, reject) => {
        this.categories = []
        //Request params
        let requestParams = {
          refresh: refresh,
          params: {
            filter: {hasServices: true}
          }
        }
        //Request
        this.$crud.index('apiRoutes.qbooking.categories', requestParams).then(response => {
          this.categories = response.data
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(error)
          })
        })
      })
    },
    //Get booking categories
    getServices(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.services = []

        //Request params
        let requestParams = {
          refresh: refresh,
          params: {filter: {categoryId: this.filters.categoryId}}
        }

        //Request
        this.$crud.index('apiRoutes.qbooking.services', requestParams).then(response => {
          this.services = response.data
          resolve(response.data)
          this.loading = false
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
            reject(error)
          })
        })
      })
    },
    //Get booking categories
    getResources(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.resources = []
        //Request params
        let requestParams = {
          refresh: refresh,
          params: {filter: {services: [this.filters.serviceId]}}
        }
        //Request
        this.$crud.index('apiRoutes.qbooking.resources', requestParams).then(response => {
          this.resources = response.data
          resolve(response.data)
          this.loading = false
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
            reject(error)
          })
        })
      })
    },
    //Get Availabilities
    getAvailabilities(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.availabilities = []

        //Request params
        let requestParams = {
          refresh: refresh,
          params: {filter: this.$clone(this.filters)}
        }

        if (this.filters.time) {
          requestParams.params.filter.time = [
            this.settings.timeRangeFilter[`startTime${this.filters.time}`],
            this.settings.timeRangeFilter[`endTime${this.filters.time}`],
          ]
        }

        //Request
        this.$crud.index('apiRoutes.qbooking.availabilities', requestParams).then(response => {
          this.availabilities = response.data.map(item => {
            return {...item, id: this.$uid()}
          })
          resolve(response.data)
          this.loading = false
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
            reject(error)
          })
        })
      })
    },
    //Select Item
    selectItem(filterName, itemId) {
      this.filters[filterName] = (this.filters[filterName] == itemId) ? null : itemId
      //Load service form
      if (filterName == 'serviceId') {
        let service = this.services.find(item => item.id == itemId)
        this.serviceForm = {
          ...this.$clone(this.dataServiceForm),
          id: service.formId
        }
      }
    },
    //Return class to selected items
    classSelected(filterName, itemId) {
      if (this.filters[filterName] == itemId) return 'selected'
      return ''
    },
    //Create reservation
    createReservation() {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Request data
        let requestData = {
          customerId: this.$store.state.quserAuth.userId,
          items: [{
            ...this.serviceForm.fields,
            categoryId: this.selected.category.id,
            categoryTitle: this.selected.category.title,
            serviceId: this.selected.service.id,
            serviceTitle: this.selected.service.title,
            price: this.selected.service.price,
            resourceId: this.selected.availability.resource.id,
            resourceTitle: this.selected.availability.resource.title,
            startDate: `${this.selected.availability.calendarDate} ${this.selected.availability.startTime}`,
            endDate: `${this.selected.availability.calendarDate} ${this.selected.availability.endTime}`,
          }]
        }
        //Request
        this.$crud.create('apiRoutes.qbooking.reservations', requestData).then(response => {
          this.successReserve = true
          this.reservationData = response.data.reservation
          if (response.data && response.data.redirectTo) this.$helper.openExternalURL(response.data.redirectTo, true)
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Redirect after reservation
    actionAfterReservation(newReservation = false) {
      if (newReservation) window.location.reload()
      else {
        if (this.$store.state.quserAuth.authenticated) {
          this.$router.push({name: 'qbooking.panel.reservations.index'})
        } else {
          window.location.href = this.$store.state.qsiteApp.baseUrl
        }
      }
    }
  }
}
</script>
<style lang="scss">
#panelReservationForm {
  #bannerResourceData {
    padding: 15px;
    border-radius: 10px;

    .resource-image {
      height: 90px;
      width: 90px;
      border-radius: 10px;
    }
  }

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
}
</style>
