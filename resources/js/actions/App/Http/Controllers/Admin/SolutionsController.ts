import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/solutions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SolutionsController::edit
 * @see app/Http/Controllers/Admin/SolutionsController.php:17
 * @route '/admin/solutions'
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
* @see \App\Http\Controllers\Admin\SolutionsController::update
 * @see app/Http/Controllers/Admin/SolutionsController.php:31
 * @route '/admin/solutions'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/solutions',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SolutionsController::update
 * @see app/Http/Controllers/Admin/SolutionsController.php:31
 * @route '/admin/solutions'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SolutionsController::update
 * @see app/Http/Controllers/Admin/SolutionsController.php:31
 * @route '/admin/solutions'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SolutionsController::update
 * @see app/Http/Controllers/Admin/SolutionsController.php:31
 * @route '/admin/solutions'
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
* @see \App\Http\Controllers\Admin\SolutionsController::update
 * @see app/Http/Controllers/Admin/SolutionsController.php:31
 * @route '/admin/solutions'
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
const SolutionsController = { edit, update }

export default SolutionsController