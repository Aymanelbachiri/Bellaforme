import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/brands',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:21
 * @route '/admin/brands'
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
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/brands/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::create
 * @see app/Http/Controllers/Admin/BrandController.php:28
 * @route '/admin/brands/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\BrandController::store
 * @see app/Http/Controllers/Admin/BrandController.php:36
 * @route '/admin/brands'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/brands',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::store
 * @see app/Http/Controllers/Admin/BrandController.php:36
 * @route '/admin/brands'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::store
 * @see app/Http/Controllers/Admin/BrandController.php:36
 * @route '/admin/brands'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::store
 * @see app/Http/Controllers/Admin/BrandController.php:36
 * @route '/admin/brands'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::store
 * @see app/Http/Controllers/Admin/BrandController.php:36
 * @route '/admin/brands'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
export const show = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/brands/{brand}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
show.url = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { brand: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    brand: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        brand: args.brand,
                }

    return show.definition.url
            .replace('{brand}', parsedArgs.brand.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
show.get = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
show.head = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
    const showForm = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
        showForm.get = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::show
 * @see app/Http/Controllers/Admin/BrandController.php:0
 * @route '/admin/brands/{brand}'
 */
        showForm.head = (args: { brand: string | number } | [brand: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
export const edit = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/brands/{brand}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
edit.url = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { brand: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { brand: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    brand: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        brand: typeof args.brand === 'object'
                ? args.brand.id
                : args.brand,
                }

    return edit.definition.url
            .replace('{brand}', parsedArgs.brand.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
edit.get = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
edit.head = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
    const editForm = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
        editForm.get = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:50
 * @route '/admin/brands/{brand}/edit'
 */
        editForm.head = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
export const update = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/brands/{brand}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
update.url = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { brand: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { brand: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    brand: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        brand: typeof args.brand === 'object'
                ? args.brand.id
                : args.brand,
                }

    return update.definition.url
            .replace('{brand}', parsedArgs.brand.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
update.put = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
update.patch = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
    const updateForm = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
        updateForm.put = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:60
 * @route '/admin/brands/{brand}'
 */
        updateForm.patch = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\BrandController::destroy
 * @see app/Http/Controllers/Admin/BrandController.php:80
 * @route '/admin/brands/{brand}'
 */
export const destroy = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/brands/{brand}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::destroy
 * @see app/Http/Controllers/Admin/BrandController.php:80
 * @route '/admin/brands/{brand}'
 */
destroy.url = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { brand: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { brand: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    brand: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        brand: typeof args.brand === 'object'
                ? args.brand.id
                : args.brand,
                }

    return destroy.definition.url
            .replace('{brand}', parsedArgs.brand.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::destroy
 * @see app/Http/Controllers/Admin/BrandController.php:80
 * @route '/admin/brands/{brand}'
 */
destroy.delete = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::destroy
 * @see app/Http/Controllers/Admin/BrandController.php:80
 * @route '/admin/brands/{brand}'
 */
    const destroyForm = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::destroy
 * @see app/Http/Controllers/Admin/BrandController.php:80
 * @route '/admin/brands/{brand}'
 */
        destroyForm.delete = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const brands = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default brands