<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qbooking.entityNames.resource'),
        apiRoute: 'apiRoutes.qbooking.resources',
        permission: 'ibooking.resources',
        extraFormFields: 'ibooking.crud-fields.resources',
        create: {
          title: this.$tr('ibooking.cms.newResource')
        },
        read: {
          columns: [
            { name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px' },
            { name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth' },
            { name: 'slug', label: this.$tr('isite.cms.form.slug'), field: 'slug', align: 'left' },
            {
              name: 'assignedTo',
              label: this.$tr('isite.cms.form.assignedTo'),
              field: 'assignedTo',
              align: 'left',
              format: val => val ? `${val.firstName} ${val.lastName}` : ''
            },
            { name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'left' },
            {
              name: 'services', label: this.$trp('isite.cms.label.service'), field: 'services',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => item.title).join(', ') : ''
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ],
          requestParams: { include: 'services,qrs,assignedTo' }
        },
        update: {
          title: this.$tr('ibooking.cms.updateResource'),
          requestParams: { include: 'services,schedule.workTimes' }
        },
        delete: true,
        formLeft: {
          id: { value: '' },
          userId: { value: this.$store.state.quserAuth.userId },
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          slug: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          }
        },
        formRight: {
          status: {
            value: '1',
            type: 'select',
            isTranslatable: false,
            props: {
              label: `${this.$tr('isite.cms.form.status')}*`,
              options: [
                { label: this.$tr('isite.cms.label.enabled'), value: '1' },
                { label: this.$tr('isite.cms.label.disabled'), value: '0' }
              ],
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          assignedToId: {
            value: null,
            type: 'select',
            required: true,
            props: {
              label: this.$tr('isite.cms.form.assignedTo') + '*'
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.users',
              select: { label: 'fullName', id: 'id' },
              filterByQuery: true
            }
          },
          services: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('modules/qbooking/_crud/services'),
              crudProps: {
                label: this.$trp('isite.cms.label.service'),
                multiple: true,
                useChips: true
              }
            }
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.firstImage'),
              zone: 'mainimage',
              entity: 'Modules\\Ibooking\\Entities\\Resource',
              entityId: null
            }
          },
          schedule: {
            type: 'schedulable',
            props: {}
          }
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  }
};
</script>
