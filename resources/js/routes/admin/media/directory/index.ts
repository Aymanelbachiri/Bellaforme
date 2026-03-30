import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MediaController::deleteMethod
 * @see app/Http/Controllers/Admin/MediaController.php:230
 * @route '/admin/media/directory'
 */
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/media/directory',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MediaController::deleteMethod
 * @see app/Http/Controllers/Admin/MediaController.php:230
 * @route '/admin/media/directory'
 */
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MediaController::deleteMethod
 * @see app/Http/Controllers/Admin/MediaController.php:230
 * @route '/admin/media/directory'
 */
deleteMethod.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\MediaController::deleteMethod
 * @see app/Http/Controllers/Admin/MediaController.php:230
 * @route '/admin/media/directory'
 */
    const deleteMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MediaController::deleteMethod
 * @see app/Http/Controllers/Admin/MediaController.php:230
 * @route '/admin/media/directory'
 */
        deleteMethodForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const directory = {
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default directory