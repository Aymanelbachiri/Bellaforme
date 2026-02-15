import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/email-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::edit
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:16
 * @route '/admin/email-settings'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::update
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:42
 * @route '/admin/email-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/email-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::update
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:42
 * @route '/admin/email-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::update
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:42
 * @route '/admin/email-settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::update
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:42
 * @route '/admin/email-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::update
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:42
 * @route '/admin/email-settings'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::test
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:83
 * @route '/admin/email-settings/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/admin/email-settings/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::test
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:83
 * @route '/admin/email-settings/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailSettingsController::test
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:83
 * @route '/admin/email-settings/test'
 */
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::test
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:83
 * @route '/admin/email-settings/test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: test.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailSettingsController::test
 * @see app/Http/Controllers/Admin/EmailSettingsController.php:83
 * @route '/admin/email-settings/test'
 */
        testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: test.url(options),
            method: 'post',
        })
    
    test.form = testForm
const emailSettings = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
test: Object.assign(test, test),
}

export default emailSettings