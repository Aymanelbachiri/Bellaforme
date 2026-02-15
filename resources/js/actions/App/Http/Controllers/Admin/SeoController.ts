import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/seo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SeoController::edit
 * @see app/Http/Controllers/Admin/SeoController.php:26
 * @route '/admin/seo'
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
* @see \App\Http\Controllers\Admin\SeoController::update
 * @see app/Http/Controllers/Admin/SeoController.php:50
 * @route '/admin/seo'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/seo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SeoController::update
 * @see app/Http/Controllers/Admin/SeoController.php:50
 * @route '/admin/seo'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SeoController::update
 * @see app/Http/Controllers/Admin/SeoController.php:50
 * @route '/admin/seo'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SeoController::update
 * @see app/Http/Controllers/Admin/SeoController.php:50
 * @route '/admin/seo'
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
* @see \App\Http\Controllers\Admin\SeoController::update
 * @see app/Http/Controllers/Admin/SeoController.php:50
 * @route '/admin/seo'
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
const SeoController = { edit, update }

export default SeoController