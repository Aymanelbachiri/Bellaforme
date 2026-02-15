import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/homepage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HomepageController::edit
 * @see app/Http/Controllers/Admin/HomepageController.php:15
 * @route '/admin/homepage'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\HomepageController::update
 * @see app/Http/Controllers/Admin/HomepageController.php:30
 * @route '/admin/homepage'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/homepage',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\HomepageController::update
 * @see app/Http/Controllers/Admin/HomepageController.php:30
 * @route '/admin/homepage'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HomepageController::update
 * @see app/Http/Controllers/Admin/HomepageController.php:30
 * @route '/admin/homepage'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\HomepageController::update
 * @see app/Http/Controllers/Admin/HomepageController.php:30
 * @route '/admin/homepage'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HomepageController::update
 * @see app/Http/Controllers/Admin/HomepageController.php:30
 * @route '/admin/homepage'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const HomepageController = { edit, update }

export default HomepageController