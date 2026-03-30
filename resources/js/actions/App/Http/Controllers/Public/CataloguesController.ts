import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/nos-catalogues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\CataloguesController::index
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
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
const CataloguesController = { index }

export default CataloguesController