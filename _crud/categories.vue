<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      //Default filters
      let defaultFilters = (config('app.mode') == 'ipanel') ? {createdBy: this.$store.state.quserAuth.userId} : {}
      //Crud data
      return {
        crudId: this.crudId,
        entityName: config("main.qbooking.entityNames.category"),
        apiRoute: 'apiRoutes.qbooking.categories',
        permission: 'ibooking.categories',
        extraFormFields: 'ibooking.crud-fields.categories',
        create: {
          title: this.$tr('ibooking.cms.newCategory'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {name: 'slug', label: this.$tr('isite.cms.form.slug'), field: 'slug', align: 'left'},
            {
              name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'parent', filter: {...defaultFilters}}
        },
        update: {
          title: this.$tr('ibooking.cms.updateCategory'),
          requestParams: {include: 'parent', filter: {...defaultFilters}}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
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
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
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
              ],
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
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'}
              ],
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          parentId: {
            value: 0,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.parent'),
              options: [
                {label: this.$tr('isite.cms.label.disabled'), value: 0},
              ],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.categories',
              select: {label: 'title', id: 'id'},
              requestParams: {include: 'parent'}
            }
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.firstImage'),
              zone: 'mainimage',
              entity: "Modules\\Ibooking\\Entities\\Category",
              entityId: null
            }
          }
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
