import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/admin/regenerate-images/list',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
 */
    const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
 */
        listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:101
 * @route '/admin/regenerate-images/list'
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
 * @see routes/web.php:131
 * @route '/admin/regenerate-images/process'
 */
export const process = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/admin/regenerate-images/process',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:131
 * @route '/admin/regenerate-images/process'
 */
process.url = (options?: RouteQueryOptions) => {
    return process.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:131
 * @route '/admin/regenerate-images/process'
 */
process.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(options),
    method: 'post',
})

    /**
 * @see routes/web.php:131
 * @route '/admin/regenerate-images/process'
 */
    const processForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: process.url(options),
        method: 'post',
    })

            /**
 * @see routes/web.php:131
 * @route '/admin/regenerate-images/process'
 */
        processForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: process.url(options),
            method: 'post',
        })
    
    process.form = processForm
const regenerateImages = {
    list: Object.assign(list, list),
process: Object.assign(process, process),
}

export default regenerateImages