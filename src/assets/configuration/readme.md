Variables that will be available until runtime.

One json file is selected from success response of `/rest/v2/basesites?active=true`

Useful to select a different value by environment:
* Development
* Staging
* Production

If you need a value available from build time use `src/environments/environment`
Be aware that with built-in Angular environment-specific ONLY are available **development** and **production** NOT staging.
