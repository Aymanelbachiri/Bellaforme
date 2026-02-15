import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
export const show = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{division}/category/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
show.url = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    division: args[0],
                    slug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        division: args.division,
                                slug: args.slug,
                }

    return show.definition.url
            .replace('{division}', parsedArgs.division.toString())
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
show.get = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
show.head = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
    const showForm = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
        showForm.get = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\CategoryController::show
 * @see app/Http/Controllers/Public/CategoryController.php:14
 * @route '/{division}/category/{slug}'
 */
        showForm.head = (args: { division: string | number, slug: string | number } | [division: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const CategoryController = { show }

export default CategoryController