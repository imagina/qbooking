<template>
  <div id="userReousrcePage">
    <!--Content-->
    <div id="userReousrcePageContent" class="row q-col-gutter-md">
      <div class="col-12 col-lg-6 offset-lg-3 relative-position ">
        <!--page actions-->
        <div class="box box-auto-height q-mb-md">
          <page-actions :title="$route.meta.title" @refresh="init" :extra-actions="extraPageActions"/>
        </div>
        <!--Form-->
        <dynamic-form v-model="form" v-bind="formProps" @submit="saveResource"/>
        <!--Inner loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
    <!--Modal to share-->
    <master-modal v-model="shareModal" custom-position v-if="this.userResource ? true : false"
                  :title="`${$tr('isite.cms.label.share')} | ${$route.meta.title}`">
      <div class="box box-auto-height">
        <!--Help banner-->
        <dynamic-field :field="shareOptions.helpField"/>
        <!--List options to share-->
        <q-list rounded separator>
          <q-item clickable v-ripple v-for="(opt, keyOpt) in shareOptions.options" :key="keyOpt"
                  @click.native="$helper.copyToClipboard(opt.path)" unelevated round>
            <q-item-section class="text-blue-grey">{{ opt.label }}</q-item-section>
            <q-item-section avatar>
              <q-icon name="fas fa-copy" color="info" size="sm"/>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </master-modal>
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
      userResource: false,
      form: {},
      shareModal: false
    }
  },
  computed: {
    //Settings
    settings() {
      return {
        createExternalMeeting: this.$getSetting('ibooking::createExternalMeeting')
      }
    },
    //Return user data
    userData() {
      return this.$store.state.quserAuth.userData
    },
    //Extra Page actions
    extraPageActions() {
      return [
        {//action to copy user resource link, new reservation
          label: this.$tr(`isite.cms.label.share`),
          vIf: this.userResource ? true : false,
          props: {
            icon: 'fas fa-share-alt'
          },
          action: () => this.shareModal = true
        }
      ]
    },
    //Return user resource form
    formProps() {
      let formprops = {
        formType: 'grid',
        defaultColClass: 'col-12',
        blocks: [
          {
            title: this.$tr('isite.cms.label.availability'),
            fields: {
              schedule: {
                value: null,
                type: 'schedulable',
                props: {},
              },
            }
          },
          {
            title: this.$tr('ibooking.cms.myResource'),
            fields: {
              mediasSingle: {
                name: 'mediasSingle',
                value: {},
                type: 'media',
                fieldItemId: this.userResource.id || null,
                props: {
                  label: this.$tr('isite.cms.form.firstImage'),
                  zone: 'mainimage',
                  entity: "Modules\\Ibooking\\Entities\\Resource",
                  entityId: this.userResource.id || null
                }
              },
              title: {
                value: this.userData.fullName,
                type: 'input',
                isTranslatable: true,
                props: {
                  label: `${this.$tr('isite.cms.form.title')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ],
                },
              },
              slug: {
                value: this.$helper.getSlug(this.userData.fullName) + '-' + this.$store.state.quserAuth.userId,
                isTranslatable: true
              },
              status: {
                value: '1',
                type: 'select',
                isTranslatable: false,
                props: {
                  label: `${this.$tr('isite.cms.form.status')}*`,
                  options: [
                    {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                    {label: this.$tr('isite.cms.label.disabled'), value: '0'}
                  ],
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ],
                }
              },
              services: {
                value: [],
                type: 'crud',
                props: {
                  type: 'select',
                  crudData: import('modules/qbooking/_crud/services'),
                  crudProps: {
                    label: `${this.$trp('isite.cms.label.service')}*`,
                    multiple: true,
                    rules: [
                      val => val.length || this.$tr('isite.cms.message.fieldRequired')
                    ]
                  },
                  config: {
                    requestParams: {
                      filter: !this.$hasAccess('ibooking.services.manage') ? {} :
                          {createdBy: this.$store.state.quserAuth.userId}
                    }
                  },
                },
              },
              description: {
                value: `${this.userData.fullName}...`,
                type: 'input',
                isTranslatable: true,
                props: {
                  label: `${this.$tr('isite.cms.form.description')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ],
                  type: 'textarea',
                  rows: "3"
                }
              }
            }
          }
        ]
      }

      //Validate if request externalmeet provider
      if (this.settings.createExternalMeeting)
        formprops.blocks.push({
          title: this.$trp('ibooking.cms.meetingPlatform'),
          fields: {
            textInfo: {
              type: 'banner',
              props: {
                textColor: 'white',
                ...this.meetInfoConfig
              }
            },
            email: {
              value: null,
              type: 'input',
              fakeFieldName: 'options',
              help: {description: this.$tr('ibooking.cms.termsZoom')},
              props: {
                label: `Zoom | ${this.$tr('isite.cms.form.email')}`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                  val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                ],
              }
            }
          }
        })

      //Response
      return formprops
    },
    //help banner to meet
    meetInfoConfig() {
      //Instance config key
      let configKey = (!this.userResource || !this.userResource.meetingConfig) ? 0 :
          this.userResource.meetingConfig.providerStatus

      //instance banner config
      let configs = {
        //No added to zoom
        0: {
          color: 'amber',
          icon: 'fas fa-exclamation-triangle',
          message: this.$tr('ibooking.cms.message.meet.notFound'),
          actions: [
            {
              props: {
                label: this.$tr('ibooking.cms.registerZoom')
              },
              action: () => {
                this.$helper.openExternalURL('https://zoom.us/signin', true)
              }
            }
          ]
        },
        //Pending to verified
        1: {
          color: 'info',
          icon: 'fas fa-info-circle',
          message: this.$tr('ibooking.cms.message.meet.pending')
        },
        //Added
        2: {
          color: 'green',
          icon: 'fas fa-check-circle',
          message: this.$tr('ibooking.cms.message.meet.success')
        }
      }

      //Response
      return configs[configKey]
    },
    //Share options
    shareOptions() {
      //Instance baseUrl
      let baseUrl = this.$store.state.qsiteApp.baseUrl

      //Instance options
      let options = [
        {
          label: `${this.$tr('isite.cms.label.share')} ${this.$route.meta.title}`,
          path: `${baseUrl}/ibooking/recursos/${this.userResource.id}`
        }
      ];

      //Add services options
      (this.userResource.services || []).forEach(service => {
        options.push({
          label: `${this.$tr('isite.cms.label.share')} ${this.$tr('isite.cms.label.service')}: ${service.title}`,
          path: `${baseUrl}/ipanel/#/booking/reservations/create?resource=${this.userResource.id}&service=${service.id}`
        })
      })

      //response
      return {
        helpField: {
          type: 'banner',
          props: {message: this.$tr('ibooking.cms.helpShareUserResource')}
        },
        options: options
      }
    }
  },
  methods: {
    init() {
      this.getUserResource()
    },
    //Get user resource
    getUserResource() {
      return new Promise((resolve, reject) => {
        this.loading = true

        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: 'services,schedule.workTimes',
            filter: {field: 'created_by', allTranslations: true, withMeetingConfig: 'zoom'}
          }
        }

        //Request
        this.$crud.show('apiRoutes.qbooking.resources', this.userData.id, requestParams).then(response => {
          this.userResource = response.data
          setTimeout(() => {
            this.form = this.$clone(response.data)
            this.loading = false
          }, 200)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
          })
        })
      })
    },
    //Save resource
    saveResource() {
      return new Promise((resolve, reject) => {
        this.loading = true
        //instance formData
        let formData = {
          ...this.form,
          meetingConfig: {
            providerName: 'zoom',
            email: this.form.options.email
          }
        }

        //Update resource
        if (this.userResource) {
          this.$crud.update('apiRoutes.qbooking.resources', this.userResource.id, formData).then(response => {
            this.$alert.info(this.$tr('isite.cms.message.recordUpdated'))
            this.getUserResource()
          }).catch(error => {
            console.error('update', error)
            this.loading = false
            this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          })
        }
        //cretae resource
        if (!this.userResource) {
          this.$crud.create('apiRoutes.qbooking.resources', formData).then(response => {
            this.$alert.info({message: this.$tr('isite.cms.message.recordUpdated')})
            this.getUserResource()
          }).catch(error => {
            console.error('create', error)
            this.loading = false
            this.$alert.error(this.$tr('isite.cms.message.recordNoUpdated'))
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
#userReousrcePage {
  #meetSection {
    #dynamicFormComponentContent {
      box-shadow: none;
      padding: 0;
    }
  }
}
</style>
