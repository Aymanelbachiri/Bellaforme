import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/nos-solutions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\SolutionsController::index
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
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
const SolutionsController = { index }

export default SolutionsController