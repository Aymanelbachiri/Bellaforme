import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/contact-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ContactMessageController::index
 * @see app/Http/Controllers/Admin/ContactMessageController.php:14
 * @route '/admin/contact-messages'
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
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
export const show = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/contact-messages/{contact_message}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
show.url = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contact_message: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    contact_message: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contact_message: args.contact_message,
                }

    return show.definition.url
            .replace('{contact_message}', parsedArgs.contact_message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
show.get = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
show.head = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
    const showForm = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
        showForm.get = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ContactMessageController::show
 * @see app/Http/Controllers/Admin/ContactMessageController.php:23
 * @route '/admin/contact-messages/{contact_message}'
 */
        showForm.head = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\ContactMessageController::destroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:32
 * @route '/admin/contact-messages/{contact_message}'
 */
export const destroy = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/contact-messages/{contact_message}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::destroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:32
 * @route '/admin/contact-messages/{contact_message}'
 */
destroy.url = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contact_message: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    contact_message: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contact_message: args.contact_message,
                }

    return destroy.definition.url
            .replace('{contact_message}', parsedArgs.contact_message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::destroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:32
 * @route '/admin/contact-messages/{contact_message}'
 */
destroy.delete = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ContactMessageController::destroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:32
 * @route '/admin/contact-messages/{contact_message}'
 */
    const destroyForm = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ContactMessageController::destroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:32
 * @route '/admin/contact-messages/{contact_message}'
 */
        destroyForm.delete = (args: { contact_message: string | number } | [contact_message: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\ContactMessageController::bulkDestroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:39
 * @route '/admin/contact-messages/bulk-destroy'
 */
export const bulkDestroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

bulkDestroy.definition = {
    methods: ["post"],
    url: '/admin/contact-messages/bulk-destroy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::bulkDestroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:39
 * @route '/admin/contact-messages/bulk-destroy'
 */
bulkDestroy.url = (options?: RouteQueryOptions) => {
    return bulkDestroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContactMessageController::bulkDestroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:39
 * @route '/admin/contact-messages/bulk-destroy'
 */
bulkDestroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkDestroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ContactMessageController::bulkDestroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:39
 * @route '/admin/contact-messages/bulk-destroy'
 */
    const bulkDestroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkDestroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ContactMessageController::bulkDestroy
 * @see app/Http/Controllers/Admin/ContactMessageController.php:39
 * @route '/admin/contact-messages/bulk-destroy'
 */
        bulkDestroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkDestroy.url(options),
            method: 'post',
        })
    
    bulkDestroy.form = bulkDestroyForm
const ContactMessageController = { index, show, destroy, bulkDestroy }

export default ContactMessageController