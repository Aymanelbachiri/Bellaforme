import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\HomeController::home
 * @see app/Http/Controllers/Public/HomeController.php:14
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
export const contact = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
contact.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
contact.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
    const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contact.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
        contactForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\ContactController::contact
 * @see app/Http/Controllers/Public/ContactController.php:20
 * @route '/contact'
 */
        contactForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contact.form = contactForm
/**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
export const nosMarques = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosMarques.url(options),
    method: 'get',
})

nosMarques.definition = {
    methods: ["get","head"],
    url: '/nos-marques',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
nosMarques.url = (options?: RouteQueryOptions) => {
    return nosMarques.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
nosMarques.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosMarques.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
nosMarques.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nosMarques.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
    const nosMarquesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nosMarques.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
        nosMarquesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosMarques.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\BrandsController::nosMarques
 * @see app/Http/Controllers/Public/BrandsController.php:13
 * @route '/nos-marques'
 */
        nosMarquesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosMarques.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nosMarques.form = nosMarquesForm
/**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
export const nosReferences = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosReferences.url(options),
    method: 'get',
})

nosReferences.definition = {
    methods: ["get","head"],
    url: '/nos-references',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
nosReferences.url = (options?: RouteQueryOptions) => {
    return nosReferences.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
nosReferences.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosReferences.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
nosReferences.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nosReferences.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
    const nosReferencesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nosReferences.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
        nosReferencesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosReferences.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\ReferencesController::nosReferences
 * @see app/Http/Controllers/Public/ReferencesController.php:13
 * @route '/nos-references'
 */
        nosReferencesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosReferences.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nosReferences.form = nosReferencesForm
/**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
export const nosCatalogues = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosCatalogues.url(options),
    method: 'get',
})

nosCatalogues.definition = {
    methods: ["get","head"],
    url: '/nos-catalogues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
nosCatalogues.url = (options?: RouteQueryOptions) => {
    return nosCatalogues.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
nosCatalogues.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosCatalogues.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
nosCatalogues.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nosCatalogues.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
    const nosCataloguesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nosCatalogues.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
        nosCataloguesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosCatalogues.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\CataloguesController::nosCatalogues
 * @see app/Http/Controllers/Public/CataloguesController.php:13
 * @route '/nos-catalogues'
 */
        nosCataloguesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosCatalogues.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nosCatalogues.form = nosCataloguesForm
/**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
export const nosSolutions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosSolutions.url(options),
    method: 'get',
})

nosSolutions.definition = {
    methods: ["get","head"],
    url: '/nos-solutions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
nosSolutions.url = (options?: RouteQueryOptions) => {
    return nosSolutions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
nosSolutions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nosSolutions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
nosSolutions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nosSolutions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
    const nosSolutionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nosSolutions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
        nosSolutionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosSolutions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\SolutionsController::nosSolutions
 * @see app/Http/Controllers/Public/SolutionsController.php:13
 * @route '/nos-solutions'
 */
        nosSolutionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nosSolutions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nosSolutions.form = nosSolutionsForm
/**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/qui-sommes-nous',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
    const aboutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: about.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
        aboutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:42
 * @route '/qui-sommes-nous'
 */
        aboutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    about.form = aboutForm
/**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:55
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm