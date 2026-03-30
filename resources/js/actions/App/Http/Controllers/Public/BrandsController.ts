import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/nos-marques',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\BrandsController::index
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
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
const BrandsController = { index }

export default BrandsController