import { defineStore } from 'pinia'
import { useCrudStore } from 'stores/crud'

export const useCategoriesStore = defineStore('categories', () => {

  const { crudAction, notifyAction } = useCrudStore()

  function categoriesAction() {
    crudAction({
      url: 'api/categories/categories',
      method: 'get', mutate: 'categoriesGetter'
    }).catch((e: unknown) => notifyAction({error: 'categoriesAction', e}))
  } return { categoriesAction } // TagCategories: CategoriesModule

})
