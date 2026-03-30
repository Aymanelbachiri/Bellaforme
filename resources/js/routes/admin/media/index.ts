import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import directoryCf8989 from './directory'
/**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MediaController::index
 * @see app/Http/Controllers/Admin/MediaController.php:20
 * @route '/admin/media'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/admin/media/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
    const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
        listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MediaController::list
 * @see app/Http/Controllers/Admin/MediaController.php:28
 * @route '/admin/media/list'
 */
        listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    list.form = listForm
/**
* @see \App\Http\Controllers\Admin\MediaController::upload
 * @see app/Http/Controllers/Admin/MediaController.php:131
 * @route '/admin/media/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/admin/media/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MediaController::upload
 * @see app/Http/Controllers/Admin/MediaController.php:131
 * @route '/admin/media/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MediaController::upload
 * @see app/Http/Controllers/Admin/MediaController.php:131
 * @route '/admin/media/upload'
 */
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MediaController::upload
 * @see app/Http/Controllers/Admin/MediaController.php:131
 * @route '/admin/media/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MediaController::upload
 * @see app/Http/Controllers/Admin/MediaController.php:131
 * @route '/admin/media/upload'
 */
        uploadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\Admin\MediaController::destroy
 * @see app/Http/Controllers/Admin/MediaController.php:181
 * @route '/admin/media/delete'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/media/delete',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MediaController::destroy
 * @see app/Http/Controllers/Admin/MediaController.php:181
 * @route '/admin/media/delete'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MediaController::destroy
 * @see app/Http/Controllers/Admin/MediaController.php:181
 * @route '/admin/media/delete'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\MediaController::destroy
 * @see app/Http/Controllers/Admin/MediaController.php:181
 * @route '/admin/media/delete'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MediaController::destroy
 * @see app/Http/Controllers/Admin/MediaController.php:181
 * @route '/admin/media/delete'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\MediaController::directory
 * @see app/Http/Controllers/Admin/MediaController.php:209
 * @route '/admin/media/directory'
 */
export const directory = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: directory.url(options),
    method: 'post',
})

directory.definition = {
    methods: ["post"],
    url: '/admin/media/directory',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MediaController::directory
 * @see app/Http/Controllers/Admin/MediaController.php:209
 * @route '/admin/media/directory'
 */
directory.url = (options?: RouteQueryOptions) => {
    return directory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MediaController::directory
 * @see app/Http/Controllers/Admin/MediaController.php:209
 * @route '/admin/media/directory'
 */
directory.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: directory.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MediaController::directory
 * @see app/Http/Controllers/Admin/MediaController.php:209
 * @route '/admin/media/directory'
 */
    const directoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: directory.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MediaController::directory
 * @see app/Http/Controllers/Admin/MediaController.php:209
 * @route '/admin/media/directory'
 */
        directoryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: directory.url(options),
            method: 'post',
        })
    
    directory.form = directoryForm
const media = {
    index: Object.assign(index, index),
list: Object.assign(list, list),
upload: Object.assign(upload, upload),
destroy: Object.assign(destroy, destroy),
directory: Object.assign(directory, directoryCf8989),
}

export default media