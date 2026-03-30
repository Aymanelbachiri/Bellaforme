import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/newsletter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NewsletterController::index
 * @see app/Http/Controllers/Admin/NewsletterController.php:15
 * @route '/admin/newsletter'
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
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/newsletter/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NewsletterController::exportMethod
 * @see app/Http/Controllers/Admin/NewsletterController.php:41
 * @route '/admin/newsletter/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Admin\NewsletterController::destroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:22
 * @route '/admin/newsletter/{subscriber}'
 */
export const destroy = (args: { subscriber: number | { id: number } } | [subscriber: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/newsletter/{subscriber}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\NewsletterController::destroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:22
 * @route '/admin/newsletter/{subscriber}'
 */
destroy.url = (args: { subscriber: number | { id: number } } | [subscriber: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscriber: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscriber: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscriber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscriber: typeof args.subscriber === 'object'
                ? args.subscriber.id
                : args.subscriber,
                }

    return destroy.definition.url
            .replace('{subscriber}', parsedArgs.subscriber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NewsletterController::destroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:22
 * @route '/admin/newsletter/{subscriber}'
 */
destroy.delete = (args: { subscriber: number | { id: number } } | [subscriber: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\NewsletterController::destroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:22
 * @route '/admin/newsletter/{subscriber}'
 */
    const destroyForm = (args: { subscriber: number | { id: number } } | [subscriber: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\NewsletterController::destroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:22
 * @route '/admin/newsletter/{subscriber}'
 */
        destroyForm.delete = (args: { subscriber: number | { id: number } } | [subscriber: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\NewsletterController::bulkDestroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:29
 * @route '/admin/newsletter/bulk-destroy'
 */
export const bulkDestroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

bulkDestroy.definition = {
    methods: ["post"],
    url: '/admin/newsletter/bulk-destroy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NewsletterController::bulkDestroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:29
 * @route '/admin/newsletter/bulk-destroy'
 */
bulkDestroy.url = (options?: RouteQueryOptions) => {
    return bulkDestroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NewsletterController::bulkDestroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:29
 * @route '/admin/newsletter/bulk-destroy'
 */
bulkDestroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\NewsletterController::bulkDestroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:29
 * @route '/admin/newsletter/bulk-destroy'
 */
    const bulkDestroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkDestroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\NewsletterController::bulkDestroy
 * @see app/Http/Controllers/Admin/NewsletterController.php:29
 * @route '/admin/newsletter/bulk-destroy'
 */
        bulkDestroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkDestroy.url(options),
            method: 'post',
        })
    
    bulkDestroy.form = bulkDestroyForm
const NewsletterController = { index, exportMethod, destroy, bulkDestroy, export: exportMethod }

export default NewsletterController